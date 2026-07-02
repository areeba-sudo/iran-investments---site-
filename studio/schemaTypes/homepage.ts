import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'why', title: 'Why Section' },
    { name: 'stats', title: 'Stats' },
    { name: 'who', title: 'Who We Are' },
    { name: 'vision', title: 'Vision' },
    { name: 'blog', title: 'Blog Section' },
    { name: 'banner', title: 'Banner' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── HERO ──
    defineField({
      name: 'heroPill',
      title: 'Pill text',
      description: 'Small pill above the headline, e.g. "🗞 Newsletter · Free to Read"',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Headline',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroHeadlineAccent',
      title: 'Headline accent word',
      description: 'The word/phrase shown in orange italic at the end of the headline, e.g. "Now"',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),

    // ── WHY SECTION ──
    defineField({
      name: 'whyTag',
      title: 'Section tag',
      type: 'string',
      group: 'why',
    }),
    defineField({
      name: 'whyHeading',
      title: 'Heading',
      type: 'string',
      group: 'why',
    }),
    defineField({
      name: 'whyBody',
      title: 'Body',
      type: 'text',
      rows: 3,
      group: 'why',
    }),
    defineField({
      name: 'whyItems',
      title: 'Three reasons',
      type: 'array',
      group: 'why',
      validation: (Rule) => Rule.length(3),
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'body', type: 'text', title: 'Body', rows: 3 },
            { name: 'pillLabel', type: 'string', title: 'Pill label' },
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),

    // ── STATS ──
    defineField({
      name: 'stats',
      title: 'Stats (exactly 4)',
      type: 'array',
      group: 'stats',
      validation: (Rule) => Rule.length(4),
      of: [
        {
          type: 'object',
          fields: [
            { name: 'target', type: 'number', title: 'Number' },
            { name: 'unit', type: 'string', title: 'Unit (e.g. "M+", "B+", "M ha")' },
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'desc', type: 'text', title: 'Description', rows: 2 },
          ],
          preview: { select: { title: 'label', subtitle: 'target' } },
        },
      ],
    }),

    // ── WHO WE ARE ──
    defineField({ name: 'whoTag', title: 'Section tag', type: 'string', group: 'who' }),
    defineField({ name: 'whoHeading', title: 'Heading', type: 'string', group: 'who' }),
    defineField({ name: 'whoTagline', title: 'Tagline', type: 'string', group: 'who' }),
    defineField({ name: 'whoBody', title: 'Body', type: 'text', rows: 3, group: 'who' }),
    defineField({
      name: 'whoReaderCards',
      title: 'Reader cards (exactly 4)',
      type: 'array',
      group: 'who',
      validation: (Rule) => Rule.length(4),
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'body', type: 'text', title: 'Body', rows: 2 },
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),

    // ── VISION ──
    defineField({ name: 'visionTag', title: 'Section tag', type: 'string', group: 'vision' }),
    defineField({ name: 'visionQuote', title: 'Quote', type: 'text', rows: 3, group: 'vision' }),

    // ── BLOG SECTION ──
    defineField({ name: 'blogTag', title: 'Section tag', type: 'string', group: 'blog' }),
    defineField({ name: 'blogHeading', title: 'Heading', type: 'string', group: 'blog' }),

    // ── BANNER ──
    defineField({ name: 'bannerHeading', title: 'Heading', type: 'string', group: 'banner' }),
    defineField({ name: 'bannerBody', title: 'Body', type: 'text', rows: 2, group: 'banner' }),

    // ── SEO ──
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare() {
      return { title: 'Homepage' };
    },
  },
});
