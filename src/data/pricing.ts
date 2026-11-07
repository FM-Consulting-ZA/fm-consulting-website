// Pricing page content. Every plan, price and comparison row lives here so the
// page component never needs editing to change an offer.
//
// No fees are published: each plan shows its format and term, and fees are
// scoped per business and confirmed in a written proposal.
// Approved by Fouad, 30 October 2026.

export type CellValue = boolean | string;

export interface PricingPlan {
  id: string;
  name: string;
  shortName: string; // used where columns are narrow (laptops, mobile tabs)
  tagline: string;
  lead: string; // the headline commitment, e.g. "2 weeks", "Monthly"
  basis: string; // how it is charged, e.g. "Fixed fee", "Retainer"
  note: string;
  ctaLabel: string;
  featured?: boolean;
  badge?: string;
}

export interface PricingRow {
  label: string;
  /** One value per plan, in the same order as `plans`. */
  values: [CellValue, CellValue, CellValue, CellValue];
}

export interface PricingCategory {
  title: string;
  rows: PricingRow[];
}

export interface PricingConfig {
  label: string;
  heading: string;
  intro: string;
  compareHeading: string;
  compareIntro: string;
  plans: [PricingPlan, PricingPlan, PricingPlan, PricingPlan];
  categories: PricingCategory[];
  footnotes: string[];
}

export const pricingConfig: PricingConfig = {
  label: 'Engagements',
  heading: 'Four ways to work with us.',
  intro:
    'Every engagement is led by a senior strategist from the first call to the last report. Fees are scoped to your business and confirmed in writing before any work starts.',
  compareHeading: 'Compare engagements',
  compareIntro: 'What each engagement includes, line by line.',
  plans: [
    {
      id: 'diagnostic',
      name: 'Growth Diagnostic',
      shortName: 'Diagnostic',
      tagline: 'Find out what is holding growth back.',
      lead: '2 weeks',
      basis: 'Fixed fee',
      note: 'Ends with a 90-day roadmap',
      ctaLabel: 'Book diagnostic',
    },
    {
      id: 'sprint',
      name: 'Growth Sprint',
      shortName: 'Sprint',
      tagline: 'Fix the biggest leak, then build the plan.',
      lead: '6 weeks',
      basis: 'Fixed scope',
      note: 'One leak fixed, one plan built',
      ctaLabel: 'Start a sprint',
    },
    {
      id: 'partner',
      name: 'Growth Partner',
      shortName: 'Partner',
      tagline: 'Ongoing strategy and performance oversight.',
      lead: 'Monthly',
      basis: 'Retainer',
      note: 'Three-month minimum',
      ctaLabel: 'Partner with us',
      featured: true,
      badge: 'Recommended',
    },
    {
      id: 'fractional',
      name: 'Fractional CMO',
      shortName: 'Fractional',
      tagline: 'Senior marketing leadership, embedded.',
      lead: 'Monthly',
      basis: 'Retainer',
      note: 'Six-month minimum',
      ctaLabel: 'Discuss scope',
    },
  ],
  categories: [
    {
      title: 'Engagement',
      rows: [
        { label: 'Format', values: ['Audit and readout', 'Fixed-scope project', 'Monthly retainer', 'Embedded leadership'] },
        { label: 'Minimum term', values: ['2 weeks', '6 weeks', '3 months', '6 months'] },
        { label: 'Senior strategist on every call', values: [true, true, true, true] },
        { label: 'Working sessions', values: ['2', 'Weekly', 'Fortnightly', 'Weekly'] },
        { label: 'Response time', values: ['2 business days', '1 business day', '1 business day', 'Same day'] },
        { label: 'Direct WhatsApp line', values: [false, true, true, true] },
      ],
    },
    {
      title: 'Strategy and planning',
      rows: [
        { label: 'Commercial and funnel diagnostic', values: [true, true, true, true] },
        { label: 'Market and competitor review', values: [true, true, true, true] },
        { label: 'Growth roadmap', values: ['90-day', '90-day', '12-month', '12-month'] },
        { label: 'Channel and budget allocation', values: [false, true, true, true] },
        { label: 'Quarterly strategy review', values: [false, false, true, true] },
      ],
    },
    {
      title: 'Acquisition and conversion',
      rows: [
        { label: 'Paid media strategy and campaign architecture', values: [false, true, true, true] },
        { label: 'Landing page and conversion recommendations', values: ['Audit only', true, true, true] },
        { label: 'Ongoing conversion testing', values: [false, false, true, true] },
        { label: 'Agency and media-buyer oversight', values: [false, false, true, true] },
      ],
    },
    {
      title: 'Lifecycle and CRM',
      rows: [
        { label: 'CRM and lifecycle audit', values: [true, true, true, true] },
        { label: 'WhatsApp and email journeys', values: [false, '1 journey', 'Up to 3', 'Full programme'] },
        { label: 'POPIA consent review', values: [true, true, true, true] },
        { label: 'Retention programme design', values: [false, false, true, true] },
      ],
    },
    {
      title: 'Measurement',
      rows: [
        { label: 'KPI framework', values: [true, true, true, true] },
        { label: 'Performance dashboard', values: [false, true, true, true] },
        { label: 'Reporting', values: ['Final report', 'End of sprint', 'Monthly', 'Fortnightly'] },
        { label: 'Board and exco reporting', values: [false, false, false, true] },
      ],
    },
    {
      title: 'Leadership',
      rows: [
        { label: 'Team and supplier management', values: [false, false, false, true] },
        { label: 'Hiring support for marketing roles', values: [false, false, false, true] },
        { label: 'Seat in leadership meetings', values: [false, false, false, true] },
      ],
    },
  ],
  footnotes: [
    'Fees depend on the size of the business and the scope agreed. You receive a written proposal with a fixed fee or monthly retainer before work starts.',
    'Media spend, software licences and production costs are billed at cost and are not included.',
    'Retainers continue month to month after the minimum term, with 30 days’ notice to end.',
  ],
};
