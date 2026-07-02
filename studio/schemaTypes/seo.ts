import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Page title (for search engines & browser tab)',
      type: 'string',
      validation: (Rule) => Rule.max(60).warning('Titles longer than 60 characters may be truncated in search results.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      description: 'The short summary shown under the title in Google search results.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160).warning('Descriptions longer than 160 characters may be truncated in search results.'),
    }),
  ],
});
