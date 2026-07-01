import postsJson from './posts.json';
import categoriesJson from './categories.json';

export interface Post {
  id: number;
  cat: 'investment' | 'hidden' | 'strategy';
  title: string;
  excerpt: string;
  date: string;
  rt: string;
  body: string;
}

export interface CategoryMeta {
  label: string;
  desc: string;
}

export const posts = postsJson as Post[];
export const categories = categoriesJson as Record<string, CategoryMeta>;

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function postSlug(post: Post): string {
  return slugify(post.title);
}

export function coverImage(id: number): string {
  return `/images/cover-${id}.${id === 11 || id === 12 ? 'svg' : 'jpg'}`;
}

export function badgeClass(cat: string): string {
  return cat === 'investment' ? 'bi' : cat === 'hidden' ? 'bh' : 'bs';
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => postSlug(p) === slug);
}

export function getPostsByCategory(cat: string): Post[] {
  return posts.filter((p) => p.cat === cat);
}
