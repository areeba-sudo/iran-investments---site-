# Deployment & CMS Guide — Iran Investments

This site is an **Astro** static site, hosted on **Netlify**, with content managed in
**Sanity** (project `h4z2q6ep`, dataset `production`). Publishing in Sanity triggers a
fresh Netlify build automatically.

## Architecture

```
Sanity Studio  ──(editor publishes)──►  Sanity webhook
                                              │
                                              ▼
                                   Netlify Build Hook (URL)
                                              │
                                              ▼
              GitHub repo ──► Netlify build (npm run build) ──► live site
```

- **Repo:** https://github.com/areeba-sudo/iran-investments---site-
- Every push to `main` auto-deploys via Netlify.
- Every publish in Sanity pings the Netlify Build Hook, which rebuilds the site with the
  latest content.

## Netlify build settings

Defined in `netlify.toml` (no manual config needed in the Netlify UI):

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 22
- `SANITY_PROJECT_ID=h4z2q6ep`, `SANITY_DATASET=production`

## One-time setup

### 1. Connect Netlify to GitHub
1. Log in at https://app.netlify.com
2. **Add new site → Import an existing project → GitHub**
3. Authorize Netlify, then pick `iran-investments---site-`
4. Netlify reads `netlify.toml` automatically — just click **Deploy**.

### 2. Create a Build Hook
1. Site → **Site configuration → Build & deploy → Build hooks → Add build hook**
2. Name: `Sanity publish`, branch: `main`
3. Copy the generated URL (looks like `https://api.netlify.com/build_hooks/XXXX`)

### 3. Point Sanity at the Build Hook
1. Go to https://www.sanity.io/manage/project/h4z2q6ep → **API → Webhooks → Create webhook**
2. Name: `Netlify rebuild`
3. URL: paste the Build Hook URL from step 2
4. Trigger on: **Create, Update, Delete**
5. Filter: leave default (whole dataset), HTTP method **POST**, no secret needed
6. Save.

Now editing + publishing any post or homepage field in Sanity Studio rebuilds the live
site within a minute or two.

## Newsletter & gated PDF downloads (Beehiiv)

Subscribe forms and "Get it now" guide downloads run through Netlify Functions
(`netlify/functions/`) so the Beehiiv API key never reaches the browser.

One-time setup:

1. In Beehiiv: **Settings → Integrations → API** → create an API key.
2. In Netlify: **Site configuration → Environment variables** → add:
   - `BEEHIIV_API_KEY` = the key from step 1
   - `BEEHIIV_PUBLICATION_ID` = `pub_ecda52e9-1b37-4a8c-80c3-7438b9bcd124` (optional —
     this is already the default)
3. Redeploy.

How it works:
- **Subscribe** (masthead button, homepage strip, modal) → `/api/subscribe` → adds the
  email to the Beehiiv publication (`utm_medium=subscribe_form`).
- **Guide download** → `/api/get-guide` → subscribes the email tagged with the guide's
  **Beehiiv tag** (`utm_medium=guide_download`, `utm_campaign=<tag>`), then returns the
  PDF from Sanity and the browser downloads it. Conversion per guide is visible in
  Beehiiv under subscriber UTM data.

## Live market ticker (Alpha Vantage)

The homepage Market Snapshot shows the Iran figures from the CMS (Homepage → Market
Snapshot), and auto-updates the **Brent oil** price from a free feed via
`/api/market` (a Netlify function, CDN-cached ~6h so it stays inside the free tier).

1. Get a free key at https://www.alphavantage.co/support/#api-key
2. In Netlify → **Environment variables** → add `ALPHAVANTAGE_API_KEY` = the key.
3. Redeploy.

If the key is unset, the ticker just shows the CMS values — no error.

## Optional for a staging deploy

`BEEHIIV_API_KEY` and `ALPHAVANTAGE_API_KEY` are **both optional**. Without them the site
deploys and runs fine: newsletter signups return a friendly "not configured yet" message
and the oil price falls back to the CMS value. Add them when moving to the real domain.

## Editing content (for the client)

Run the Studio locally, or deploy it once with `npm --prefix studio run deploy` to get a
hosted `*.sanity.studio` URL you can log into from anywhere.

- **Homepage** → curate the hero carousel, secondary stories, market snapshot numbers,
  featured guide, sector cards, and featured insight. Anything left empty falls back to
  the latest content automatically.
- **Site Settings** → site name, tagline, footer columns, social links, subscribe copy.
- **Articles** → write/publish with the rich-text editor, pick a Section and Author,
  set cover image and SEO.
- **Sections** → add/rename/reorder the site's sections (drives the nav menu and the
  homepage sector cards). No developer needed.
- **Authors** → names, roles, photos shown on articles.
- **Guides (PDFs)** → upload a PDF + description; it appears on `/guides/` with an
  email-gated download. Set the *Beehiiv tag* to track which guide converts.
- **Podcast Episodes** → ready in the CMS now; the public podcast page ships later.

## Local development

```bash
npm install            # from site/
npm run dev            # astro dev server at http://localhost:4321
npm --prefix studio run dev   # Sanity Studio at http://localhost:3333
```
