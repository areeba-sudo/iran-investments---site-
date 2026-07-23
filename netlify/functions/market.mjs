// Live market data for the homepage ticker — currently just the global Brent
// crude price (free). GET /api/market -> { brent?: { value, change, direction, asOf } }.
//
// The response is CDN-cached ~6h, so the upstream free API is hit only a few
// times a day no matter how many visitors load the homepage (stays inside the
// free tier). If the key is missing or the fetch fails, it returns {} and the
// ticker simply keeps the CMS-managed value — nothing breaks.
//
// Setup: create a free key at alphavantage.co and set ALPHAVANTAGE_API_KEY in
// Netlify → Site settings → Environment variables. Iran-specific figures stay
// CMS-managed in Sanity; they are not fetched here.

const CACHE_HEADERS = {
  'Netlify-CDN-Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
  'Cache-Control': 'public, max-age=300',
};

export default async () => {
  const key = process.env.ALPHAVANTAGE_API_KEY;
  if (!key) return Response.json({}, { headers: CACHE_HEADERS });

  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=BRENT&interval=daily&apikey=${key}`
    );
    const json = await res.json();
    const series = Array.isArray(json.data)
      ? json.data.filter((d) => d && d.value && d.value !== '.')
      : [];
    if (series.length < 2) return Response.json({}, { headers: CACHE_HEADERS });

    const latest = parseFloat(series[0].value);
    const prev = parseFloat(series[1].value);
    if (!Number.isFinite(latest) || !Number.isFinite(prev)) {
      return Response.json({}, { headers: CACHE_HEADERS });
    }
    const pct = prev ? ((latest - prev) / prev) * 100 : 0;

    return Response.json(
      {
        brent: {
          value: `$${latest.toFixed(2)}`,
          change: Math.abs(pct).toFixed(1),
          direction: pct >= 0 ? 'up' : 'down-bad',
          asOf: series[0].date,
        },
      },
      { headers: CACHE_HEADERS }
    );
  } catch {
    return Response.json({}, { headers: CACHE_HEADERS });
  }
};

export const config = { path: '/api/market' };
