// Revamp migration: converts the legacy category enum into client-managed
// `section` documents, points every post's new `section` reference at the
// right one, and seeds the Site Settings singleton.
// Run with: node --env-file=.env migrate-sections.mjs
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_MIGRATE_TOKEN,
  useCdn: false,
});

// Legacy category value -> new section document.
const SECTIONS = [
  {
    _id: 'section-investment',
    legacy: 'investment',
    title: 'Investment Opportunities',
    slug: 'investment-opportunities',
    navLabel: 'Investments',
    description: 'Sector-by-sector opportunities inside the Iranian market.',
    order: 10,
  },
  {
    _id: 'section-hidden',
    legacy: 'hidden',
    title: 'The Hidden Obvious',
    slug: 'the-hidden-obvious',
    navLabel: 'Hidden Obvious',
    description: 'Underreported dynamics shaping Iran’s economy and society.',
    order: 20,
  },
  {
    _id: 'section-strategy',
    legacy: 'strategy',
    title: 'Strategy & Operations',
    slug: 'strategy-operations',
    navLabel: 'Strategy',
    description: 'How to structure, enter, and operate in the market — legally and practically.',
    order: 30,
  },
];

async function createSections() {
  for (const s of SECTIONS) {
    process.stdout.write(`Section: ${s.title} ... `);
    await client.createOrReplace({
      _id: s._id,
      _type: 'section',
      title: s.title,
      slug: { _type: 'slug', current: s.slug },
      navLabel: s.navLabel,
      description: s.description,
      showInNav: true,
      order: s.order,
    });
    console.log('done');
  }
}

async function linkPosts() {
  const posts = await client.fetch(`*[_type == "post"]{ _id, category, section }`);
  console.log(`\nLinking ${posts.length} posts to sections:`);
  for (const post of posts) {
    const match = SECTIONS.find((s) => s.legacy === post.category);
    if (!match) {
      console.warn(`  ! ${post._id}: unknown/missing category "${post.category}" — skipped`);
      continue;
    }
    if (post.section?._ref === match._id) {
      console.log(`  = ${post._id} already linked`);
      continue;
    }
    await client
      .patch(post._id)
      .set({ section: { _type: 'reference', _ref: match._id } })
      .commit();
    console.log(`  ✓ ${post._id} -> ${match.title}`);
  }
}

async function seedSiteSettings() {
  process.stdout.write('\nSite Settings singleton ... ');
  const existing = await client.fetch(`*[_id == "siteSettings"][0]._id`);
  if (existing) {
    console.log('already exists — leaving as-is');
    return;
  }
  await client.create({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'IRAN INVESTMENT',
    tagline: 'ECONOMICS · MARKETS · OPPORTUNITIES',
    footerAbout:
      "Institutional-grade editorial intelligence on Iran's economy, markets, and the opportunities inside them.",
    copyright: '© 2026 Iran Investment. All rights reserved.',
    subscribeHeading: 'Weekly insights, delivered.',
    subscribeSubheading: 'Join investors and executives who read Iran Investment every week.',
    subscribeDisclaimer: 'No spam. Unsubscribe anytime.',
  });
  console.log('created');
}

async function cleanHomepage() {
  process.stdout.write('\nCleaning legacy fields off homepage singleton ... ');
  const exists = await client.fetch(`*[_id == "homepage"][0]._id`);
  if (!exists) {
    console.log('no homepage doc — skipped');
    return;
  }
  await client
    .patch('homepage')
    .unset([
      'heroPill',
      'heroHeadline',
      'heroHeadlineAccent',
      'heroSubheadline',
      'whyTag',
      'whyHeading',
      'whyBody',
      'whyItems',
      'stats',
      'whoTag',
      'whoHeading',
      'whoTagline',
      'whoBody',
      'whoReaderCards',
      'visionTag',
      'visionQuote',
      'blogTag',
      'blogHeading',
      'bannerHeading',
      'bannerBody',
    ])
    .commit();
  console.log('done');
}

async function main() {
  console.log(`Migrating project ${client.config().projectId}, dataset ${client.config().dataset}\n`);
  await createSections();
  await linkPosts();
  await seedSiteSettings();
  await cleanHomepage();
  console.log('\nMigration complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
