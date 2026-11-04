// The Growth Playbook (/playbooks): the visitor enters their own monthly
// numbers, we find the stage where the most is leaking, and the playbook
// opens on the chapters for that leak.
//
// Everything here runs in the visitor's browser. Nothing is sent anywhere
// unless they ask for the emailed leak report.
//
// FIRST-LOOK RANGES — FOUAD TO CONFIRM
// The ranges below are working assumptions used to decide where to look
// first. They are deliberately broad and are not sector benchmarks. The page
// and the PDF both say so. Change them here; nothing else needs editing.

export type Flow = 'quote' | 'enquiry' | 'direct';
export type LeakId = 'lead' | 'quote' | 'close' | 'checkout' | 'repeat' | 'measure';

export interface PlaybookInputs {
  flow: Flow;
  visits: number | null;
  leads: number | null;
  quotes: number | null;
  sales: number | null;
  avgSale: number | null;
  /** Percentage, 0-100. */
  repeat: number | null;
}

export const emptyInputs: PlaybookInputs = {
  flow: 'quote',
  visits: null,
  leads: null,
  quotes: null,
  sales: null,
  avgSale: null,
  repeat: null,
};

/** A believable service business, for visitors who want to see it work first. */
export const exampleInputs: PlaybookInputs = {
  flow: 'quote',
  visits: 10000,
  leads: 300,
  quotes: 120,
  sales: 30,
  avgSale: 4000,
  repeat: 18,
};

export type QuestionKey = 'visits' | 'leads' | 'quotes' | 'sales' | 'avgSale' | 'repeat';

export interface Question {
  key: QuestionKey;
  question: string;
  help: string;
  unit: 'count' | 'rand' | 'percent';
  suffix: string;
  /** Optional switch that changes the shape of the funnel. */
  toggle?: { label: string; flow: Flow };
}

export const questions: Question[] = [
  {
    key: 'visits',
    question: 'How many people visit your website in a month?',
    help: 'Google Analytics shows this under Reports, last 30 days. A rough figure is fine.',
    unit: 'count',
    suffix: 'visits a month',
  },
  {
    key: 'leads',
    question: 'How many new enquiries come in a month?',
    help: 'Forms, calls, emails and WhatsApp messages from people who are not customers yet. Bookings count too.',
    unit: 'count',
    suffix: 'enquiries a month',
    toggle: { label: 'Customers buy online without enquiring first', flow: 'direct' },
  },
  {
    key: 'quotes',
    question: 'How many quotes or proposals go out a month?',
    help: 'Count each priced quote, proposal or booking confirmation you send.',
    unit: 'count',
    suffix: 'quotes a month',
    toggle: { label: "We don't send quotes", flow: 'enquiry' },
  },
  {
    key: 'sales',
    question: 'How many new customers buy in a month?',
    help: 'First-time customers only. Repeat customers come later.',
    unit: 'count',
    suffix: 'new customers a month',
  },
  {
    key: 'avgSale',
    question: 'What does an average sale bring in?',
    help: 'Total sales value divided by the number of sales. Before VAT if you charge it.',
    unit: 'rand',
    suffix: 'per sale',
  },
  {
    key: 'repeat',
    question: 'Of last year’s customers, how many have bought again?',
    help: 'As a percentage. If 100 people bought last year and 20 came back, enter 20.',
    unit: 'percent',
    suffix: 'bought again',
  },
];

/** Which questions apply to which funnel shape. */
export function questionsFor(flow: Flow): Question[] {
  if (flow === 'direct') return questions.filter((q) => q.key !== 'leads' && q.key !== 'quotes');
  if (flow === 'enquiry') return questions.filter((q) => q.key !== 'quotes');
  return questions;
}

interface StageDef {
  leak: Exclude<LeakId, 'measure'>;
  from: string;
  to: string;
  range: [number, number];
}

// First-look ranges as fractions. See the note at the top of this file.
const RANGES = {
  lead: [0.01, 0.03] as [number, number],
  quote: [0.5, 0.75] as [number, number],
  closeQuote: [0.2, 0.4] as [number, number],
  closeEnquiry: [0.15, 0.3] as [number, number],
  checkout: [0.01, 0.03] as [number, number],
  repeat: [0.2, 0.4] as [number, number],
};

