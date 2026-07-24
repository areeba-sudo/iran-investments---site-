import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export interface SanityImage {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
}

// Project ID and dataset are not secret — they appear in every public image CDN
// URL the site serves — so we default to them directly. An env var can still
// override (e.g. to point a staging build at a different dataset).
export const projectId = import.meta.env.SANITY_PROJECT_ID || 'h4z2q6ep';
export const dataset = import.meta.env.SANITY_DATASET || 'production';

export const sanityClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImage) {
  return builder.image(source);
}

// ── Documents ────────────────────────────────────────────────────────────

export interface FeaturedDownload {
  heading?: string;
  blurb?: string;
  buttonLabel?: string;
  resource?: {
    _id: string;
    title: string;
    description?: string;
    slug?: string;
    badgeLabel?: string;
    editionLabel?: string;
  };
}

export interface SectionDoc {
  _id: string;
  title: string;
  slug: string;
  navLabel?: string;
  description?: string;
  cardImage?: SanityImage;
  showInNav?: boolean;
  order?: number;
  featuredDownload?: FeaturedDownload;
}

export interface AuthorDoc {
  _id: string;
  name: string;
  role?: string;
  photo?: SanityImage;
  shortBio?: string;
}

export interface TopicDoc {
  _id: string;
  title: string;
  slug: string;
  order?: number;
}

export interface PostSummary {
  _id: string;
  title: string;
  slug: string;
  section?: { title: string; slug: string };
  topic?: { title: string; slug: string };
  author?: { name: string; role?: string };
  kicker?: string;
  excerpt: string;
  coverImage: SanityImage;
  publishedDate: string;
  readTime: string;
  featured?: boolean;
}

export interface PostDetail extends PostSummary {
  body: any[];
  authorFull?: AuthorDoc;
  seo?: { metaTitle?: string; metaDescription?: string };
}

export type ResourceType = 'guide' | 'whitepaper';

export interface WeeklyEditionSummary {
  _id: string;
  title: string;
  slug: string;
  editionLabel?: string;
  editionDate: string;
  coverImage: SanityImage;
  bannerImage?: SanityImage;
  excerpt: string;
  author?: { name: string; role?: string };
  readTime?: string;
}

export interface WeeklyEditionDetail extends WeeklyEditionSummary {
  bannerImage?: SanityImage;
  body: any[];
  seo?: { metaTitle?: string; metaDescription?: string };
}

export interface GuideDoc {
  _id: string;
  resourceType?: ResourceType;
  title: string;
  slug: string;
  description: string;
  pdfUrl?: string;
  coverImage?: SanityImage;
  editionLabel?: string;
  badgeLabel?: string;
  socialProof?: string;
  beehiivTag?: string;
}

export interface MarketMetric {
  label: string;
  value: string;
  change?: string;
  direction?: 'up' | 'down-good' | 'down-bad';
  /** 'brent' = value is overridden client-side by the live oil price; else manual/CMS. */
  liveSource?: 'manual' | 'brent';
}

export interface HomepageDoc {
  heroSlides?: { article: PostSummary; kickerOverride?: string }[];
  secondaryStories?: PostSummary[];
  marketAsOf?: string;
  marketMetrics?: MarketMetric[];
  premiumGuide?: GuideDoc;
  sectorsHeading?: string;
  sectorsIntro?: string;
  featuredSections?: SectionDoc[];
  featuredInsight?: PostSummary;
  insightBadge?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
}

export interface SiteSettingsDoc {
  siteName?: string;
  tagline?: string;
  footerAbout?: string;
  footerColumns?: { heading: string; links: { label: string; url: string }[] }[];
  copyright?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  subscribeHeading?: string;
  subscribeSubheading?: string;
  subscribeDisclaimer?: string;
}

// ── Projections ──────────────────────────────────────────────────────────

const postSummaryProjection = `{
  _id,
  title,
  "slug": slug.current,
  "section": section->{ title, "slug": slug.current },
  "topic": topic->{ title, "slug": slug.current },
  "author": author->{ name, role },
  kicker,
  excerpt,
  coverImage,
  publishedDate,
  readTime,
  featured
}`;

const postDetailProjection = `{
  _id,
  title,
  "slug": slug.current,
  "section": section->{ title, "slug": slug.current },
  "author": author->{ name, role },
  "authorFull": author->{ _id, name, role, photo, shortBio },
  kicker,
  excerpt,
  coverImage,
  publishedDate,
  readTime,
  featured,
  body,
  seo
}`;

const sectionProjection = `{
  _id,
  title,
  "slug": slug.current,
  navLabel,
  description,
  cardImage,
  showInNav,
  order,
  featuredDownload{
    heading,
    blurb,
    buttonLabel,
    "resource": resource->{ _id, title, description, "slug": slug.current, badgeLabel, editionLabel }
  }
}`;

const guideProjection = `{
  _id,
  resourceType,
  title,
  "slug": slug.current,
  description,
  "pdfUrl": pdfFile.asset->url,
  coverImage,
  editionLabel,
  badgeLabel,
  socialProof,
  beehiivTag
}`;

// ── Queries ──────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettingsDoc | null> {
  return sanityClient.fetch(`*[_id == "siteSettings"][0]`);
}

export async function getSections(): Promise<SectionDoc[]> {
  return sanityClient.fetch(`*[_type == "section"] | order(order asc) ${sectionProjection}`);
}

// "Live" sections are the ones shown in nav — the current, client-defined
// taxonomy. Articles only surface on the site once assigned to a live section,
// which lets the client republish (reuse) selected legacy posts one at a time.
export async function getLiveSections(): Promise<SectionDoc[]> {
  return sanityClient.fetch(
    `*[_type == "section" && showInNav == true] | order(order asc) ${sectionProjection}`
  );
}

