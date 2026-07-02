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

## Editing content (for the client)

Run the Studio locally, or deploy it once with `npm --prefix studio run deploy` to get a
hosted `*.sanity.studio` URL you can log into from anywhere.

- **Homepage** → edit hero, stats, section copy, SEO.
- **Blog Posts** → write/publish articles with the rich-text editor, upload cover images,
  set SEO title/description per post.

## Local development

```bash
npm install            # from site/
npm run dev            # astro dev server at http://localhost:4321
npm --prefix studio run dev   # Sanity Studio at http://localhost:3333
```
