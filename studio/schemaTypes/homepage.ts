import { defineField, defineType } from 'sanity';

// Editor-curated homepage for the magazine design. Every block picks
// existing content (articles, guides, sections); the site falls back to
// the latest content when a block is left empty.
export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Carousel', default: true },
    { name: 'stories', title: 'Secondary Stories' },
    { name: 'market', title: 'Market Snapshot' },
    { name: 'guide', title: 'Premium Guide' },
    { name: 'sectors', title: 'Explore Sectors' },
    { name: 'insight', title: 'Featured Insight' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── HERO CAROUSEL ──
    defineField({
      name: 'heroSlides',
      title: 'Hero slides (up to 3 articles)',
      description: 'Pick the articles for the rotating hero. Empty = latest featured articles.',
      type: 'array',
      group: 'hero',
      validation: (Rule) => Rule.max(3),
      of: [
        {
          type: 'object',
          title: 'Slide',
          fields: [
            {
              name: 'article',
              title: 'Article',
              type: 'reference',
              to: [{ type: 'post' }],
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'kickerOverride',
              title: 'Kicker override',
              description: 'e.g. "Featured · Lead Story". Empty = article\'s kicker/section.',
              type: 'string',
            },
          ],
          preview: {
            select: { title: 'article.title', media: 'article.coverImage' },
          },
        },
      ],
    }),

    // ── SECONDARY STORIES ──
    defineField({
      name: 'secondaryStories',
      title: 'Secondary stories (2 articles)',
      description: 'The two headlines directly under the hero. Empty = next latest articles.',
      type: 'array',
      group: 'stories',
      validation: (Rule) => Rule.max(2),
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
    }),

    // ── MARKET SNAPSHOT ──
    defineField({
      name: 'marketAsOf',
      title: 'Snapshot date (optional override)',
      description:
        'Leave blank — the "as of" date updates automatically to whenever you last edit ' +
        'this page. Only set a date here to force a specific date instead.',
      type: 'date',
      group: 'market',
    }),
    defineField({
      name: 'marketMetrics',
      title: 'Metrics (up to 6)',
      type: 'array',
      group: 'market',
      validation: (Rule) => Rule.max(6),
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label (e.g. "GDP Growth")' },
            { name: 'value', type: 'string', title: 'Value (e.g. "4.2%")' },
            { name: 'change', type: 'string', title: 'Change (e.g. "0.6")' },
            {
              name: 'direction',
              type: 'string',
              title: 'Direction',
              options: {
                list: [
                  { title: '▲ Up (green)', value: 'up' },
                  { title: '▼ Down (green — improvement)', value: 'down-good' },
                  { title: '▼ Down (red)', value: 'down-bad' },
                ],
                layout: 'radio',
              },
              initialValue: 'up',
            },
            {
              name: 'liveSource',
              type: 'string',
              title: 'Live auto-update (optional)',
              description:
                'Leave as "Manual" to type the value yourself (use this for all Iran-specific figures). ' +
                'Choose "Brent oil" to have this metric refresh automatically from the live global oil price.',
              options: {
                list: [
                  { title: 'Manual (you type it)', value: 'manual' },
                  { title: 'Brent oil — live', value: 'brent' },
                ],
                layout: 'radio',
              },
              initialValue: 'manual',
            },
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        },
      ],
    }),

    // ── PREMIUM GUIDE ──
    defineField({
      name: 'premiumGuide',
      title: 'Featured guide',
      description: 'The PDF guide promoted in the big green callout.',
      type: 'reference',
      to: [{ type: 'guide' }],
      group: 'guide',
    }),

    // ── EXPLORE SECTORS ──
    defineField({
      name: 'sectorsHeading',
      title: 'Heading',
      type: 'string',
      group: 'sectors',
      initialValue: 'Where Iranian capital is moving next.',
    }),
    defineField({
      name: 'sectorsIntro',
      title: 'Intro text',
      type: 'text',
      rows: 2,
      group: 'sectors',
    }),
    defineField({
      name: 'featuredSections',
      title: 'Sections to feature (4 cards)',
      description: 'Empty = first 4 sections by sort order.',
      type: 'array',
      group: 'sectors',
      validation: (Rule) => Rule.max(4),
      of: [{ type: 'reference', to: [{ type: 'section' }] }],
    }),

    // ── FEATURED INSIGHT ──
    defineField({
      name: 'featuredInsight',
      title: 'Featured insight article',
      description: 'The opinion/analysis piece highlighted near the bottom.',
      type: 'reference',
      to: [{ type: 'post' }],
      group: 'insight',
    }),
    defineField({
      name: 'insightBadge',
      title: 'Corner badge text',
      type: 'string',
      group: 'insight',
      initialValue: 'Opinion · Weekly Column',
    }),

    // ── SEO ──
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare() {
      return { title: 'Homepage' };
    },
  },
});