export async function getHomepage(): Promise<HomepageDoc | null> {
  return sanityClient.fetch(`*[_id == "homepage"][0]{
    heroSlides[]{ "article": article->${postSummaryProjection}, kickerOverride },
    "secondaryStories": secondaryStories[]->${postSummaryProjection},
    marketAsOf,
    marketMetrics,
    "premiumGuide": premiumGuide->${guideProjection},
    sectorsHeading,
    sectorsIntro,
    "featuredSections": featuredSections[]->${sectionProjection},
    "featuredInsight": featuredInsight->${postSummaryProjection},
    insightBadge,
    seo
  }`);
}

// Market Snapshot ticker: CMS-managed metrics (client edits the Iran-specific
// figures) + an optional live oil price overridden client-side. Falls back to
// the design's default six so the ticker is never empty out of the box.
const DEFAULT_MARKET: { asOf: string; metrics: MarketMetric[] } = {
  asOf: '2026-07-06',
  metrics: [
    { label: 'GDP Growth', value: '4.2%', change: '0.6', direction: 'up', liveSource: 'manual' },
    { label: 'Inflation', value: '31.7%', change: '2.1', direction: 'down-good', liveSource: 'manual' },
    { label: 'USD / IRR', value: '42,150', change: '0.4', direction: 'down-bad', liveSource: 'manual' },
    { label: 'Brent Oil', value: '$79.40', change: '1.2', direction: 'up', liveSource: 'brent' },
    { label: 'TSE Index', value: '2.14M', change: '0.9', direction: 'up', liveSource: 'manual' },
    { label: 'Foreign Trade', value: '$89B', change: '3.4', direction: 'up', liveSource: 'manual' },
  ],
};

export async function getMarketSnapshot(): Promise<{ asOf?: string; metrics: MarketMetric[] }> {
  const home = await sanityClient.fetch<
    { marketAsOf?: string; marketMetrics?: MarketMetric[]; _updatedAt?: string } | null
  >(`*[_id == "homepage"][0]{ marketAsOf, marketMetrics, _updatedAt }`);
  const metrics = home?.marketMetrics?.length ? home.marketMetrics : DEFAULT_MARKET.metrics;
  // Date auto-follows the last CMS edit (_updatedAt); marketAsOf is an optional manual override.
  const asOf = home?.marketAsOf || home?._updatedAt || DEFAULT_MARKET.asOf;
  return { asOf, metrics };
}

// Only posts assigned to a live (nav-visible) section are rendered anywhere on
// the site. Legacy posts still in retired sections stay hidden until moved.
export async function getAllPosts(): Promise<PostSummary[]> {
  return sanityClient.fetch(
    `*[_type == "post" && section->showInNav == true] | order(publishedDate desc) ${postSummaryProjection}`
  );
}

export async function getPostsBySection(sectionSlug: string): Promise<PostSummary[]> {
  return sanityClient.fetch(
    `*[_type == "post" && section->slug.current == $sectionSlug] | order(publishedDate desc) ${postSummaryProjection}`,
    { sectionSlug }
  );
}

// Client-managed tabs for a section (e.g. Sectors → Pharmaceuticals, …).
export async function getTopicsBySection(sectionSlug: string): Promise<TopicDoc[]> {
  return sanityClient.fetch(
    `*[_type == "topic" && section->slug.current == $sectionSlug] | order(order asc, title asc){
      _id, title, "slug": slug.current, order
    }`,
    { sectionSlug }
  );
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  return sanityClient.fetch(`*[_type == "post" && slug.current == $slug][0] ${postDetailProjection}`, { slug });
}

// ── Weekly editions ──────────────────────────────────────────────────────

const weeklyEditionSummaryProjection = `{
  _id,
  title,
  "slug": slug.current,
  editionLabel,
  editionDate,
  coverImage,
  bannerImage,
  excerpt,
  "author": author->{ name, role },
  readTime
}`;

export async function getWeeklyEditions(): Promise<WeeklyEditionSummary[]> {
  return sanityClient.fetch(
    `*[_type == "weeklyEdition"] | order(editionDate desc) ${weeklyEditionSummaryProjection}`
  );
}

export async function getWeeklyEditionBySlug(slug: string): Promise<WeeklyEditionDetail | null> {
  return sanityClient.fetch(
    `*[_type == "weeklyEdition" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, editionLabel, editionDate, coverImage, bannerImage,
      excerpt, "author": author->{ name, role }, readTime, body, seo
    }`,
    { slug }
  );
}

export async function getGuides(): Promise<GuideDoc[]> {
  return sanityClient.fetch(`*[_type == "guide"] | order(publishedDate desc) ${guideProjection}`);
}

export async function getResourcesByType(type: ResourceType): Promise<GuideDoc[]> {
  // Older docs created before the resourceType field default to "guide".
  const clause =
    type === 'guide'
      ? 'resourceType == "guide" || !defined(resourceType)'
      : 'resourceType == "whitepaper"';
  return sanityClient.fetch(
    `*[_type == "guide" && (${clause})] | order(publishedDate desc) ${guideProjection}`
  );
}

export async function getGuideBySlug(slug: string): Promise<GuideDoc | null> {
  return sanityClient.fetch(`*[_type == "guide" && slug.current == $slug][0] ${guideProjection}`, { slug });
}

export function sectionHref(s: { slug: string }): string {
  return `/section/${s.slug}/`;
}
