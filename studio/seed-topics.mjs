// Seeds the "Sectors" section tabs (topics) + dummy articles per tab, and files
// the existing 2 sectors articles under a topic. Re-runnable via stable _ids.
// Run: node --env-file=.env seed-topics.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public/design');

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_MIGRATE_TOKEN,
  useCdn: false,
});

const rk = () => Math.random().toString(36).slice(2, 10);
const para = (t) => ({ _type: 'block', _key: rk(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: rk(), text: t, marks: [] }] });
const quote = (t) => ({ _type: 'block', _key: rk(), style: 'blockquote', markDefs: [], children: [{ _type: 'span', _key: rk(), text: t, marks: [] }] });

const cache = new Map();
async function img(filename) {
  if (cache.has(filename)) return cache.get(filename);
  const asset = await client.assets.upload('image', fs.readFileSync(path.join(publicDir, filename)), { filename });
  const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  cache.set(filename, ref);
  return ref;
}

const SECTION = 'section-sectors';
const TOPICS = [
  { id: 'topic-pharmaceuticals', title: 'Pharmaceuticals', slug: 'pharmaceuticals', order: 10 },
  { id: 'topic-petrochemicals', title: 'Petrochemicals', slug: 'petrochemicals', order: 20 },
  { id: 'topic-agriculture', title: 'Agriculture & Food', slug: 'agriculture-food', order: 30 },
  { id: 'topic-freezones', title: 'Free Trade Zones', slug: 'free-trade-zones', order: 40 },
];

// Two dummy articles per topic.
const ARTICLES = [
  { id: 'sec-pharma-a', topic: 'topic-pharmaceuticals', cover: 'sector-pharma.jpg', date: '2026-06-30', rt: '6 min read',
    title: "Biosimilars: Iran's quiet pharmaceutical export bet", slug: 'biosimilars-export-bet',
    excerpt: 'Domestic manufacturers are moving up the value chain into complex biologics — and eyeing regional export markets.' },
  { id: 'sec-pharma-b', topic: 'topic-pharmaceuticals', cover: 'cover-6.jpg', date: '2026-06-14', rt: '5 min read',
    title: 'Cold chain gaps and the vaccine manufacturing opportunity', slug: 'cold-chain-vaccine-opportunity',
    excerpt: 'The infrastructure to move temperature-sensitive medicine is the bottleneck — and the opening — for investors.' },
  { id: 'sec-petro-a', topic: 'topic-petrochemicals', cover: 'sector-petrochemicals.jpg', date: '2026-06-26', rt: '7 min read',
    title: 'Methanol-to-olefins: the next petrochemical wave', slug: 'methanol-to-olefins-wave',
    excerpt: 'New downstream capacity is turning cheap feedstock into higher-value polymers the region actually needs.' },
  { id: 'sec-petro-b', topic: 'topic-petrochemicals', cover: 'cover-3.jpg', date: '2026-06-11', rt: '6 min read',
    title: 'Why Gulf buyers keep coming back for Iranian polymers', slug: 'gulf-buyers-iranian-polymers',
    excerpt: 'Price, proximity, and reliable volumes have built sticky demand across the neighbourhood.' },
  { id: 'sec-agri-a', topic: 'topic-agriculture', cover: 'sector-agriculture.jpg', date: '2026-06-24', rt: '6 min read',
    title: "Saffron's premium: branding the world's most expensive spice", slug: 'saffron-premium-branding',
    excerpt: 'Iran grows most of the world’s saffron but captures little of the brand value. That gap is the opportunity.' },
  { id: 'sec-agri-b', topic: 'topic-agriculture', cover: 'banner-agriculture.jpg', date: '2026-06-09', rt: '5 min read',
    title: 'Pistachios, sanctions, and the export rebound', slug: 'pistachios-export-rebound',
    excerpt: 'One of Iran’s oldest export crops is finding new routes to market — and new buyers.' },
  { id: 'sec-ftz-a', topic: 'topic-freezones', cover: 'sector-ftz.jpg', date: '2026-06-21', rt: '8 min read',
    title: 'Kish vs Qeshm: choosing the right free zone', slug: 'kish-vs-qeshm',
    excerpt: 'Two flagship zones, two very different value propositions. A practical comparison for new entrants.' },
  { id: 'sec-ftz-b', topic: 'topic-freezones', cover: 'cover-4.jpg', date: '2026-06-05', rt: '6 min read',
    title: 'Aras and the overland route north', slug: 'aras-overland-route-north',
    excerpt: 'The northern free zone is quietly becoming a logistics hub for trade with the Caucasus and beyond.' },
];

async function main() {
  console.log(`Seeding Sectors tabs → ${client.config().projectId}/${client.config().dataset}\n`);

  for (const t of TOPICS) {
    process.stdout.write(`Topic: ${t.title} ... `);
    await client.createOrReplace({
      _id: t.id,
      _type: 'topic',
      title: t.title,
      slug: { _type: 'slug', current: t.slug },
      section: { _type: 'reference', _ref: SECTION },
      order: t.order,
    });
    console.log('done');
  }

  // File the two existing Sectors articles under a topic.
  console.log('\nFiling existing sectors articles:');
  const existing = [
    { id: 'post-sectors-1', topic: 'topic-petrochemicals' }, // Petrochemicals backbone
    { id: 'post-sectors-2', topic: 'topic-pharmaceuticals' }, // Pharma opportunity
  ];
  for (const e of existing) {
    const found = await client.fetch(`*[_id == $id][0]._id`, { id: e.id });
    if (!found) { console.log(`  - ${e.id} not found — skipped`); continue; }
    await client.patch(e.id).set({ topic: { _type: 'reference', _ref: e.topic } }).commit();
    console.log(`  ✓ ${e.id} → ${e.topic}`);
  }

  console.log('\nDummy articles:');
  for (const a of ARTICLES) {
    process.stdout.write(`  ${a.topic.replace('topic-', '')}: ${a.title.slice(0, 32)}… `);
    await client.createOrReplace({
      _id: a.id,
      _type: 'post',
      title: a.title,
      slug: { _type: 'slug', current: a.slug },
      section: { _type: 'reference', _ref: SECTION },
      topic: { _type: 'reference', _ref: a.topic },
      author: { _type: 'reference', _ref: 'author-leila-hosseini' },
      kicker: `Sectors · ${TOPICS.find((t) => t.id === a.topic).title}`,
      excerpt: a.excerpt,
      coverImage: await img(a.cover),
      publishedDate: a.date,
      readTime: a.rt,
      body: [
        para(`${a.excerpt} This is placeholder copy for a demo article so the Sectors tabs can be tested end-to-end.`),
        quote('Replace this with real reporting — the structure, tab filtering, and layout are all in place.'),
        para('Each article is filed under a topic in the CMS, which is what powers the tab it appears under. Add or rename tabs by editing Topics in the Studio.'),
      ],
      seo: { metaTitle: `${a.title} — Iran Investment`, metaDescription: a.excerpt.slice(0, 160) },
    });
    console.log('done');
  }

  console.log('\nSectors tabs seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
