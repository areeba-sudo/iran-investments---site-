// Seeds 2 articles into each of Markets, Sectors, Policy, Analysis (+ a 2nd
// author). Re-runnable via stable _ids. Run: node --env-file=.env seed-sections.mjs
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
const h2 = (t) => ({ _type: 'block', _key: rk(), style: 'h2', markDefs: [], children: [{ _type: 'span', _key: rk(), text: t, marks: [] }] });
const quote = (t) => ({ _type: 'block', _key: rk(), style: 'blockquote', markDefs: [], children: [{ _type: 'span', _key: rk(), text: t, marks: [] }] });

const assetCache = new Map();
async function img(filename) {
  if (assetCache.has(filename)) return assetCache.get(filename);
  const buf = fs.readFileSync(path.join(publicDir, filename));
  const asset = await client.assets.upload('image', buf, { filename });
  const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  assetCache.set(filename, ref);
  return ref;
}

const DARIUS = 'author-darius-ahmadi';
const LEILA = 'author-leila-hosseini';

const ARTICLES = [
  // MARKETS
  { id: 'post-markets-1', section: 'section-markets', author: LEILA, cover: 'cover-2.jpg', kicker: 'Markets · Equities', date: '2026-06-25', readTime: '6 min read',
    title: "Tehran's stock exchange is quietly outrunning inflation", slug: 'tse-outrunning-inflation',
    excerpt: 'Retail money and a handful of export-heavy names have pushed the TSE to real gains — a rare feat in a high-inflation economy.',
    body: [ para('In most high-inflation economies, the stock market is where savings go to tread water. Tehran has been the exception. Over the past year the exchange has delivered real, inflation-beating returns, driven by a wave of retail participation and a cluster of export-oriented heavyweights.'), h2('What is powering it'), para('Companies that earn in hard currency — petrochemicals, metals, miners — have been natural hedges. As the rial stabilised, their earnings held, and domestic investors piled in looking for anything that could outpace price rises.'), quote('For local savers, the exchange has become the most accessible inflation hedge in the country.') ] },
  { id: 'post-markets-2', section: 'section-markets', author: DARIUS, cover: 'cover-3.jpg', kicker: 'Markets · Commodities', date: '2026-06-18', readTime: '5 min read',
    title: 'Gold, the rial, and the flight to hard assets', slug: 'gold-rial-hard-assets',
    excerpt: 'Iranian households have long trusted gold over paper. The maths behind that instinct is worth understanding.',
    body: [ para('Ask an Iranian family where they keep their savings and the answer is often the same: gold. It is a habit born of decades of currency volatility, and it shapes how capital moves through the whole economy.'), h2('The logic'), para('Gold is liquid, portable, and immune to the domestic policy risks that erode paper savings. When the rial wobbles, demand for coins and bullion spikes almost overnight — a real-time barometer of confidence.'), para('For investors, that behaviour is a signal worth reading. Flows into hard assets tell you as much about sentiment as any official statistic.') ] },
  // SECTORS
  { id: 'post-sectors-1', section: 'section-sectors', author: DARIUS, cover: 'sector-petrochemicals.jpg', kicker: 'Sectors · Energy', date: '2026-06-22', readTime: '8 min read',
    title: "Petrochemicals: the backbone of Iran's export economy", slug: 'petrochemicals-export-backbone',
    excerpt: 'Sitting on the world’s second-largest gas reserves, Iran’s petrochemical complex is the single biggest driver of non-oil hard currency.',
    body: [ para('If there is one sector that defines Iran’s non-oil export story, it is petrochemicals. Built on the world’s second-largest gas reserves, the industry converts cheap feedstock into products the whole region needs.'), h2('Why it endures'), para('Petrochemicals have proven remarkably resilient to external pressure. Demand is regional and diversified, feedstock is abundant and cheap, and the products are essential inputs for manufacturing across the neighbourhood.'), quote('Cheap gas plus regional demand is a combination that does not depend on anyone’s permission.') ] },
  { id: 'post-sectors-2', section: 'section-sectors', author: LEILA, cover: 'sector-pharma.jpg', kicker: 'Sectors · Healthcare', date: '2026-06-15', readTime: '7 min read',
    title: "Inside Iran's $4B pharmaceutical opportunity", slug: 'iran-pharmaceutical-opportunity',
    excerpt: 'A large domestic market, strong local manufacturing, and a gap in the global supply chain make pharma one of the most compelling sectors.',
    body: [ para('Iran manufactures the overwhelming majority of the medicines it consumes — an unusual degree of self-sufficiency for an emerging market, and the foundation of a $4B-plus industry.'), h2('The opening'), para('Local manufacturers have the capacity and the know-how; what they often lack is access to specialised inputs and capital for expansion. That gap is precisely where partnership opportunities sit.'), para('For patient investors, pharma offers something rare: defensive demand, domestic scale, and a clear path to export as regional needs grow.') ] },
  // POLICY
  { id: 'post-policy-1', section: 'section-policy', author: DARIUS, cover: 'cover-6.jpg', kicker: 'Policy · Trade', date: '2026-06-19', readTime: '6 min read',
    title: 'Reading the new Free Trade Zone reforms', slug: 'free-trade-zone-reforms',
    excerpt: 'Kish, Qeshm, and Aras are being retooled to attract foreign capital. The details matter more than the headlines.',
    body: [ para('Iran’s free trade zones have always been the country’s preferred on-ramp for foreign capital. A new round of reforms aims to make them more attractive still — and the fine print is where the opportunity lives.'), h2('What changed'), para('The headline incentives are familiar: long tax holidays, simplified company formation, and relaxed customs. The meaningful changes are in the details of ownership, repatriation, and dispute resolution.'), quote('The zones are the legal corridor into the market. Read the corridor carefully before you drive through it.') ] },
  { id: 'post-policy-2', section: 'section-policy', author: LEILA, cover: 'cover-5.jpg', kicker: 'Policy · Compliance', date: '2026-06-10', readTime: '9 min read',
    title: "Sanctions compliance: what's actually permitted", slug: 'sanctions-compliance-permitted',
    excerpt: 'The gap between what people assume is off-limits and what is genuinely permissible is wide. Knowing the difference is the whole game.',
    body: [ para('Most conversations about doing business with Iran begin and end with a single word: sanctions. But the reality on the ground is more nuanced than the headline suggests, and the nuance is where the opportunity — and the risk — lives.'), h2('Mapping the terrain'), para('Certain sectors and transactions are permissible under specific conditions and jurisdictions. Others are firmly off-limits. The work is in mapping exactly which is which, and structuring accordingly.'), para('None of this is a substitute for qualified legal counsel — but understanding the shape of the map is the first step for any serious operator.') ] },
  // ANALYSIS
  { id: 'post-analysis-1', section: 'section-analysis', author: DARIUS, cover: 'cover-9.jpg', kicker: 'Analysis · Opinion', date: '2026-06-24', readTime: '7 min read',
    title: 'The sanctions premium is fading — and the smart money already knows it', slug: 'sanctions-premium-fading',
    excerpt: 'For a decade, risk was priced as a wall. The reality on the ground is a door, slowly opening.',
    body: [ para('For a decade, the market priced Iran risk as a wall — impassable, permanent, absolute. The investors reading the situation correctly today see something different: a door, slowly opening, with a premium that is quietly compressing.'), h2('Ahead of consensus'), para('The pattern in frontier markets is familiar. The biggest returns accrue to those who move while the consensus still says "impossible." By the time the door is obviously open, the premium is gone.'), quote('Risk was priced as a wall. The reality on the ground is a door — and doors are repriced faster than walls.') ] },
  { id: 'post-analysis-2', section: 'section-analysis', author: LEILA, cover: 'cover-7.jpg', kicker: 'Analysis · Strategy', date: '2026-06-08', readTime: '6 min read',
    title: 'Why patient capital wins in frontier markets', slug: 'patient-capital-frontier-markets',
    excerpt: 'The investors who succeed in markets like Iran share one trait: a time horizon measured in cycles, not quarters.',
    body: [ para('Frontier markets punish impatience. The investors who succeed in places like Iran tend to share a single trait — a time horizon measured in cycles rather than quarters, and the temperament to match.'), h2('The temperament'), para('Volatility is the price of the discount. Those who can hold through the noise, rather than trade every headline, are the ones who capture the structural re-rating when it finally comes.'), para('It is not a strategy for everyone. But for capital that can wait, few markets offer as much room to run.') ] },
];

