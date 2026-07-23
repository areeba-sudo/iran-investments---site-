import { defineField, defineType } from 'sanity';

// A Topic is a sub-section "tab" that belongs to one Section (e.g. under
// "Sectors": Pharmaceuticals, Petrochemicals, …). The client adds a new tab
// simply by creating a Topic here and pointing it at a parent section — no code
// change needed. Articles are then filed under a topic on the section page.
export default defineType({
  name: 'topic',
  title: 'Topic (section tab)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'The tab label, e.g. "Pharmaceuticals".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL key',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'section',
      title: 'Parent section',
      description: 'Which section this tab appears under (e.g. Sectors).',
      type: 'reference',
      to: [{ type: 'section' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Tab order',
      description: 'Lower numbers appear first (after the “All” tab).',
      type: 'number',
      initialValue: 100,
    }),
  ],
  orderings: [{ title: 'Tab order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', section: 'section.title' },
    prepare({ title, section }) {
      return { title, subtitle: section ? `Tab under ${section}` : 'Topic' };
    },
  },
});
