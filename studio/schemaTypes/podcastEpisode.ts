import { defineField, defineType } from 'sanity';

// Podcast episodes (YouTube-hosted). The schema is ready now; the public
// /podcast page will be built in a later phase.
export default defineType({
  name: 'podcastEpisode',
  title: 'Podcast Episode',
  type: 'document',
  fields: [
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
      name: 'youtubeUrl',
      title: 'YouTube link',
      description: 'Full YouTube video URL, e.g. https://www.youtube.com/watch?v=…',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      description: 'Optional — if empty the YouTube thumbnail is used.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'guest',
      title: 'Guest name',
      type: 'string',
    }),
    defineField({
      name: 'episodeNumber',
      title: 'Episode number',
      type: 'number',
    }),
    defineField({
      name: 'publishedDate',
      title: 'Publish date',
      type: 'date',
      validation: (Rule) => Rule.required(),
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
    select: { title: 'title', subtitle: 'guest', media: 'coverImage' },
  },
});
