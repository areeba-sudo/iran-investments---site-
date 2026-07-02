// One-off migration: pushes the 12 articles + homepage singleton from
// iran_investments_with_globe.html (already extracted into site/src/data/*.json)
// into Sanity. Run with: node --env-file=.env migrate.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { createClient } from '@sanity/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_MIGRATE_TOKEN,
  useCdn: false,
});

const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/posts.json'), 'utf8'));
const imagesDir = path.join(__dirname, '../public/images');

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ── HTML body -> Portable Text ──
function textToSpans(el) {
  // Converts inline children (text, <strong>, <em>) into Portable Text spans.
  const spans = [];
  for (const node of el.childNodes) {
    if (node.nodeType === 3) {
      // text node
      if (node.text) spans.push({ _type: 'span', _key: randKey(), text: node.rawText ?? node.text, marks: [] });
    } else if (node.nodeType === 1) {
      const tag = node.rawTagName?.toLowerCase();
      const mark = tag === 'strong' ? 'strong' : tag === 'em' ? 'em' : null;
      const text = node.text;
      if (text) spans.push({ _type: 'span', _key: randKey(), text, marks: mark ? [mark] : [] });
    }
  }
  return spans.length ? spans : [{ _type: 'span', _key: randKey(), text: el.text || '', marks: [] }];
}

function randKey() {
  return Math.random().toString(36).slice(2, 10);
}

async function htmlBodyToBlocks(html, postId) {
  const root = parse(html);
  const blocks = [];
  for (const el of root.childNodes) {
    if (el.nodeType !== 1) continue;
    const tag = el.rawTagName?.toLowerCase();
    if (tag === 'p') {
      blocks.push({ _type: 'block', _key: randKey(), style: 'normal', children: textToSpans(el), markDefs: [] });
    } else if (tag === 'h2') {
      blocks.push({ _type: 'block', _key: randKey(), style: 'h2', children: textToSpans(el), markDefs: [] });
    } else if (tag === 'h3') {
      blocks.push({ _type: 'block', _key: randKey(), style: 'h3', children: textToSpans(el), markDefs: [] });
    } else if (tag === 'blockquote') {
      blocks.push({ _type: 'block', _key: randKey(), style: 'blockquote', children: textToSpans(el), markDefs: [] });
    } else if (tag === 'img') {
      const src = el.getAttribute('src');
      const alt = el.getAttribute('alt') || '';
      const asset = await uploadImageFromLocalPath(src, `post-${postId}-inline`);
      if (asset) {
        blocks.push({ _type: 'image', _key: randKey(), asset: { _type: 'reference', _ref: asset._id }, alt });
      }
    }
  }
  return blocks;
}