async function main() {
  console.log(`Seeding 4 sections → project ${client.config().projectId}, dataset ${client.config().dataset}\n`);

  process.stdout.write('Author (Leila Hosseini) ... ');
  await client.createOrReplace({
    _id: LEILA,
    _type: 'author',
    name: 'Leila Hosseini',
    role: 'Markets Editor',
    photo: await img('cover-1.jpg'),
    shortBio: 'Leila writes on markets, sectors, and the companies shaping Iran’s economy.',
  });
  console.log('done');

  for (const a of ARTICLES) {
    process.stdout.write(`${a.section.replace('section-', '')}: ${a.title.slice(0, 34)}… `);
    await client.createOrReplace({
      _id: a.id,
      _type: 'post',
      title: a.title,
      slug: { _type: 'slug', current: a.slug },
      section: { _type: 'reference', _ref: a.section },
      author: { _type: 'reference', _ref: a.author },
      kicker: a.kicker,
      excerpt: a.excerpt,
      coverImage: await img(a.cover),
      publishedDate: a.date,
      readTime: a.readTime,
      featured: a.id.endsWith('-1'),
      body: a.body,
      seo: { metaTitle: `${a.title} — Iran Investment`, metaDescription: a.excerpt.slice(0, 160) },
    });
    console.log('done');
  }

  console.log('\nSection seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
