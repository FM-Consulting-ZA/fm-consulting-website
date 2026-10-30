// Pricing page content. Every plan, price and comparison row lives here so the
// page component never needs editing to change an offer.
//
// DRAFT: tiers, prices and inclusions are proposals awaiting Fouad's sign-off.
// Do not merge to main until they are confirmed.

export type CellValue = boolean | string;

export interface PricingPlan {
  id: string;
  name: string;
  shortName: string; // used where columns are narrow (laptops, mobile tabs)
  tagline: string;
  pricePrefix: string; // e.g. "From"
  price: string; // formatted ZAR, e.g. "R18,500"
  priceSuffix: string; // e.g. "once-off", "/ month"
  priceNote: string;
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
  label: 'Pricing',
  heading: 'Senior strategy, priced in the open.',
  intro:
    'Four ways to work with FM Consulting. Every engagement is led by a senior strategist from the first call to the last report. No juniors, no agency overhead, no surprise line items.',
  compareHeading: 'Compare plans',
  compareIntro: 'What each engagement includes, line by line.',
  plans: [
    {
      id: 'diagnostic',
      name: 'Growth Diagnostic',
      shortName: 'Diagnostic',
      tagline: 'Find out what is holding growth back.',
      pricePrefix: 'From',
      price: 'R18,500',
      priceSuffix: 'once-off',
      priceNote: 'Two weeks, fixed fee',
      ctaLabel: 'Book diagnostic',
    },
    {
      id: 'sprint',
      name: 'Growth Sprint',
      shortName: 'Sprint',
      tagline: 'Fix the biggest leak, then build the plan.',
      pricePrefix: 'From',
      price: 'R48,000',
      priceSuffix: 'per sprint',
      priceNote: 'Six weeks, fixed scope',
      ctaLabel: 'Start a sprint',
    },
    {
      id: 'partner',
      name: 'Growth Partner',
      shortName: 'Partner',
      tagline: 'Ongoing strategy and performance oversight.',
      pricePrefix: 'From',
      price: 'R28,000',
      priceSuffix: '/ month',
      priceNote: 'Three-month minimum',
      ctaLabel: 'Partner with us',
      featured: true,
      badge: 'Recommended',
    },
    {
      id: 'fractional',
      name: 'Fractional CMO',
      shortName: 'Fractional',
      tagline: 'Senior marketing leadership, embedded.',
      pricePrefix: 'From',
      price: 'R55,000',
      priceSuffix: '/ month',
      priceNote: 'Six-month minimum',
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
    'All prices in South African rand. Final fees are confirmed in a written scope before work starts.',
    'Media spend, software licences and production costs are billed at cost and are not included.',
    'Retainers continue month to month after the minimum term, with 30 days’ notice to end.',
  ],
};
