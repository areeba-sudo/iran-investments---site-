// Email-gated PDF guide download.
// POST { email, guideId } -> subscribes the email via Beehiiv (tagged with the
// guide's UTM campaign) and returns the guide's PDF URL from Sanity.
const PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID || 'pub_ecda52e9-1b37-4a8c-80c3-7438b9bcd124';
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || 'h4z2q6ep';
const SANITY_DATASET = process.env.SANITY_DATASET || 'production';

async function fetchGuide(guideId) {
  const url = new URL(`https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}`);
  url.searchParams.set(
    'query',
    `*[_type == "guide" && _id == $id][0]{ title, "pdfUrl": pdfFile.asset->url, beehiivTag }`
  );
  url.searchParams.set('$id', JSON.stringify(guideId));
  const res = await fetch(url);
  if (!res.ok) return null;
  const { result } = await res.json();
  return result || null;
}

export default async (request) => {
  if (request.method !== 'POST') {
    return Response.json({ ok: false, error: 'Method not allowed' }, { status: 405 });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  if (!apiKey) {
    return Response.json(
      { ok: false, error: 'Downloads are not configured yet (missing BEEHIIV_API_KEY).' },
      { status: 503 }
    );
  }

  let email = '';
  let guideId = '';
  try {
    ({ email, guideId } = await request.json());
  } catch {
    /* fall through to validation */
  }
  email = (email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (!guideId) {
    return Response.json({ ok: false, error: 'Missing guide reference.' }, { status: 400 });
  }

  const guide = await fetchGuide(guideId);
  if (!guide?.pdfUrl) {
    return Response.json({ ok: false, error: 'Guide not found or has no PDF attached.' }, { status: 404 });
  }

  const res = await fetch(`https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: 'website',
      utm_medium: 'guide_download',
      utm_campaign: guide.beehiivTag || guideId,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('Beehiiv guide subscribe failed:', res.status, detail);
    return Response.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 502 });
  }

  // `?dl=` makes the Sanity CDN send a download Content-Disposition.
  const filename = `${(guide.title || 'guide').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.pdf`;
  return Response.json({ ok: true, pdfUrl: `${guide.pdfUrl}?dl=${filename}` });
};

export const config = { path: '/api/get-guide' };