export interface Stage {
  leak: Exclude<LeakId, 'measure'>;
  from: string;
  to: string;
  /** Count at the start of the step; null when unknown. */
  fromCount: number | null;
  toCount: number | null;
  rate: number | null;
  range: [number, number];
  status: 'below' | 'within' | 'above' | 'unknown';
}

export interface FunnelStep {
  label: string;
  count: number | null;
}

export interface LeakResult {
  leak: LeakId;
  stages: Stage[];
  steps: FunnelStep[];
  /** The stage the result is about, when there is one. */
  stage: Stage | null;
  /** True when no stage sits below its range and we picked the most headroom. */
  headroomOnly: boolean;
  /** Extra revenue a month if the leak stage reached its target, in rand. */
  monthlyValue: number | null;
  /** Extra customers a month at the same target. */
  extraCustomers: number | null;
  /** The rate we used as the target. */
  target: number | null;
  unknownCount: number;
  warnings: string[];
}

function stageDefs(flow: Flow): StageDef[] {
  const repeat: StageDef = { leak: 'repeat', from: 'New customers', to: 'Buy again', range: RANGES.repeat };
  if (flow === 'direct') {
    return [{ leak: 'checkout', from: 'Visits', to: 'New customers', range: RANGES.checkout }, repeat];
  }
  if (flow === 'enquiry') {
    return [
      { leak: 'lead', from: 'Visits', to: 'Enquiries', range: RANGES.lead },
      { leak: 'close', from: 'Enquiries', to: 'New customers', range: RANGES.closeEnquiry },
      repeat,
    ];
  }
  return [
    { leak: 'lead', from: 'Visits', to: 'Enquiries', range: RANGES.lead },
    { leak: 'quote', from: 'Enquiries', to: 'Quotes', range: RANGES.quote },
    { leak: 'close', from: 'Quotes', to: 'New customers', range: RANGES.closeQuote },
    repeat,
  ];
}

function countsFor(input: PlaybookInputs): (number | null)[] {
  // Counts in funnel order, matching stageDefs (repeat handled separately).
  if (input.flow === 'direct') return [input.visits, input.sales];
  if (input.flow === 'enquiry') return [input.visits, input.leads, input.sales];
  return [input.visits, input.leads, input.quotes, input.sales];
}

const mid = (r: [number, number]) => (r[0] + r[1]) / 2;

