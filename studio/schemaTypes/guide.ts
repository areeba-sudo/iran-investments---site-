import { defineField, defineType } from 'sanity';

// Email-gated PDF lead magnet. Visitors enter their email (which subscribes
// them via Beehiiv) and receive the PDF download.
export default defineType({
  name: 'guide',
  title: 'Resource (PDF)',
  type: 'document',
  fields: [
    defineField({
      name: 'resourceType',
      title: 'Type',
      description: 'Determines which page it appears on: Guides or White Papers.',
      type: 'string',
      options: {
        list: [
          { title: 'Guide', value: 'guide' },
          { title: 'White Paper', value: 'whitepaper' },
        ],
        layout: 'radio',
      },
      initialValue: 'guide',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'description',
      title: 'Description',
      description: 'Sales copy shown on the guide card / callout, e.g. "A 42-page practitioner\'s guide to…".',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pdfFile',
      title: 'PDF file',
      type: 'file',
      options: { accept: 'application/pdf' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image (optional)',
      description: 'Optional visual; the site also renders a styled book-cover mock from the title.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'editionLabel',
      title: 'Edition label',
      description: 'e.g. "2026 Edition · 42 pp" — shown on the book-cover mock.',
      type: 'string',
    }),
    defineField({
      name: 'badgeLabel',
      title: 'Badge label',
      description: 'e.g. "Premium Guide · Free".',
      type: 'string',
      initialValue: 'Premium Guide · Free',
    }),
    defineField({
      name: 'socialProof',
      title: 'Social proof line',
      description: 'e.g. "Downloaded by 3,400+ investors". Leave empty to hide.',
      type: 'string',
    }),
    defineField({
      name: 'beehiivTag',
      title: 'Beehiiv tag / UTM label',
      description:
        'Identifier sent to Beehiiv when someone downloads this guide, so you can see which guide converted them. Lowercase, no spaces, e.g. "legal-structuring-handbook".',
      type: 'string',
    }),
    defineField({
      name: 'publishedDate',
      title: 'Publish date',
      type: 'date',
    }),
  ],
  preview: {
    select: { title: 'title', resourceType: 'resourceType', media: 'coverImage' },
    prepare({ title, resourceType, media }) {
      return { title, subtitle: resourceType === 'whitepaper' ? 'White Paper' : 'Guide', media };
    },
  },
});
