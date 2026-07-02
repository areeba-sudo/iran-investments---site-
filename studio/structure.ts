import type { StructureResolver } from 'sanity/structure';

// Clean, simple dashboard for a non-technical client:
// "Homepage" is a single editable document (singleton), "Blog Posts" is a normal list.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage')
        .child(S.document().schemaType('homepage').documentId('homepage')),
      S.divider(),
      S.documentTypeListItem('post').title('Blog Posts'),
    ]);
