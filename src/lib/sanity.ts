import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export interface SanityImage {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
}

export const projectId = import.meta.env.SANITY_PROJECT_ID;
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

export type Category = 'investment' | 'hidden' | 'strategy';

export interface PostSummary {
  _id: string;
  title: string;
  slug: string;
  category: Category;
  excerpt: string;
  coverImage: SanityImage;
  publishedDate: string;
  readTime: string;
}

export interface PostDetail extends PostSummary {
  body: any[];
  seo?: { metaTitle?: string; metaDescription?: string };
}

export interface HomepageDoc {
  heroPill: string;
  heroHeadline: string;
  heroHeadlineAccent: string;
  heroSubheadline: string;
  whyTag: string;
  whyHeading: string;
  whyBody: string;
  whyItems: { title: string; body: string; pillLabel: string }[];
  stats: { target: number; unit: string; label: string; desc: string }[];
  whoTag: string;
  whoHeading: string;
  whoTagline: string;
  whoBody: string;
  whoReaderCards: { title: string; body: string }[];
  visionTag: string;
  visionQuote: string;
  blogTag: string;
  blogHeading: string;
  bannerHeading: string;
  bannerBody: string;
  seo?: { metaTitle?: string; metaDescription?: string };
}

const postSummaryProjection = `{
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  coverImage,
  publishedDate,
  readTime
}`;

const postDetailProjection = `{
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  coverImage,
  publishedDate,
  readTime,
  body,
  seo
}`;

export async function getHomepage(): Promise<HomepageDoc> {
  return sanityClient.fetch(`*[_id == "homepage"][0]`);
}

export async function getAllPosts(): Promise<PostSummary[]> {
  return sanityClient.fetch(`*[_type == "post"] | order(publishedDate desc) ${postSummaryProjection}`);
}

export async function getPostsByCategory(category: Category): Promise<PostSummary[]> {
  return sanityClient.fetch(
    `*[_type == "post" && category == $category] | order(publishedDate desc) ${postSummaryProjection}`,
    { category }
  );
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  return sanityClient.fetch(`*[_type == "post" && slug.current == $slug][0] ${postDetailProjection}`, { slug });
}

export function badgeClass(cat: Category): string {
  return cat === 'investment' ? 'bi' : cat === 'hidden' ? 'bh' : 'bs';
}
