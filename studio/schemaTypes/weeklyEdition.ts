import { defineField, defineType } from 'sanity';

// Weekly Insights — a magazine-style weekly edition. Each has a portrait cover
// poster (shown in the homepage carousel + the Weekly Insights hero) and a
// wide banner used on its inner page.
export default defineType({
  name: 'weeklyEdition',
  title: 'Weekly Edition',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'editionLabel',
      title: 'Kicker label',
      description: 'Small label above the title, e.g. "Opinion · Weekly Column".',
      type: 'string',
      group: 'content',
      initialValue: 'Opinion · Weekly Column',
    }),
    defineField({
      name: 'editionDate',
      title: 'Edition date',
      type: 'date',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover poster (portrait)',
      description: 'The edition cover shown in the homepage carousel and the Weekly Insights hero.',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bannerImage',
      title: 'Inner-page banner (wide)',
      description: 'Wide hero image shown at the top of this edition’s article page.',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: '1–2 sentence summary shown in the carousel and cards.',
      type: 'text',
      group: 'content',
      rows: 3,
      validation: (Rule) => Rule.required().max(240),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'content',
    }),
    defineField({
      name: 'readTime',
      title: 'Read time',
      description: 'e.g. "8 min read"',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Article Body',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              { name: 'link', type: 'object', title: 'Link', fields: [{ name: 'href', type: 'url', title: 'URL' }] },
            ],
          },
        },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    { title: 'Newest edition first', name: 'dateDesc', by: [{ field: 'editionDate', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', date: 'editionDate', media: 'coverImage' },
    prepare({ title, date, media }) {
      return { title, subtitle: date ? `Edition · ${date}` : 'Weekly Edition', media };
    },
  },
});
