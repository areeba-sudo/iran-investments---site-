import type { APIRoute } from 'astro';
import { getAllPosts } from '../lib/sanity';

// Static JSON index of every live article, fetched by the header search overlay
// and filtered client-side. Rebuilt on each deploy alongside the site.
export const GET: APIRoute = async () => {
  const posts = await getAllPosts();
  const index = posts.map((p) => ({
    title: p.title,
    excerpt: p.excerpt,
    section: p.section?.title || '',
    slug: p.slug,
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
