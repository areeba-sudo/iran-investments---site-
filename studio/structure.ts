import type { StructureResolver } from 'sanity/structure';

// Dashboard for a non-technical client:
//   Homepage + Site Settings are single editable documents (singletons);
//   everything else is a normal list, grouped by what it is.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage')
        .child(S.document().schemaType('homepage').documentId('homepage')),
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('post').title('Articles'),
      S.documentTypeListItem('weeklyEdition').title('Weekly Editions'),
      S.documentTypeListItem('section').title('Sections'),
      S.documentTypeListItem('topic').title('Topics (section tabs)'),
      S.documentTypeListItem('author').title('Authors'),
      S.divider(),
      S.listItem()
        .title('Guides')
        .child(
          S.documentList()
            .title('Guides')
            .filter('_type == "guide" && resourceType == "guide"')
            .canHandleIntent(() => false)
        ),
      S.listItem()
        .title('White Papers')
        .child(
          S.documentList()
            .title('White Papers')
            .filter('_type == "guide" && resourceType == "whitepaper"')
            .canHandleIntent(() => false)
        ),
      S.documentTypeListItem('guide').title('All Resources'),
      S.documentTypeListItem('podcastEpisode').title('Podcast Episodes'),
    ]);
