import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Article',
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
      name: 'section',
      title: 'Section',
      type: 'reference',
      to: [{ type: 'section' }],
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'topic',
      title: 'Topic (tab)',
      description: 'Optional. The sub-section tab this article files under (e.g. "Pharmaceuticals" under Sectors). Only topics belonging to the selected section are shown.',
      type: 'reference',
      to: [{ type: 'topic' }],
      group: 'content',
      options: {
        filter: ({ document }: any) => {
          const sectionRef = document?.section?._ref;
          if (!sectionRef) return { filter: 'false' };
          return { filter: 'section._ref == $sectionRef', params: { sectionRef } };
        },
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'content',
    }),
    defineField({
      name: 'kicker',
      title: 'Kicker label',
      description: 'Small label above the headline, e.g. "Opinion · Weekly Column". Falls back to the section name.',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: '1–2 sentence summary shown on article cards.',
      type: 'text',
      group: 'content',
      rows: 3,
      validation: (Rule) => Rule.required().max(220),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedDate',
      title: 'Publish Date',
      type: 'date',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time',
      description: 'e.g. "8 min read"',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      description: 'Featured articles are eligible for the homepage hero when curation is empty.',
      type: 'boolean',
      group: 'content',
      initialValue: false,
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
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
    // Legacy field from the pre-revamp site; kept hidden until the section
    // migration has run everywhere, then it can be deleted.
    defineField({
      name: 'category',
      title: 'Category (legacy)',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'dateDesc',
      by: [{ field: 'publishedDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', section: 'section.title', media: 'coverImage' },
    prepare({ title, section, media }) {
      return { title, subtitle: section, media };
    },
  },
});
