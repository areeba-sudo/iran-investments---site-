// Seeds demo content for the Economy section: an author, a featured white paper
// (with a placeholder PDF), 3 articles, and wires the section's featured-download
// banner. Re-runnable (uses stable _ids + createOrReplace).
// Run with: node --env-file=.env seed-economy.mjs
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
const para = (text) => ({ _type: 'block', _key: rk(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: rk(), text, marks: [] }] });
const h2 = (text) => ({ _type: 'block', _key: rk(), style: 'h2', markDefs: [], children: [{ _type: 'span', _key: rk(), text, marks: [] }] });
const quote = (text) => ({ _type: 'block', _key: rk(), style: 'blockquote', markDefs: [], children: [{ _type: 'span', _key: rk(), text, marks: [] }] });

const assetCache = new Map();
async function uploadImage(filename) {
  if (assetCache.has(filename)) return assetCache.get(filename);
  const buf = fs.readFileSync(path.join(publicDir, filename));
  const asset = await client.assets.upload('image', buf, { filename });
  assetCache.set(filename, asset);
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
}

// Minimal valid one-page PDF used as a placeholder for the featured download.
const PLACEHOLDER_PDF = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj
4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
5 0 obj<</Length 78>>stream
BT /F1 22 Tf 72 700 Td (Iran Economic Outlook 2026 - placeholder) Tj ET
endstream endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000052 00000 n
0000000101 00000 n
0000000229 00000 n
0000000298 00000 n
trailer<</Size 6/Root 1 0 R>>
startxref
430
%%EOF`;

async function main() {
  console.log(`Seeding Economy content → project ${client.config().projectId}, dataset ${client.config().dataset}\n`);

  // 1) Author
  process.stdout.write('Author (Darius Ahmadi) ... ');
  const authorPhoto = await uploadImage('cover-10.jpg');
  await client.createOrReplace({
    _id: 'author-darius-ahmadi',
    _type: 'author',
    name: 'Darius Ahmadi',
    role: 'Chief Economist',
    photo: authorPhoto,
    shortBio: 'Darius covers macroeconomics, monetary policy, and trade for Iran Investment.',
  });
  console.log('done');

  // 2) Featured white paper (placeholder PDF)
  process.stdout.write('Featured white paper + placeholder PDF ... ');
  const pdfAsset = await client.assets.upload('file', Buffer.from(PLACEHOLDER_PDF), {
    filename: 'iran-economic-outlook-2026.pdf',
    contentType: 'application/pdf',
  });
  await client.createOrReplace({
    _id: 'guide-economy-outlook-2026',
    _type: 'guide',
    resourceType: 'whitepaper',
    title: 'Iran Economic Outlook 2026',
    slug: { _type: 'slug', current: 'iran-economic-outlook-2026' },
    description:
      "A data-driven read on growth, inflation, the rial, and the sectors positioned to lead Iran's next economic cycle.",
    pdfFile: { _type: 'file', asset: { _type: 'reference', _ref: pdfAsset._id } },
    editionLabel: '2026 Edition · 28 pp',
    badgeLabel: 'White Paper · Free',
    beehiivTag: 'iran-economic-outlook-2026',
    publishedDate: '2026-01-15',
  });
  console.log('done');

  // 3) Three Economy articles
  const articles = [
    {
      id: 'post-economy-1',
      title: "Iran's non-oil exports just hit a record — here's what's driving it",
      slug: 'iran-non-oil-exports-record-high',
      excerpt: 'Petrochemicals, minerals, and agriculture pushed non-oil exports past $60B as the economy keeps diversifying away from crude.',
      readTime: '7 min read',
      date: '2026-06-28',
      cover: 'banner-tehran.jpg',
      kicker: 'Economy · Trade',
      body: [
        para("For a decade, Iran's export story was told almost entirely in barrels of crude. That story is changing. Non-oil exports have quietly climbed to a record, and the composition of what leaves the country's ports and border crossings is starting to look like a genuinely diversified economy."),
        h2('The drivers'),
        para('Petrochemicals remain the anchor, but the sharpest growth has come from minerals, steel, and high-value agricultural products such as saffron, pistachios, and dried fruits. Regional demand — particularly from neighbours to the east and the Gulf — has absorbed volumes that once would have struggled to find buyers.'),
        quote('The non-oil economy is no longer a hedge against sanctions. For a growing set of producers, it is the business.'),
        para('The shift matters for investors because it changes the risk profile of the whole market. An economy that earns hard currency from dozens of products across several sectors is structurally more resilient than one that lives and dies by a single commodity price.'),
      ],
    },
    {
      id: 'post-economy-2',
      title: "The rial's quiet stabilisation and what it signals for 2026",
      slug: 'rial-stabilisation-2026-signal',
      excerpt: 'A new FX corridor and tighter monetary policy have taken the drama out of the currency. Importers and investors are taking note.',
      readTime: '6 min read',
      date: '2026-06-20',
      cover: 'cover-8.jpg',
      kicker: 'Economy · Currency',
      body: [
        para("After years of headline-grabbing swings, the rial has done something unusual: it has become boring. That is precisely the point. A managed FX corridor and a more disciplined monetary stance have narrowed the gap between official and open-market rates to its tightest in years."),
        h2('Why it matters'),
        para('Currency stability is the foundation everything else is built on. Importers can price contracts with confidence, exporters can plan, and foreign partners can model returns without baking in a currency collapse. None of that is glamorous, but all of it is bankable.'),
        quote('Stability is not the same as strength — but for capital deployment, predictability is worth more than either.'),
        para('The open question is durability. The corridor holds as long as the policy discipline behind it holds. For now, the trend line is the friend of anyone trying to do business across the border.'),
      ],
    },
    {
      id: 'post-economy-3',
      title: "Inside Iran's 2026 budget: subsidies, sanctions, and the growth bet",
      slug: 'iran-2026-budget-growth-bet',
      excerpt: 'The new budget leans on non-oil revenue and targeted subsidy reform to fund an ambitious growth target. Can it hold?',
      readTime: '9 min read',
      date: '2026-06-12',
      cover: 'cover-4.jpg',
      kicker: 'Economy · Policy',
      body: [
        para("Every national budget is a statement of priorities. Iran's 2026 budget is a bet — that non-oil revenue and carefully sequenced subsidy reform can fund a growth target that would have looked optimistic a few years ago."),
        h2('The arithmetic'),
        para('The headline is a heavier reliance on tax and non-oil receipts, paired with a gradual rationalisation of energy subsidies. It is a politically delicate combination, and the government has clearly tried to phase it to limit the shock to household budgets.'),
        quote('Budgets reveal intent. This one intends to grow the economy without waiting for sanctions relief to arrive first.'),
        para('For investors, the signal is what the state is willing to spend on: infrastructure, industry, and the free-trade zones that have become the country\'s preferred on-ramp for foreign capital. Whether the revenue keeps pace with the ambition is the number to watch all year.'),
      ],
    },
  ];

  for (const a of articles) {
    process.stdout.write(`Article: ${a.title.slice(0, 40)}… `);
    const cover = await uploadImage(a.cover);
    await client.createOrReplace({
      _id: a.id,
      _type: 'post',
      title: a.title,
      slug: { _type: 'slug', current: a.slug },
      section: { _type: 'reference', _ref: 'section-economy' },
      author: { _type: 'reference', _ref: 'author-darius-ahmadi' },
      kicker: a.kicker,
      excerpt: a.excerpt,
      coverImage: cover,
      publishedDate: a.date,
      readTime: a.readTime,
      featured: a.id === 'post-economy-1',
      body: a.body,
      seo: { metaTitle: `${a.title} — Iran Investment`, metaDescription: a.excerpt.slice(0, 160) },
    });
    console.log('done');
  }

  // 4) Wire the Economy section's featured-download banner
  process.stdout.write('Economy section featured-download banner ... ');
  await client
    .patch('section-economy')
    .set({
      featuredDownload: {
        resource: { _type: 'reference', _ref: 'guide-economy-outlook-2026' },
        heading: 'Get the 2026 Economic Outlook',
        blurb: 'Our 28-page read on growth, inflation, and the sectors set to lead — free to your inbox.',
        buttonLabel: 'Download the white paper',
      },
    })
    .commit();
  console.log('done');

  console.log('\nEconomy seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
