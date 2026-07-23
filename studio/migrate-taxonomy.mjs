// Establishes the new client-defined section taxonomy:
// Economy · Markets · Sectors · Policy · Analysis become the live (nav) sections.
// The 3 legacy sections are retired from nav (showInNav=false) but kept so the
// client can re-categorise selected legacy posts into the new sections.
// Run with: node --env-file=.env migrate-taxonomy.mjs
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_MIGRATE_TOKEN,
  useCdn: false,
});

const NEW_SECTIONS = [
  { slug: 'economy', title: 'Economy', order: 10, description: "Macro trends, policy shifts, and the forces reshaping Iran's economy." },
  { slug: 'markets', title: 'Markets', order: 20, description: 'Currency, equities, commodities, and the money moving through Iranian markets.' },
  { slug: 'sectors', title: 'Sectors', order: 30, description: 'Deep dives into the industries defining the next decade of Iranian growth.' },
  { slug: 'policy', title: 'Policy', order: 40, description: 'Sanctions, regulation, and the legal frameworks that govern doing business in Iran.' },
  { slug: 'analysis', title: 'Analysis', order: 50, description: 'Opinion, commentary, and the view behind the headlines.' },
];

const LEGACY_SECTION_IDS = ['section-investment', 'section-hidden', 'section-strategy'];

async function createNewSections() {
  for (const s of NEW_SECTIONS) {
    process.stdout.write(`Section: ${s.title} ... `);
    await client.createOrReplace({
      _id: `section-${s.slug}`,
      _type: 'section',
      title: s.title,
      slug: { _type: 'slug', current: s.slug },
      navLabel: s.title,
      description: s.description,
      showInNav: true,
      order: s.order,
    });
    console.log('done');
  }
}

async function retireLegacySections() {
  console.log('\nRetiring legacy sections from nav:');
  for (const id of LEGACY_SECTION_IDS) {
    const exists = await client.fetch(`*[_id == $id][0]._id`, { id });
    if (!exists) {
      console.log(`  - ${id} not found — skipped`);
      continue;
    }
    await client.patch(id).set({ showInNav: false }).commit();
    console.log(`  ✓ ${id} → showInNav=false`);
  }
}

async function main() {
  console.log(`Project ${client.config().projectId}, dataset ${client.config().dataset}\n`);
  await createNewSections();
  await retireLegacySections();
  console.log(
    '\nDone. New sections are live (empty until you assign articles to them in the Studio).'
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