const assetCache = new Map();
async function uploadImageFromLocalPath(webPath, label) {
  // webPath looks like "/images/cover-1.jpg"
  const filename = path.basename(webPath);
  if (assetCache.has(filename)) return assetCache.get(filename);
  const filePath = path.join(imagesDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ! missing image file for ${label}: ${filePath}`);
    return null;
  }
  const buffer = fs.readFileSync(filePath);
  const asset = await client.assets.upload('image', buffer, { filename });
  assetCache.set(filename, asset);
  return asset;
}

async function migratePosts() {
  for (const post of posts) {
    process.stdout.write(`Post ${post.id}: ${post.title} ... `);
    const coverAsset = await uploadImageFromLocalPath(`/images/cover-${post.id}.${post.id === 11 || post.id === 12 ? 'svg' : 'jpg'}`, `post-${post.id}-cover`);
    const body = await htmlBodyToBlocks(post.body, post.id);

    const doc = {
      _id: `post-${post.id}`,
      _type: 'post',
      title: post.title,
      slug: { _type: 'slug', current: slugify(post.title) },
      category: post.cat,
      excerpt: post.excerpt,
      coverImage: coverAsset ? { _type: 'image', asset: { _type: 'reference', _ref: coverAsset._id } } : undefined,
      publishedDate: post.date,
      readTime: post.rt,
      body,
      seo: {
        metaTitle: `${post.title} — Iran Investments`,
        metaDescription: post.excerpt.slice(0, 160),
      },
    };

    await client.createOrReplace(doc);
    console.log('done');
  }
}

async function migrateHomepage() {
  process.stdout.write('Homepage singleton ... ');
  const doc = {
    _id: 'homepage',
    _type: 'homepage',
    heroPill: '🗞 Newsletter · Free to Read',
    heroHeadline: 'Your Investment Journey Starts',
    heroHeadlineAccent: 'Now',
    heroSubheadline:
      "Headlines, hot-takes, and practical intelligence on Iran's business landscape — so you can identify, protect, and grow your wealth before everyone else.",

    whyTag: 'Why Iran Investments',
    whyHeading: 'The information gap we exist to close',
    whyBody:
      'Iran is one of the most misunderstood emerging markets on the planet. We cut through the noise with verified, on-the-ground intelligence and legal clarity.',
    whyItems: [
      {
        _key: randKey(),
        title: 'Legitimate Intelligence',
        body: "Verified insights on Iran's business environment, regulations, and opportunities — free from media noise and political bias. Primary research, not extrapolation.",
        pillLabel: 'Intelligence',
      },
      {
        _key: randKey(),
        title: 'Legal Framework Clarity',
        body: 'We map every permissible pathway. Know exactly how to engage Iranian markets without crossing any legal lines. Structured for real operators, not theorists.',
        pillLabel: 'Compliance',
      },
      {
        _key: randKey(),
        title: 'Actionable Strategy',
        body: 'Not just what the opportunity is — but how to execute on it. Every piece of content moves you closer to a real, deployable market decision with clear next steps.',
        pillLabel: 'Strategy',
      },
    ],

    stats: [
      { _key: randKey(), target: 85, unit: 'M+', label: 'Population', desc: 'Urban, educated consumers with substantial unmet demand for quality goods' },
      { _key: randKey(), target: 4, unit: 'B+', label: 'Pharma Market', desc: 'Annual pharmaceutical market value in USD, growing consistently year on year' },
      { _key: randKey(), target: 37, unit: 'M ha', label: 'Agricultural Land', desc: '5th largest agricultural land area in the Middle East, chronically underprocessed' },
      { _key: randKey(), target: 7, unit: '', label: 'Free Trade Zones', desc: 'Designated investment zones with 20-year tax exemptions for foreign capital' },
    ],

    whoTag: 'Who We Are',
    whoHeading: 'Iran Focused Business Development and Investment Newsletter',
    whoTagline: 'For headlines, hot-takes, and practical content that helps you grab the right opportunities.',
    whoBody:
      'We provide free premium content on Iran and international business development — helping businessmen and investors identify and execute opportunities strategically.',
    whoReaderCards: [
      { _key: randKey(), title: 'Business Owners', body: 'Expand into new markets with strategic intelligence' },
      { _key: randKey(), title: 'Entrepreneurs', body: 'Identify first-mover opportunities in an emerging economy' },
      { _key: randKey(), title: 'HNWIs', body: 'Diversify portfolios with high-potential market exposure' },
      { _key: randKey(), title: 'International Businesses', body: 'Structure compliant cross-border operations' },
    ],

    visionTag: 'Our Vision',
    visionQuote:
      'Nobody should stay blinded by geopolitical chaos — because right behind the chaos are opportunities that can make you rich.',

    blogTag: 'Free Premium Content',
    blogHeading: 'Content that helps you identify the right opportunities',

    bannerHeading: 'Join the Conversation',
    bannerBody: 'Join the community of 10,000+ users and stay updated with the latest on-ground and practical content',

    seo: {
      metaTitle: 'Iran Investments — Business Intelligence & Investment Newsletter',
      metaDescription:
        "Premium intelligence on Iran's business landscape for global investors, entrepreneurs, and business leaders — free to read, forever.",
    },
  };

  await client.createOrReplace(doc);
  console.log('done');
}

async function main() {
  console.log(`Migrating into project ${client.config().projectId}, dataset ${client.config().dataset}\n`);
  await migrateHomepage();
  await migratePosts();
  console.log('\nMigration complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
