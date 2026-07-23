import { defineField, defineType } from 'sanity';

// Singleton for the global site chrome: masthead tagline, footer, socials.
export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'brand', title: 'Brand', default: true },
    { name: 'footer', title: 'Footer' },
    { name: 'social', title: 'Social Links' },
    { name: 'subscribe', title: 'Subscribe Copy' },
  ],
  fields: [
    // ── BRAND ──
    defineField({
      name: 'siteName',
      title: 'Site name',
      type: 'string',
      group: 'brand',
      initialValue: 'IRAN INVESTMENT',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      description: 'The small line under the wordmark, e.g. "ECONOMICS · MARKETS · OPPORTUNITIES".',
      type: 'string',
      group: 'brand',
      initialValue: 'ECONOMICS · MARKETS · OPPORTUNITIES',
    }),

    // ── FOOTER ──
    defineField({
      name: 'footerAbout',
      title: 'Footer about text',
      type: 'text',
      rows: 3,
      group: 'footer',
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer link columns',
      type: 'array',
      group: 'footer',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', type: 'string', title: 'Column heading' },
            {
              name: 'links',
              type: 'array',
              title: 'Links',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', type: 'string', title: 'Label' },
                    { name: 'url', type: 'string', title: 'URL (e.g. /guides or https://…)' },
                  ],
                  preview: { select: { title: 'label', subtitle: 'url' } },
                },
              ],
            },
          ],
          preview: { select: { title: 'heading' } },
        },
      ],
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright line',
      type: 'string',
      group: 'footer',
      initialValue: '© 2026 Iran Investment. All rights reserved.',
    }),

    // ── SOCIAL ──
    defineField({ name: 'twitterUrl', title: 'X / Twitter URL', type: 'url', group: 'social' }),
    defineField({ name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url', group: 'social' }),
    defineField({ name: 'youtubeUrl', title: 'YouTube URL', type: 'url', group: 'social' }),

    // ── SUBSCRIBE ──
    defineField({
      name: 'subscribeHeading',
      title: 'Subscribe strip heading',
      type: 'string',
      group: 'subscribe',
      initialValue: 'Weekly insights, delivered.',
    }),
    defineField({
      name: 'subscribeSubheading',
      title: 'Subscribe strip subheading',
      type: 'string',
      group: 'subscribe',
      initialValue: 'Join investors and executives who read Iran Investment every week.',
    }),
    defineField({
      name: 'subscribeDisclaimer',
      title: 'Subscribe disclaimer',
      type: 'string',
      group: 'subscribe',
      initialValue: 'No spam. Unsubscribe anytime.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
});