export function analyse(input: PlaybookInputs): LeakResult {
  const defs = stageDefs(input.flow);
  const counts = countsFor(input);
  const warnings: string[] = [];

  const stages: Stage[] = defs.map((def, i) => {
    let fromCount: number | null;
    let toCount: number | null;
    let rate: number | null;
    if (def.leak === 'repeat') {
      fromCount = input.sales;
      toCount = input.sales != null && input.repeat != null ? Math.round((input.sales * input.repeat) / 100) : null;
      rate = input.repeat != null ? input.repeat / 100 : null;
    } else {
      fromCount = counts[i];
      toCount = counts[i + 1];
      rate = fromCount != null && toCount != null && fromCount > 0 ? toCount / fromCount : null;
    }
    const status: Stage['status'] =
      rate == null ? 'unknown' : rate < def.range[0] ? 'below' : rate > def.range[1] ? 'above' : 'within';
    return { ...def, fromCount, toCount, rate, status };
  });

  stages.forEach((s) => {
    if (s.rate != null && s.rate > 1 && s.leak !== 'repeat') {
      warnings.push(
        `There are more ${s.to.toLowerCase()} than ${s.from.toLowerCase()}. Some sales may skip a step, or the figures come from different months. Worth checking before acting on it.`
      );
    }
  });

  const labels =
    input.flow === 'direct'
      ? ['Visits', 'New customers']
      : input.flow === 'enquiry'
        ? ['Visits', 'Enquiries', 'New customers']
        : ['Visits', 'Enquiries', 'Quotes', 'New customers'];
  const steps: FunnelStep[] = labels.map((label, i) => ({ label, count: counts[i] }));

  const asked = questionsFor(input.flow).map((q) => input[q.key]);
  const unknownCount = asked.filter((v) => v == null).length;

  // Not enough to see the funnel: measurement is the first leak.
  if (input.visits == null || input.sales == null || unknownCount >= 3) {
    return {
      leak: 'measure',
      stages,
      steps,
      stage: null,
      headroomOnly: false,
      monthlyValue: null,
      extraCustomers: null,
      target: null,
      unknownCount,
      warnings,
    };
  }

  const known = stages.filter((s) => s.rate != null);
  const below = known.filter((s) => s.status === 'below');
  let stage: Stage | null;
  let headroomOnly = false;
  let target: number | null = null;

  if (below.length) {
    // The stage furthest below the bottom of its range, relative to that range.
    stage = below.reduce((worst, s) =>
      (s.rate as number) / s.range[0] < (worst.rate as number) / worst.range[0] ? s : worst
    );
    target = stage.range[0];
  } else if (known.length) {
    headroomOnly = true;
    stage = known.reduce((best, s) => ((s.rate as number) / mid(s.range) < (best.rate as number) / mid(best.range) ? s : best));
    // Nothing is below range: aim for the top of the range, if there is room.
    target = Math.max(stage.range[1], stage.rate as number);
  } else {
    stage = null;
  }

  let monthlyValue: number | null = null;
  let extraCustomers: number | null = null;

  // Figures that contradict each other (more sales than quotes, say) would
  // produce a meaningless projection, so no rand value is shown.
  const inconsistent = stages.some((s) => s.leak !== 'repeat' && s.rate != null && s.rate > 1);

  if (stage && target != null && !inconsistent) {
    if (stage.leak === 'repeat') {
      const extra = (input.sales as number) * (target - (stage.rate as number));
      extraCustomers = Math.max(0, extra);
      monthlyValue = input.avgSale != null ? extraCustomers * input.avgSale : null;
    } else {
      // Rebuild the funnel from visits with the leak stage at its target.
      // Unknown rates use the middle of their range for the projection only.
      const funnel = stages.filter((s) => s.leak !== 'repeat');
      const project = (useTarget: boolean) =>
        funnel.reduce((n, s) => {
          const r = s === stage && useTarget ? (target as number) : (s.rate ?? mid(s.range));
          return n * r;
        }, input.visits as number);
      const now = project(false);
      const fixed = project(true);
      extraCustomers = Math.max(0, fixed - now);
      monthlyValue = input.avgSale != null ? extraCustomers * input.avgSale : null;
    }
  }

  return {
    leak: stage ? stage.leak : 'measure',
    stages,
    steps,
    stage,
    headroomOnly,
    monthlyValue,
    extraCustomers,
    target,
    unknownCount,
    warnings,
  };
}

/* ------------------------------------------------------------------------ */
/* The playbook for each leak                                               */
/* ------------------------------------------------------------------------ */

export interface Chapter {
  title: string;
  look: string;
  questions: string[];
  work: string;
  decision: string;
}

export interface LeakPlaybook {
  id: LeakId;
  /** Short name of the leak, for headings and the report. */
  name: string;
  headline: string;
  summary: string;
  /** Plan id on the Engagements page and the contact form. */
  plan: 'diagnostic' | 'sprint' | 'partner' | 'fractional';
  planName: string;
  planWhy: string;
  chapters: Chapter[];
}

