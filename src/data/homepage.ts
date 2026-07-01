// Phase 1: hardcoded, matches iran_investments_with_globe.html exactly.
// Phase 4 will replace this with a live Sanity query against the `homepage` singleton.
export const homepage = {
  hero: {
    pill: '🗞 Newsletter · Free to Read',
    headline: 'Your Investment<br>Journey Starts <em>Now</em>',
    subheadline:
      "Headlines, hot-takes, and practical intelligence on Iran's business landscape — so you can identify, protect, and grow your wealth before everyone else.",
  },
  why: {
    tag: 'Why Iran Investments',
    heading: 'The information gap<br>we exist to close',
    body: "Iran is one of the most misunderstood emerging markets on the planet. We cut through the noise with verified, on-the-ground intelligence and legal clarity.",
    items: [
      {
        title: 'Legitimate Intelligence',
        body: "Verified insights on Iran's business environment, regulations, and opportunities — free from media noise and political bias. Primary research, not extrapolation.",
        pillLabel: 'Intelligence',
        pillClass: 'wi-pill-green',
      },
      {
        title: 'Legal Framework Clarity',
        body: 'We map every permissible pathway. Know exactly how to engage Iranian markets without crossing any legal lines. Structured for real operators, not theorists.',
        pillLabel: 'Compliance',
        pillClass: 'wi-pill-red',
      },
      {
        title: 'Actionable Strategy',
        body: 'Not just what the opportunity is — but how to execute on it. Every piece of content moves you closer to a real, deployable market decision with clear next steps.',
        pillLabel: 'Strategy',
        pillClass: 'wi-pill-purple',
      },
    ],
  },
  stats: [
    { target: 85, unit: 'M+', label: 'Population', desc: 'Urban, educated consumers with substantial unmet demand for quality goods' },
    { target: 4, unit: 'B+', label: 'Pharma Market', desc: 'Annual pharmaceutical market value in USD, growing consistently year on year' },
    { target: 37, unit: 'M ha', label: 'Agricultural Land', desc: '5th largest agricultural land area in the Middle East, chronically underprocessed' },
    { target: 7, unit: '', label: 'Free Trade Zones', desc: 'Designated investment zones with 20-year tax exemptions for foreign capital' },
  ],
  whoWeAre: {
    tag: 'Who We Are',
    heading: 'Iran Focused Business Development and Investment Newsletter',
    tagline: 'For headlines, hot-takes, and practical content that helps you grab the right opportunities.',
    body: 'We provide free premium content on Iran and international business development — helping businessmen and investors identify and execute opportunities strategically.',
    readerCards: [
      { title: 'Business Owners', body: 'Expand into new markets with strategic intelligence' },
      { title: 'Entrepreneurs', body: 'Identify first-mover opportunities in an emerging economy' },
      { title: 'HNWIs', body: 'Diversify portfolios with high-potential market exposure' },
      { title: 'International Businesses', body: 'Structure compliant cross-border operations' },
    ],
  },
  vision: {
    tag: 'Our Vision',
    quote:
      'Nobody should stay blinded by geopolitical chaos — because right behind the chaos are opportunities that can make you rich.',
  },
  blogSection: {
    tag: 'Free Premium Content',
    heading: 'Content that helps you identify the right opportunities',
  },
  banner: {
    heading: 'Join the Conversation',
    body: 'Join the community of 10,000+ users and stay updated with the latest on-ground and practical content',
  },
  seo: {
    title: 'Iran Investments — Business Intelligence & Investment Newsletter',
    description:
      "Premium intelligence on Iran's business landscape for global investors, entrepreneurs, and business leaders — free to read, forever.",
  },
};
