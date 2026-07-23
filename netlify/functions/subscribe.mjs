// Newsletter signup — proxies to Beehiiv so the API key stays server-side.
// POST { email } -> { ok: true } | { ok: false, error }
const PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID || 'pub_ecda52e9-1b37-4a8c-80c3-7438b9bcd124';

export default async (request) => {
  if (request.method !== 'POST') {
    return Response.json({ ok: false, error: 'Method not allowed' }, { status: 405 });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  if (!apiKey) {
    return Response.json(
      { ok: false, error: 'Newsletter is not configured yet (missing BEEHIIV_API_KEY).' },
      { status: 503 }
    );
  }

  let email = '';
  try {
    ({ email } = await request.json());
  } catch {
    /* fall through to validation */
  }
  email = (email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
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
      utm_medium: 'subscribe_form',
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('Beehiiv subscribe failed:', res.status, detail);
    return Response.json({ ok: false, error: 'Subscription failed. Please try again.' }, { status: 502 });
  }

  return Response.json({ ok: true });
};

export const config = { path: '/api/subscribe' };