export const playbooks: Record<LeakId, LeakPlaybook> = {
  lead: {
    id: 'lead',
    name: 'Visits to enquiries',
    headline: 'People visit, but few put their hand up.',
    summary:
      'Traffic is arriving and leaving without a word. Before buying more of it, we find out who it is, what the page asks of them and how hard it is to start a conversation.',
    plan: 'sprint',
    planName: 'Growth Sprint',
    planWhy: 'Six weeks to fix how visits turn into enquiries, then a plan for what comes next.',
    chapters: [
      {
        title: 'Where the visits really come from',
        look: 'Traffic and enquiries side by side, by source. A channel that brings visits but never enquiries is either the wrong audience or the wrong promise.',
        questions: [
          'Which sources send people who never enquire?',
          'Are the people who arrive the people you can serve?',
          'What are you paying per enquiry, by channel?',
        ],
        work: 'Channel and source review',
        decision: 'Which spend to cut, which to keep and which to test.',
      },
      {
        title: 'What the page asks of them',
        look: 'The pages people land on, read the way a first-time buyer reads them: the promise, the proof, the price signal and the next step.',
        questions: [
          'Can a visitor tell in five seconds what you sell and who it is for?',
          'What would they need to know before they would contact you?',
          'Is the next step obvious, or hidden below the fold?',
        ],
        work: 'Landing page and conversion audit',
        decision: 'The three page changes worth briefing first.',
      },
      {
        title: 'How easy it is to start a conversation',
        look: 'Every way in: the form, the phone number, WhatsApp, the booking link. Each extra question is a reason to leave.',
        questions: [
          'How many fields stand between a visitor and a reply?',
          'Can they reach you on the channel they already use?',
          'What happens on a phone, on mobile data?',
        ],
        work: 'Enquiry path review',
        decision: 'Ask what starts the conversation; ask the rest on the call.',
      },
      {
        title: 'What we measure from here',
        look: 'One enquiry rate, defined once and read the same way by everyone, by source and by page.',
        questions: ['What counts as an enquiry?', 'Who reads the number each week?', 'What would make us change course?'],
        work: 'KPI framework',
        decision: 'The number the next six weeks are judged on.',
      },
    ],
  },
  quote: {
    id: 'quote',
    name: 'Enquiries to quotes',
    headline: 'Enquiries arrive. Too few become quotes.',
    summary:
      'The interest is there and the hand is up, then the conversation stalls. This is almost always about ownership and speed, not marketing.',
    plan: 'sprint',
    planName: 'Growth Sprint',
    planWhy: 'Six weeks to put an owner and a reply time on every enquiry, with one follow-up journey built.',
    chapters: [
      {
        title: 'Who owns an enquiry',
        look: 'The path from the first message to the quote: where it lands, who picks it up and what travels with it.',
        questions: [
          'When an enquiry arrives, whose job is it, by name?',
          'Where do enquiries wait when that person is busy?',
          'What gets written down before the quote?',
        ],
        work: 'CRM and lifecycle audit',
        decision: 'Every enquiry gets an owner and a reply-by time.',
      },
      {
        title: 'How long they wait',
        look: 'Time to first reply and time to quote, measured from your own inbox and WhatsApp, not from memory.',
        questions: [
          'How long does the slowest 10% of enquiries wait?',
          'What happens to enquiries that arrive after hours?',
          'Who do they hear from while they wait?',
        ],
        work: 'Response-time baseline',
        decision: 'A reply standard the team can actually keep.',
      },
      {
        title: 'Which enquiries deserve a quote',
        look: 'The enquiries that never became quotes, sorted: poor fit, missing information, or simply missed.',
        questions: [
          'How many were never a fit at all?',
          'What information was missing to quote?',
          'How many were good enquiries that slipped?',
        ],
        work: 'Lost-enquiry review',
        decision: 'What to fix in the follow-up, and what to fix in the marketing.',
      },
      {
        title: 'One follow-up that runs on its own',
        look: 'A WhatsApp and email sequence for the moment between enquiry and quote, written in your voice and POPIA-compliant.',
        questions: ['What does the customer need to hear next?', 'When does a person take over?', 'What stops the sequence?'],
        work: 'One quote follow-up journey',
        decision: 'The journey goes live, with an owner and a measure.',
      },
    ],
  },
  close: {
    id: 'close',
    name: 'Quotes to customers',
    headline: 'Quotes go out. Too few come back as sales.',
    summary:
      'Price usually gets the blame. More often the quote arrives late, says too little, or is never followed up. We find out which before anyone discounts.',
    plan: 'sprint',
    planName: 'Growth Sprint',
    planWhy: 'Six weeks to review lost quotes, fix the follow-up and rebuild how the quote sells.',
    chapters: [
      {
        title: 'Why quotes are lost',
        look: 'A sample of lost quotes, by price, timing, competitor and the reason given, alongside the ones you won.',
        questions: [
          'How many lost quotes heard from you after sending?',
          'Were they lost on price, on confidence or on timing?',
          'What did the winners have in common?',
        ],
        work: 'Lost-quote review',
        decision: 'Whether this is a price problem or a follow-up problem.',
      },
      {
        title: 'What the quote says',
        look: 'The quote itself, read as the customer reads it: what is included, what happens next and why you.',
        questions: [
          'Could the customer forward it to a partner and have it understood?',
          'Does it answer the questions you get on the phone?',
          'Is there a reason to decide now?',
        ],
        work: 'Quote presentation review',
        decision: 'A quote template that sells when you are not in the room.',
      },
      {
        title: 'The follow-up after the quote',
        look: 'What happens on day two, day five and day ten after a quote goes out, and who does it.',
        questions: ['Who follows up, and when?', 'What do they say that is useful?', 'When do you let it go?'],
        work: 'Quote follow-up journey',
        decision: 'A follow-up cadence with an owner and an end date.',
      },
      {
        title: 'What we measure from here',
        look: 'Win rate by source, by quote size and by time to quote, so the next decision rests on numbers.',
        questions: ['What counts as a won quote?', 'How quickly must a quote go out?', 'Who reviews losses each month?'],
        work: 'Performance dashboard',
        decision: 'The win rate the next quarter is judged on.',
      },
    ],
  },
  checkout: {
    id: 'checkout',
    name: 'Visits to customers',
    headline: 'People browse. Too few buy.',
    summary:
      'Visitors are reaching the store and leaving without buying. We look at who arrives, what the product pages promise and every step from basket to payment.',
    plan: 'sprint',
    planName: 'Growth Sprint',
    planWhy: 'Six weeks to find and fix the biggest drop between product page and payment.',
    chapters: [
      {
        title: 'Who arrives, and from where',
        look: 'Traffic and orders by source. Cheap traffic that never buys hides inside a healthy-looking visitor number.',
        questions: ['Which sources never produce an order?', 'What are you paying per order, by channel?', 'Who buys on the first visit?'],
        work: 'Channel and source review',
        decision: 'Which spend to cut and which to keep.',
      },
      {
        title: 'What the product page leaves out',
        look: 'Product pages read as a first-time buyer: sizes, delivery time and cost, returns and proof that others bought.',
        questions: ['What do customers ask before they buy?', 'Where is delivery cost first shown?', 'What makes a stranger trust you?'],
        work: 'Product page and conversion audit',
        decision: 'The three page changes worth making first.',
      },
      {
        title: 'Basket to payment',
        look: 'Every step of checkout on a phone, on mobile data, including the payment methods South Africans expect.',
        questions: ['Where do baskets get abandoned?', 'Is an account forced before payment?', 'Which payment options are missing?'],
        work: 'Checkout review',
        decision: 'What to remove from checkout, and what to add.',
      },
      {
        title: 'The basket that was left',
        look: 'Abandoned-cart and browse follow-up by email and WhatsApp, with consent handled properly under POPIA.',
        questions: ['Who gets a reminder, and when?', 'What does it say?', 'When does it stop?'],
        work: 'Abandoned-checkout journey',
        decision: 'The journey goes live, with a measure.',
      },
    ],
  },
  repeat: {
    id: 'repeat',
    name: 'Customers who buy again',
    headline: 'Customers buy once and disappear.',
    summary:
      'Every customer you have already won is cheaper to sell to than a stranger. This leak is about what happens after the first sale, and it compounds.',
    plan: 'partner',
    planName: 'Growth Partner',
    planWhy: 'Retention is ongoing work. A monthly partnership designs the programme, builds the journeys and keeps them tuned.',
    chapters: [
      {
        title: 'Who comes back, and who does not',
        look: 'Your customer list split by first purchase, product and channel, to see who returns and who never does.',
        questions: ['Which customers come back without being asked?', 'How long until a second purchase?', 'What did the one-time buyers buy?'],
        work: 'Customer segment review',
        decision: 'Which customers are worth a second sale first.',
      },
      {
        title: 'What happens after the first sale',
        look: 'Everything a customer hears from you in the 90 days after they buy, from the receipt to silence.',
        questions: ['What is the next thing they should buy?', 'When do they usually need it?', 'Who reminds them?'],
        work: 'Retention programme design',
        decision: 'The moments where a message earns a second sale.',
      },
      {
        title: 'Journeys that run on their own',
        look: 'Up to three WhatsApp and email journeys: welcome, replenish or rebook, and win-back.',
        questions: ['What does each journey ask the customer to do?', 'When does a person step in?', 'How do we know it worked?'],
        work: 'Up to three lifecycle journeys',
        decision: 'Which journeys go live, in which order.',
      },
      {
        title: 'Permission to keep talking',
        look: 'How customer contact details and consent are recorded, so direct marketing to existing customers is lawful under POPIA.',
        questions: ['Where is consent recorded?', 'Can every customer opt out easily?', 'Who owns the customer list?'],
        work: 'POPIA consent review',
        decision: 'What needs fixing before the first message goes out.',
      },
    ],
  },
  measure: {
    id: 'measure',
    name: 'Seeing the numbers',
    headline: 'The first leak is not knowing where the leak is.',
    summary:
      'Without visits, enquiries and sales you can trust, every marketing decision is a guess. The fastest win is a clear baseline, and it usually shows the real leak within two weeks.',
    plan: 'diagnostic',
    planName: 'Growth Diagnostic',
    planWhy: 'Two weeks to join your website, enquiries, quotes and sales into one picture, ending with a 90-day roadmap.',
    chapters: [
      {
        title: 'Follow the customer',
        look: 'The website, enquiry inbox, quote book and sales records joined into one monthly funnel, from first visit to repeat sale.',
        questions: ['Where does each number live today?', 'Who records an enquiry, and where?', 'Which numbers disagree with each other?'],
        work: 'Commercial and funnel diagnostic',
        decision: 'A baseline everyone agrees on.',
      },
      {
        title: 'Agree what each number means',
        look: 'One definition, one source and one owner for every number that matters.',
        questions: ['What counts as an enquiry? As a sale?', 'Where does the number come from?', 'Who is responsible for it?'],
        work: 'KPI framework and measurement dictionary',
        decision: 'The handful of numbers the business is run on.',
      },
      {
        title: 'Check the records behind the message',
        look: 'How customer details and consent are captured, stored and used, against POPIA.',
        questions: ['Where are customer details kept?', 'Is marketing consent recorded?', 'Who can see the list?'],
        work: 'POPIA consent review',
        decision: 'What to fix before any more marketing goes out.',
      },
      {
        title: 'Turn the findings into 90 days',
        look: 'The leaks ranked by what they cost and what they take to fix, sequenced with owners and decision points.',
        questions: ['Which leak costs the most?', 'Which is quickest to fix?', 'What must happen first?'],
        work: '90-day growth roadmap',
        decision: 'What to do on Monday, and what to stop.',
      },
    ],
  },
};

