// Seeds 3 Weekly Editions (Weekly Insights). Re-runnable via stable _ids.
// Run: node --env-file=.env seed-weekly.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(__dirname, '../public');

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_MIGRATE_TOKEN,
  useCdn: false,
});

const rk = () => Math.random().toString(36).slice(2, 10);
const para = (t) => ({ _type: 'block', _key: rk(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: rk(), text: t, marks: [] }] });
const h2 = (t) => ({ _type: 'block', _key: rk(), style: 'h2', markDefs: [], children: [{ _type: 'span', _key: rk(), text: t, marks: [] }] });
const quote = (t) => ({ _type: 'block', _key: rk(), style: 'blockquote', markDefs: [], children: [{ _type: 'span', _key: rk(), text: t, marks: [] }] });

const cache = new Map();
async function img(relPath) {
  if (cache.has(relPath)) return cache.get(relPath);
  const buf = fs.readFileSync(path.join(pub, relPath));
  const asset = await client.assets.upload('image', buf, { filename: path.basename(relPath) });
  const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  cache.set(relPath, ref);
  return ref;
}

const EDITIONS = [
  {
    id: 'weekly-1', slug: 'sanctions-premium-fading', date: '2026-07-04',
    cover: 'weekly/cover-1.jpg', banner: 'weekly/banner-1.jpg', readTime: '8 min read',
    title: 'The sanctions premium is fading — and the smart money already knows it.',
    excerpt: 'For a decade, risk was priced as a wall. The reality on the ground is a door, slowly opening — and the investors reading it correctly are moving before consensus.',
    body: [
      para('For a decade, the market priced Iran risk as a wall — impassable, permanent, absolute. The investors reading the situation correctly today see something different: a door, slowly opening, with a premium that is quietly compressing week by week.'),
      h2('The board is changing'),
      para('Geopolitics rarely moves in straight lines, but the direction of travel has become hard to ignore. Non-oil exports are at records, the currency has stabilised, and regional trade corridors are thickening. None of this makes the risk zero — but it changes the price of that risk.'),
      quote('Risk was priced as a wall. The reality on the ground is a door — and doors are repriced faster than walls.'),
      para('The pattern in frontier markets is familiar. The largest returns accrue to those who move while the consensus still says “impossible.” By the time the door is obviously open, the premium is already gone.'),
    ],
  },
  {
    id: 'weekly-2', slug: 'bazaar-economy-western-models', date: '2026-06-27',
    cover: 'weekly/cover-2.jpg', banner: 'weekly/banner-2.jpg', readTime: '7 min read',
    title: 'The bazaar economy: what Western business models keep missing.',
    excerpt: 'Relationships, trust, and time horizons work differently here. The operators who succeed are the ones who learn the local grammar of business.',
    body: [
      para('Every market has a grammar — an unspoken set of rules about how deals get done, how trust is built, and how time is valued. In Iran, that grammar has been shaped by centuries of the bazaar, and it rewards a very different playbook than the one most Western firms arrive with.'),
      h2('Trust before terms'),
      para('In the bazaar, the relationship precedes the transaction. Contracts matter, but they follow trust rather than substitute for it. Operators who try to lead with legal structure and short timelines often find the door politely, permanently closed.'),
      quote('The paperwork closes the deal. The relationship opens it.'),
      para('This is not a soft observation — it is a hard commercial one. The firms compounding real returns here are the ones that invested in presence and patience long before they signed anything.'),
    ],
  },
  {
    id: 'weekly-3', slug: 'iran-next-decade-three-scenarios', date: '2026-06-20',
    cover: 'weekly/cover-3.jpg', banner: 'weekly/banner-3.jpg', readTime: '9 min read',
    title: "Reading Iran's next decade: three scenarios for capital.",
    excerpt: 'From gradual normalisation to prolonged stalemate, the range of outcomes is wide. Positioning for all three is the discipline that separates winners.',
    body: [
      para('Forecasting a single future for Iran is a fool’s errand. The more useful exercise is to hold several futures at once — to understand the range of plausible outcomes and to position so that no single one is ruinous.'),
      h2('Three paths'),
      para('The optimistic path is gradual normalisation: sanctions relief, deeper trade, and a re-rating of the whole market. The middle path is a long, functional stalemate in which the non-oil economy keeps compounding regardless. The bearish path is renewed escalation.'),
      quote('You do not have to predict which door opens. You have to be positioned so that any of them can.'),
      para('The investors who do best across a decade like this are rarely the ones with the boldest forecast. They are the ones whose positioning survives being wrong.'),
    ],
  },
];

async function main() {
  console.log(`Seeding Weekly Editions → ${client.config().projectId}/${client.config().dataset}\n`);
  for (const e of EDITIONS) {
    process.stdout.write(`Weekly: ${e.title.slice(0, 40)}… `);
    await client.createOrReplace({
      _id: e.id,
      _type: 'weeklyEdition',
      title: e.title,
      slug: { _type: 'slug', current: e.slug },
      editionLabel: 'Opinion · Weekly Column',
      editionDate: e.date,
      coverImage: await img(e.cover),
      bannerImage: await img(e.banner),
      excerpt: e.excerpt,
      author: { _type: 'reference', _ref: 'author-darius-ahmadi' },
      readTime: e.readTime,
      body: e.body,
      seo: { metaTitle: `${e.title} — Iran Investment`, metaDescription: e.excerpt.slice(0, 160) },
    });
    console.log('done');
  }
  console.log('\nWeekly editions seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
