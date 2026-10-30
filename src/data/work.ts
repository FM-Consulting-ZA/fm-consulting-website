// Work: sites FM Consulting has built or contributed to, viewable on /work
// without leaving the site.
//
// HOW A PROJECT GOES LIVE
// `published: false` projects show only on Vercel previews and localhost,
// with a "Draft" badge. They never render on the production domains. Flip a
// project to `published: true` only once its sign-off is in hand (see `clearance`).
// The /work page and its nav link stay hidden in production until at least one
// project is published.
//
// HOW A PROJECT IS SHOWN (`view`)
//   'embed' : the real site loads in a framed viewer. Only works when the site
//             allows framing (our own Vercel projects do; Shopify, Wix and most
//             client sites do not).
//   'video' : a recorded scroll-through plays in the viewer. Use for sites that
//             block framing or that we do not control. Drop the file in
//             /public/work/ and set `video`.
//   'link'  : nothing can be shown in place; the viewer explains why and offers
//             the site in a new tab. Last resort.

export type WorkKind = 'concept' | 'live';
export type WorkView = 'embed' | 'video' | 'link';

export interface WorkProject {
  slug: string;
  client: string;
  kind: WorkKind;
  sector: string;
  year: string;
  summary: string;
  /** Optional delivery credit shown under the summary. */
  credit?: string;
  /** Public address of the site. Missing = no viewer yet. */
  url?: string;
  view: WorkView;
  /** Path under /public for a recorded walkthrough (view: 'video'). */
  video?: string;
  /** Card image. Missing = typographic tile. */
  poster?: string;
  published: boolean;
  /** Internal note: what has to be true before `published` flips. Never rendered. */
  clearance: string;
}

export const workProjects: WorkProject[] = [
  {
    slug: 'linq',
    client: 'linq',
    kind: 'concept',
    sector: 'Jewellery e-commerce',
    year: '2026',
    summary:
      'A store concept built around stacking rings: a stack builder, ring sizing at home and an on-hand try-on that keeps the photo on the shopper’s phone.',
    credit: 'Delivered through Marketing Lab Solutions',
    url: 'https://linq.fmconsultingza.co.za',
    view: 'embed',
    published: false,
    clearance:
      'MLS engagement: Martin’s written OK to show it. Uses the founder’s own photography, so linq’s consent too.',
  },
  {
    slug: 'archdruid',
    client: 'Archdruid™',
    kind: 'concept',
    sector: 'Streetwear',
    year: '2026',
    summary:
      'A collector-led storefront for a limited-run outerwear label. Every piece is numbered, collectors hear first, and requests move straight to WhatsApp.',
    url: 'https://archdruid.fmconsultingza.co.za',
    view: 'embed',
    poster: 'https://archdruid.fmconsultingza.co.za/og-image.png',
    published: false,
    clearance:
      'Unsolicited pitch for a trademarked brand while Raul is still deciding. Needs Raul’s OK, or wait until the pitch is settled.',
  },
  {
    slug: 'nion',
    client: 'NION',
    kind: 'concept',
    sector: 'Direct-to-consumer',
    year: '2026',
    summary: 'A direct-to-consumer store concept for a dissolvable nicotine strip brand, built as a working Shopify storefront.',
    credit: 'Delivered through Marketing Lab Solutions',
    url: 'https://nion-d2c-mock.myshopify.com',
    // Tested 30 Oct 2026: Shopify sends X-Frame-Options DENY and
    // frame-ancestors 'none', so it cannot be embedded. Record a scroll-through,
    // save it as /public/work/nion.mp4, then switch to 'video'.
    // Until then it opens in a new tab.
    view: 'link',
    published: true,
    clearance: 'Martin approved, 30 Oct 2026. Store is public. Swap to video once recorded.',
  },
  {
    slug: 'lobster-tavern',
    client: 'Lobster Tavern',
    kind: 'live',
    sector: 'Hospitality',
    year: '2021 – Present',
    summary: 'Luxury seafood dining in Johannesburg and Cape Town.',
    url: 'https://lobstertavern.com',
    // Tested 30 Oct 2026: lobstertavern.com sends frame-ancestors 'none', so it
    // cannot be embedded. Either record a scroll-through to /public/work/lobster-tavern.mp4
    // and set `video`, or have the site allow https://www.fmconsultingza.co.za in
    // frame-ancestors and switch back to 'embed'. Until then it opens in a new tab.
    view: 'link',
    published: true,
    clearance: 'Lobster Tavern approved, 30 Oct 2026. Swap to video or embed when ready.',
  },
  {
    slug: 'thynkverse',
    client: 'Thynkverse',
    kind: 'live',
    sector: 'Professional Services',
    year: '2024',
    summary:
      'A business technology studio that connects brand, digital products, systems and automation around how each client actually works.',
    // Tested 30 Oct 2026: embeds cleanly.
    url: 'https://www.thynkverse.co.za',
    view: 'embed',
    published: true,
    clearance: 'Stan approved, 30 Oct 2026.',
  },
  {
    slug: 'chapmans-peak',
    client: 'Chapman’s Peak Drive',
    kind: 'concept',
    sector: 'Tourism',
    year: '2026',
    summary: 'A concept website for Chapman’s Peak Drive.',
    view: 'embed',
    published: false,
    clearance:
      'Thynkverse client: showing it under FM needs your and Stan’s call, plus the client’s OK. URL still to confirm.',
  },
];

const PRODUCTION_HOSTS = [
  'www.fmconsultingza.co.za',
  'fmconsultingza.co.za',
  'www.fouadmaasdorp.me',
  'fouadmaasdorp.me',
];

/** True on the live domains; false on Vercel previews and localhost. */
export const isProductionHost =
  typeof window !== 'undefined' && PRODUCTION_HOSTS.includes(window.location.hostname);

/** Projects this visitor may see: published ones everywhere, drafts only off production. */
export const visibleWork = workProjects.filter((p) => p.published || !isProductionHost);

/** Whether /work and its nav link exist on this host. */
export const workEnabled = visibleWork.length > 0;

export const kindLabel: Record<WorkKind, string> = {
  concept: 'Concept',
  live: 'Live site',
};

export function hostOf(url?: string) {
  if (!url) return '';
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
