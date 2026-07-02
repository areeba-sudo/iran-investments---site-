import { toHTML } from '@portabletext/to-html';
import { urlFor } from './sanity';

// Matches the markup produced by the original file's article bodies exactly:
// first paragraph gets class="art-intro-p", headings are H2/H3, quotes are
// <blockquote>, inline images carry their alt text.
export function bodyToHTML(blocks: any[]): string {
  return toHTML(blocks, {
    components: {
      block: {
        normal: ({ children, index }) => (index === 0 ? `<p class="art-intro-p">${children}</p>` : `<p>${children}</p>`),
        h2: ({ children }) => `<h2>${children}</h2>`,
        h3: ({ children }) => `<h3>${children}</h3>`,
        blockquote: ({ children }) => `<blockquote>${children}</blockquote>`,
      },
      types: {
        image: ({ value }) => {
          const src = urlFor(value).width(1400).auto('format').url();
          const alt = value.alt || '';
          return `<img src="${src}" alt="${alt}">`;
        },
      },
      marks: {
        strong: ({ children }) => `<strong>${children}</strong>`,
        em: ({ children }) => `<em>${children}</em>`,
        link: ({ children, value }) => `<a href="${value?.href}" target="_blank" rel="noopener">${children}</a>`,
      },
    },
  });
}
