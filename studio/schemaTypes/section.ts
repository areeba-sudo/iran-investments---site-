import { defineField, defineType } from 'sanity';

// Client-managed taxonomy. Sections drive the masthead nav, the "Explore
// Sectors" homepage cards, and article grouping — add/rename/reorder here
// without touching code.
export default defineType({
  name: 'section',
  title: 'Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Full section name, e.g. "Free Trade Zones".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'navLabel',
      title: 'Navigation label',
      description: 'Short label for the top menu, e.g. "FTZs". Falls back to the title.',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'One or two sentences shown on the section page and sector cards.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'cardImage',
      title: 'Card image',
      description: 'Photo revealed when hovering this section\'s card on the homepage.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'showInNav',
      title: 'Show in navigation menu',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      description: 'Lower numbers appear first in the menu and lists.',
      type: 'number',
      initialValue: 100,
    }),
    // ── Featured-download banner (shown above the footer on this section page) ──
    defineField({
      name: 'featuredDownload',
      title: 'Featured Download Banner',
      description:
        'A call-to-action banner above the footer promoting a downloadable resource. Change the featured piece here whenever it updates. Leave the resource empty to hide the banner.',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: 'resource',
          title: 'Resource to promote',
          description: 'The guide or white paper this banner links to (opens the email-gated download).',
          type: 'reference',
          to: [{ type: 'guide' }],
        },
        {
          name: 'heading',
          title: 'Heading',
          description: 'Optional. Falls back to the resource title.',
          type: 'string',
        },
        {
          name: 'blurb',
          title: 'Supporting line',
          description: 'Optional one-liner shown under the heading.',
          type: 'text',
          rows: 2,
        },
        {
          name: 'buttonLabel',
          title: 'Button label',
          type: 'string',
          initialValue: 'Download the guide',
        },
      ],
    }),
  ],
  orderings: [
    {
      title: 'Menu order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'description', media: 'cardImage' },
  },
});