/* ------------------------------------------------------------------------ */
/* Formatting                                                               */
/* ------------------------------------------------------------------------ */

export const formatCount = (n: number) => Math.round(n).toLocaleString('en-US');
export const formatRand = (n: number) => `R${Math.round(n).toLocaleString('en-US')}`;
export const formatRate = (r: number) => {
  const pct = r * 100;
  return `${pct < 10 ? pct.toFixed(1).replace(/\.0$/, '') : Math.round(pct)}%`;
};
export const formatRange = (r: [number, number]) => `${formatRate(r[0])}–${formatRate(r[1])}`;

/** Round a rand value for display so it does not look more precise than it is. */
export const roundRand = (n: number) => {
  if (n >= 100000) return Math.round(n / 5000) * 5000;
  if (n >= 10000) return Math.round(n / 1000) * 1000;
  return Math.round(n / 100) * 100;
};

/** sessionStorage key the contact page reads to pre-fill the message. */
export const PLAYBOOK_SUMMARY_KEY = 'fm_playbook_summary_v1';

export interface PlaybookSummary {
  leak: LeakId;
  plan: LeakPlaybook['plan'];
  name?: string;
  email?: string;
  business?: string;
  message: string;
}

export function summaryMessage(input: PlaybookInputs, result: LeakResult): string {
  const pb = playbooks[result.leak];
  const lines = [`I used the Growth Playbook on the website. My biggest leak: ${pb.name.toLowerCase()}.`];
  result.stages.forEach((s) => {
    if (s.rate != null) lines.push(`${s.from} to ${s.to.toLowerCase()}: ${formatRate(s.rate)} (first-look range ${formatRange(s.range)})`);
  });
  if (result.monthlyValue != null && result.monthlyValue > 0) {
    lines.push(`Rough value of fixing it: ${formatRand(roundRand(result.monthlyValue))} a month.`);
  }
  if (input.avgSale != null) lines.push(`Average sale: ${formatRand(input.avgSale)}.`);
  return lines.join('\n');
}
