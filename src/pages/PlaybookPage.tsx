import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedButton } from '@/components/AnimatedButton';
import { BrokenCircle } from '@/components/BrokenCircle';
import { Section } from '@/components/layout/Section';
import { getLenis } from '@/components/motion/SmoothScroll';
import { contactConfig } from '@/config';
import { trackEvent } from '@/lib/analytics';
import {
  analyse,
  emptyInputs,
  exampleInputs,
  formatCount,
  formatRand,
  formatRange,
  formatRate,
  playbooks,
  questions,
  questionsFor,
  roundRand,
  summaryMessage,
  PLAYBOOK_SUMMARY_KEY,
  type Flow,
  type LeakResult,
  type PlaybookInputs,
  type PlaybookSummary,
  type Question,
  type QuestionKey,
  type Stage,
} from '@/data/playbook';

/*
 * The Growth Playbook. Six questions about last month, then the leak, what it
 * is worth and the chapters we would work through. The motion borrows from
 * the home page: the broken circle draws once, rules draw left to right, and
 * the leak is the one place the line breaks.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const shortLabel: Record<QuestionKey, string> = {
  visits: 'Visits',
  leads: 'Enquiries',
  quotes: 'Quotes',
  sales: 'New customers',
  avgSale: 'Average sale',
  repeat: 'Buy again',
};

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const parseNumber = (raw: string) => {
  const digits = raw.replace(/[^\d.]/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
};

const displayValue = (q: Question, v: number | null) => {
  if (v == null) return '';
  if (q.unit === 'percent') return String(v);
  return formatCount(v);
};

/** Counts a number up once it scrolls into view, keeping its formatting. */
function CountUp({ value, format, className }: { value: number; format: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const reduced = useReducedMotion();
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1400, 1);
      setT(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduced]);

  const shown = reduced ? value : value * (1 - Math.pow(1 - t, 4));

  return (
    <span ref={ref} className={className}>
      {format(shown)}
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* Hero                                                                     */
/* ------------------------------------------------------------------------ */

function Hero({ onStart, onExample }: { onStart: () => void; onExample: () => void }) {
  return (
    <section
      className={[
        'relative w-full min-h-[88svh] bg-fm-ink text-fm-paper overflow-hidden',
        '[--ring-size:min(52svh,34vw)] [--ring-top:20svh] [--ring-right:max(3rem,calc((100vw_-_80rem)/2_+_3rem))]',
        '[--ring-stroke:0.19] [--fm-stem:calc(88svh_-_var(--ring-top)_-_var(--ring-size))]',
      ].join(' ')}
    >
      <BrokenCircle
        className="absolute hidden lg:block text-fm-paper/40"
        style={{ top: 'var(--ring-top)', right: 'var(--ring-right)', width: 'var(--ring-size)', height: 'var(--ring-size)' }}
      />

      <div className="relative z-10 container-large px-6 lg:px-12 min-h-[88svh] flex flex-col justify-end lg:justify-center pt-32 pb-16 lg:pt-28 lg:pb-20">
        <p className="fm-meta text-fm-paper/55">The Growth Playbook</p>
        <h1 className="fm-display-1 mt-6 max-w-[12ch]">Find the leak in your own numbers.</h1>
        <p className="fm-lede mt-8 lg:mt-10 max-w-[36rem] text-fm-paper/70">
          Six questions about last month. We show where customers drop out, roughly what that costs you in rand, and
          the playbook we would follow to fix it. Your numbers stay in your browser.
        </p>
        <div className="mt-10 lg:mt-12 flex flex-wrap items-center gap-x-9 gap-y-5">
          <AnimatedButton onClick={onStart} variant="secondary" size="lg" className="border-fm-paper">
            Start with your numbers
          </AnimatedButton>
          <button
            type="button"
            onClick={onExample}
            className="fm-link text-base text-fm-paper/75 decoration-fm-paper/35 hover:text-fm-paper hover:decoration-fm-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fm-paper"
          >
            See it with an example business
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Questions                                                                */
/* ------------------------------------------------------------------------ */

interface StepperProps {
  inputs: PlaybookInputs;
  setInputs: (fn: (prev: PlaybookInputs) => PlaybookInputs) => void;
  current: QuestionKey;
  setCurrent: (k: QuestionKey) => void;
  onFinish: () => void;
}

function Stepper({ inputs, setInputs, current, setCurrent, onFinish }: StepperProps) {
  const reduced = useReducedMotion();
  const list = questionsFor(inputs.flow);
  const index = Math.max(0, list.findIndex((q) => q.key === current));
  const q = list[index];
  const [raw, setRaw] = useState(() => displayValue(q, inputs[q.key]));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRaw(displayValue(q, inputs[q.key]));
    // Focus without scrolling the page; the section is already in view.
    inputRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.key]);

  const commit = (value: number | null) => setInputs((prev) => ({ ...prev, [q.key]: value }));

  const advance = (flow: Flow = inputs.flow) => {
    const nextList = questionsFor(flow);
    const order = questions.map((x) => x.key);
    const next = nextList.find((x) => order.indexOf(x.key) > order.indexOf(q.key));
    if (next) setCurrent(next.key);
    else onFinish();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = parseNumber(raw);
    if (value == null) {
      inputRef.current?.focus();
      return;
    }
    commit(q.unit === 'percent' ? Math.min(100, value) : value);
    advance();
  };

  const dontKnow = () => {
    commit(null);
    advance();
  };

  const applyToggle = () => {
    if (!q.toggle) return;
    const flow = q.toggle.flow;
    setInputs((prev) => ({
      ...prev,
      flow,
      ...(flow === 'direct' ? { leads: null, quotes: null } : {}),
      ...(flow === 'enquiry' ? { quotes: null } : {}),
    }));
    advance(flow);
  };

  const back = () => {
    if (index > 0) setCurrent(list[index - 1].key);
  };

  const progress = index / list.length;

  return (
    <section id="numbers" className="w-full fm-section bg-fm-paper text-fm-ink scroll-mt-16" aria-label="Your numbers">
      <div className="container-large px-6 lg:px-12">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 border-t border-fm-ink pt-6 lg:pt-8">
          {/* Progress rail: the stem from the hero ring, filling as you go. */}
          <div className="col-span-12 lg:col-span-3">
            <p className="fm-meta text-fm-graphite lg:pt-3">Your numbers</p>
            <ol className="relative mt-8 hidden lg:block">
              <span aria-hidden="true" className="absolute left-[5px] top-2 bottom-2 w-px bg-fm-silver" />
              <motion.span
                aria-hidden="true"
                className="absolute left-[5px] top-2 w-px bg-fm-ink origin-top"
                style={{ bottom: '0.5rem' }}
                initial={false}
                animate={{ scaleY: progress }}
                transition={{ duration: reduced ? 0 : 0.6, ease: EASE }}
              />
              {list.map((item, i) => {
                const done = i < index;
                const active = i === index;
                const v = inputs[item.key];
                return (
                  <li key={item.key} className="relative pl-7 py-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute left-0 top-[1.1rem] w-[11px] h-[11px] rounded-full border transition-colors duration-500',
                        done ? 'bg-fm-ink border-fm-ink' : active ? 'bg-fm-paper border-fm-ink' : 'bg-fm-paper border-fm-silver'
                      )}
                    />
                    <button
                      type="button"
                      disabled={!done}
                      onClick={() => setCurrent(item.key)}
                      className={cn(
                        'text-left text-[0.95rem] transition-colors',
                        active ? 'text-fm-ink' : done ? 'text-fm-graphite hover:text-fm-ink' : 'text-fm-graphite/60'
                      )}
                    >
                      {shortLabel[item.key]}
                      {done && (
                        <span className="block font-mono text-xs text-fm-graphite mt-0.5">
                          {v == null ? 'Not known' : item.unit === 'rand' ? formatRand(v) : item.unit === 'percent' ? `${v}%` : formatCount(v)}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="col-span-12 lg:col-span-9 min-h-[26rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.form
                key={q.key}
                onSubmit={submit}
                initial={reduced ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -20, transition: { duration: 0.25, ease: EASE } }}
                noValidate
              >
                <p className="fm-meta text-fm-graphite">
                  Question {String(index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
                </p>
                <label htmlFor={`pb-${q.key}`} className="block fm-display-2 mt-6 max-w-[20ch]">
                  {q.question}
                </label>
                <p className="fm-body mt-5 max-w-[36rem] text-fm-graphite">{q.help}</p>

                <div className="mt-10 max-w-[36rem]">
                  <div className="flex items-baseline gap-3 border-b border-fm-ink pb-2">
                    {q.unit === 'rand' && <span className="font-mono text-[clamp(2rem,4.5vw,3.5rem)] text-fm-graphite">R</span>}
                    <input
                      ref={inputRef}
                      id={`pb-${q.key}`}
                      inputMode="numeric"
                      autoComplete="off"
                      value={raw}
                      onChange={(e) => {
                        const n = parseNumber(e.target.value);
                        setRaw(n == null ? '' : q.unit === 'percent' ? String(Math.min(100, n)) : formatCount(n));
                      }}
                      placeholder="0"
                      aria-describedby={`pb-${q.key}-suffix`}
                      className="min-w-0 flex-1 bg-transparent font-mono text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-tight text-fm-ink placeholder:text-fm-silver focus:outline-none"
                    />
                    {q.unit === 'percent' && <span className="font-mono text-[clamp(2rem,4.5vw,3.5rem)] text-fm-graphite">%</span>}
                  </div>
                  <p id={`pb-${q.key}-suffix`} className="mt-3 fm-meta text-fm-graphite">
                    {q.suffix}
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <AnimatedButton variant="primary" size="lg">
                    {index === list.length - 1 ? 'Find my leak' : 'Next'}
                  </AnimatedButton>
                  <button
                    type="button"
                    onClick={dontKnow}
                    className="fm-link text-base text-fm-graphite decoration-fm-silver hover:text-fm-ink hover:decoration-fm-ink"
                  >
                    I don’t know this one
                  </button>
                  {index > 0 && (
                    <button type="button" onClick={back} className="text-base text-fm-graphite hover:text-fm-ink">
                      Back
                    </button>
                  )}
                </div>

                {q.toggle && (
                  <button
                    type="button"
                    onClick={applyToggle}
                    className="mt-8 inline-flex items-center gap-3 text-left text-[0.95rem] text-fm-graphite hover:text-fm-ink"
                  >
                    <span aria-hidden="true" className="w-4 h-4 border border-fm-ink shrink-0" />
                    {q.toggle.label}
                  </button>
                )}
              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* The leak, drawn as one line that breaks                                  */
/* ------------------------------------------------------------------------ */

function LeakRing({ delay }: { delay: number }) {
  const reduced = useReducedMotion();
  // Same geometry as the hero ring: open at the bottom.
  const R = 47;
  const gap = 18;
  const p = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(50 + R * Math.cos(a)).toFixed(2)} ${(50 + R * Math.sin(a)).toFixed(2)}`;
  };
  const d = `M ${p(90 + gap / 2)} A ${R} ${R} 0 1 1 ${p(90 - gap / 2)}`;
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true" fill="none">
      <motion.path
        d={d}
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 1.1, delay, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}

function Segment({ stage, isLeak, order }: { stage: Stage; isLeak: boolean; order: number }) {
  const reduced = useReducedMotion();
  const delay = reduced ? 0 : 0.25 + order * 0.35;
  const line = (horizontal: boolean, className?: string) => (
    <motion.span
      aria-hidden="true"
      className={cn('block bg-fm-ink', horizontal ? 'h-px w-full origin-left' : 'w-px h-full origin-top', className)}
      initial={reduced ? false : horizontal ? { scaleX: 0 } : { scaleY: 0 }}
      whileInView={horizontal ? { scaleX: 1 } : { scaleY: 1 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    />
  );

  const rate = stage.rate != null ? formatRate(stage.rate) : '?';
  const rateEl = (
    <span className={cn('font-mono tabular-nums', isLeak ? 'text-fm-ink text-lg' : 'text-fm-graphite text-base')}>{rate}</span>
  );

  return (
    <div className="relative flex-1 min-w-0 md:min-w-[5.5rem]">
      {/* Desktop: horizontal, on the same centre line as the figures. The
          leak segment breaks and a ring draws around its rate. */}
      <div className="hidden md:block">
        <div className="relative h-14 flex items-center">
          {isLeak ? (
            <>
              <span className="absolute left-0 right-[calc(50%+3rem)] top-1/2">{line(true)}</span>
              <span className="absolute right-0 left-[calc(50%+3rem)] top-1/2">{line(true)}</span>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 grid place-items-center text-fm-ink">
                <LeakRing delay={delay + 0.4} />
                {rateEl}
              </span>
            </>
          ) : (
            <>
              <span className="absolute inset-x-0 top-1/2">{line(true)}</span>
              <span className="absolute left-1/2 -translate-x-1/2 top-0">{rateEl}</span>
            </>
          )}
        </div>
        <p className={cn('text-center fm-meta text-fm-graphite', isLeak ? 'mt-9' : 'mt-3')}>
          {formatRange(stage.range)}
          {stage.status === 'below' && <span className="block mt-1 text-fm-ink">Below range</span>}
        </p>
      </div>

      {/* Phone: vertical, rate to the right of the line. */}
      <div className="md:hidden flex items-stretch gap-5 h-24 pl-[1.1rem]">
        <div className="relative w-px">{line(false)}</div>
        <div className="self-center flex items-center gap-4">
          {isLeak ? (
            <span className="relative w-20 h-20 grid place-items-center text-fm-ink">
              <LeakRing delay={delay + 0.3} />
              {rateEl}
            </span>
          ) : (
            rateEl
          )}
          <span className="fm-meta text-fm-graphite">
            {formatRange(stage.range)}
            {stage.status === 'below' && <span className="block mt-1 text-fm-ink">Below range</span>}
          </span>
        </div>
      </div>
    </div>
  );
}

function Node({ label, count }: { label: string; count: number | null }) {
  return (
    <div className="shrink-0 flex md:block items-baseline gap-4 md:text-center md:px-3">
      <span className="md:h-14 md:flex md:items-center md:justify-center font-mono text-[clamp(1.75rem,2.4vw,2.5rem)] leading-none tracking-tight tabular-nums text-fm-ink">
        {count == null ? '?' : <CountUp value={count} format={formatCount} />}
      </span>
      <span className="block fm-meta text-fm-graphite md:mt-3 whitespace-nowrap">{label}</span>
    </div>
  );
}

function LeakLine({ result }: { result: LeakResult }) {
  const funnel = result.stages.filter((s) => s.leak !== 'repeat');
  const repeat = result.stages.find((s) => s.leak === 'repeat');
  const parts: ReactNode[] = [];
  result.steps.forEach((step, i) => {
    parts.push(<Node key={`n-${step.label}`} label={step.label} count={step.count} />);
    const seg = funnel[i];
    if (seg) parts.push(<Segment key={`s-${seg.leak}`} stage={seg} isLeak={result.stage === seg} order={i} />);
  });
  if (repeat) {
    parts.push(<Segment key="s-repeat" stage={repeat} isLeak={result.stage === repeat} order={funnel.length} />);
    parts.push(<Node key="n-repeat" label="Buy again" count={repeat.toCount} />);
  }
  return (
    <figure>
      <div className="flex flex-col md:flex-row md:items-start">{parts}</div>
      <figcaption className="mt-8 text-sm text-fm-graphite max-w-[40rem]">
        Monthly figures you entered, with each step’s conversion rate. First-look ranges are our working assumptions
        for deciding where to look first. They are broad and they are not benchmarks for your sector.
      </figcaption>
    </figure>
  );
}

function Results({ inputs, result, onEdit }: { inputs: PlaybookInputs; result: LeakResult; onEdit: () => void }) {
  const pb = playbooks[result.leak];
  const heading = result.headroomOnly ? `Your most room to grow: ${pb.name.toLowerCase()}.` : pb.headline;
  const label = result.leak === 'measure' ? 'Your first leak' : result.headroomOnly ? 'Most headroom' : 'Your biggest leak';

  return (
    <Section id="your-leak" tone="white" label={label} heading={heading} intro={<p>{pb.summary}</p>} wide className="scroll-mt-16">
      <LeakLine result={result} />

      {result.warnings.map((w) => (
        <p key={w} className="mt-6 fm-body text-fm-ink border-l-2 border-fm-ink pl-4 max-w-[40rem]">
          {w}
        </p>
      ))}

      <div className="mt-16 lg:mt-20 grid grid-cols-12 gap-x-6 gap-y-6 border-t border-fm-silver pt-8">
        <p className="col-span-12 lg:col-span-3 fm-meta text-fm-graphite lg:pt-3">What it is worth</p>
        <div className="col-span-12 lg:col-span-9">
          {result.monthlyValue != null && result.monthlyValue > 0 && result.stage && result.target != null ? (
            <>
              <p className="font-mono text-[clamp(2.75rem,6.5vw,5.5rem)] leading-none tracking-tight text-fm-ink">
                <CountUp value={roundRand(result.monthlyValue)} format={(n) => formatRand(roundRand(n))} />
                <span className="text-fm-graphite text-[0.4em] ml-3 tracking-normal">a month</span>
              </p>
              <p className="fm-body mt-6 max-w-[40rem] text-fm-graphite">
                A rough figure, not a forecast. If {result.stage.from.toLowerCase()} to {result.stage.to.toLowerCase()} reached{' '}
                {formatRate(result.target)}, {result.headroomOnly ? 'the top' : 'the low end'} of the first-look range, with
                everything else unchanged, you would gain about {Math.round(result.extraCustomers ?? 0)} more{' '}
                {result.stage.leak === 'repeat' ? 'repeat sales' : 'customers'} a month at your average sale of{' '}
                {formatRand(inputs.avgSale ?? 0)}.
              </p>
            </>
          ) : (
            <p className="fm-lede max-w-[40rem] text-fm-ink">
              {result.leak === 'measure'
                ? `You didn’t know ${result.unknownCount} of the numbers. That is not a failing, it is the first leak: without them every marketing decision is a guess.`
                : result.extraCustomers != null && result.extraCustomers <= 0
                  ? 'Your figures already sit at or above the first-look ranges. The next gains will come from detail the six numbers cannot show.'
                  : 'Your figures do not support a reliable rand value yet. Check the numbers flagged above first.'}
            </p>
          )}
          <button
            type="button"
            onClick={onEdit}
            className="fm-link mt-8 text-base text-fm-graphite decoration-fm-silver hover:text-fm-ink hover:decoration-fm-ink"
          >
            Change my numbers
          </button>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------ */
/* The playbook for the leak                                                */
/* ------------------------------------------------------------------------ */

function Chapters({ result }: { result: LeakResult }) {
  const pb = playbooks[result.leak];
  const reduced = useReducedMotion();
  return (
    <Section
      id="your-playbook"
      tone="paper"
      label="Your playbook"
      heading="Where we would look first."
      intro={<p>Four chapters, in the order we would work through them for this leak. Each one ends in a decision you can act on.</p>}
    >
      <ol className="border-t border-fm-ink">
        {pb.chapters.map((c, i) => (
          <motion.li
            key={c.title}
            className="grid grid-cols-9 gap-x-6 gap-y-5 py-10 lg:py-12 border-b border-fm-silver"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="col-span-9 md:col-span-4">
              <span className="fm-meta text-fm-graphite">Chapter {String(i + 1).padStart(2, '0')}</span>
              <h3 className="fm-display-3 mt-4 text-fm-ink">{c.title}</h3>
              <p className="fm-body mt-4 text-fm-graphite">{c.look}</p>
            </div>
            <div className="col-span-9 md:col-span-5">
              <p className="fm-meta text-fm-graphite">Questions we ask</p>
              <ul className="mt-3">
                {c.questions.map((q) => (
                  <li key={q} className="py-3 border-b border-fm-mist fm-body text-fm-ink">
                    {q}
                  </li>
                ))}
              </ul>
              <dl className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <dt className="fm-meta text-fm-graphite">The work</dt>
                  <dd className="mt-2 fm-body text-fm-ink">{c.work}</dd>
                </div>
                <div>
                  <dt className="fm-meta text-fm-graphite">The decision</dt>
                  <dd className="mt-2 fm-body text-fm-ink">{c.decision}</dd>
                </div>
              </dl>
            </div>
          </motion.li>
        ))}
      </ol>

      <div className="mt-14 grid grid-cols-9 gap-x-6 gap-y-6">
        <div className="col-span-9 md:col-span-4">
          <p className="fm-meta text-fm-graphite">Where to start</p>
          <p className="fm-display-3 mt-4 text-fm-ink">{pb.planName}</p>
        </div>
        <div className="col-span-9 md:col-span-5">
          <p className="fm-body text-fm-graphite">{pb.planWhy}</p>
          <Link
            to="/pricing"
            className="fm-link inline-block mt-5 text-base text-fm-ink decoration-fm-silver hover:decoration-fm-ink"
          >
            Compare all four engagements
          </Link>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------ */
/* The emailed report                                                       */
/* ------------------------------------------------------------------------ */

const REPORT_CONSENT =
  'Send my numbers to FM Consulting with this request, and let FM Consulting contact me about my report.';
const NEWSLETTER_CONSENT = 'Also send me new FM Consulting insights by email. I can unsubscribe at any time.';

function Report({ inputs, result }: { inputs: PlaybookInputs; result: LeakResult }) {
  const pb = playbooks[result.leak];
  const [form, setForm] = useState({ name: '', email: '', business: '', consent: false, newsletter: false });
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const field =
    'w-full h-14 px-4 bg-transparent border border-fm-paper/30 text-fm-paper placeholder:text-fm-paper/40 focus:outline-none focus:border-fm-paper transition-colors';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      setError('Add your name and a valid email address.');
      return;
    }
    if (!form.consent) {
      setError('Tick the box so we can send your numbers with the request.');
      return;
    }
    setError('');
    setStatus('working');

    const message = summaryMessage(inputs, result);
    const summary: PlaybookSummary = {
      leak: result.leak,
      plan: pb.plan,
      name: form.name.trim(),
      email: form.email.trim(),
      business: form.business.trim() || undefined,
      message,
    };
    try {
      sessionStorage.setItem(PLAYBOOK_SUMMARY_KEY, JSON.stringify(summary));
    } catch {
      /* storage unavailable: the contact form simply won't be pre-filled */
    }

    // Send the request. The report downloads whether or not this succeeds.
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: contactConfig.web3formsKey,
          subject: `Leak report request — ${form.business.trim() || form.name.trim()}`,
          from_name: 'FM Consulting Growth Playbook',
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.business.trim(),
          leak: pb.name,
          recommended: pb.planName,
          message,
          consent_wording: REPORT_CONSENT,
          newsletter: form.newsletter ? `Yes: ${NEWSLETTER_CONSENT}` : 'No',
          consent_given_at: new Date().toISOString(),
          consent_page: window.location.href,
          privacy_policy: 'https://www.fmconsultingza.co.za/privacy',
        }),
      });
      trackEvent('generate_lead', { lead_source: 'playbook', leak: result.leak, plan: pb.plan });
    } catch {
      trackEvent('playbook_report_error', { reason: 'network' });
    }

    try {
      const { downloadLeakReport } = await import('@/lib/leakReport');
      await downloadLeakReport(inputs, result, { name: form.name.trim(), business: form.business.trim() || undefined });
      trackEvent('playbook_report', { leak: result.leak });
      setStatus('done');
    } catch {
      setStatus('error');
      setError('The report could not be built in this browser. We have your request and will email it to you.');
    }
  };

  return (
    <Section
      id="your-report"
      tone="ink"
      label="Your report"
      heading="Take the leak report with you."
      intro={
        <p>
          One page with your numbers, the leak and the questions we would ask first. Until now your numbers have stayed
          in this browser. When you ask for the report, we receive them with your details so we can talk them through
          with you.
        </p>
      }
      className="pb-0 lg:pb-0"
      compact
    >
      {status === 'done' ? (
        <div role="status">
          <p className="fm-lede text-fm-paper">Your report has downloaded. We will be in touch within 24 hours.</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-9 gap-y-5">
            <AnimatedButton
              to={`/contact?plan=${pb.plan}&from=playbook`}
              variant="secondary"
              size="lg"
              className="border-fm-paper"
            >
              Book a call about it
            </AnimatedButton>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="max-w-[40rem]">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm text-fm-paper/70 mb-2">Your name</span>
              <input
                className={field}
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="block text-sm text-fm-paper/70 mb-2">Email address</span>
              <input
                className={field}
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="block text-sm text-fm-paper/70 mb-2">Business name (optional)</span>
              <input
                className={field}
                autoComplete="organization"
                value={form.business}
                onChange={(e) => setForm({ ...form, business: e.target.value })}
              />
            </label>
          </div>

          <label className="mt-6 flex gap-3 items-start text-sm leading-relaxed text-fm-paper/80 cursor-pointer">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => setForm({ ...form, consent: e.target.checked })}
              className="mt-1 w-4 h-4 accent-fm-paper shrink-0"
            />
            <span>
              {REPORT_CONSENT} See our{' '}
              <Link to="/privacy" className="fm-link decoration-fm-paper/40 hover:decoration-fm-paper">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          <label className="mt-3 flex gap-3 items-start text-sm leading-relaxed text-fm-paper/60 cursor-pointer">
            <input
              type="checkbox"
              checked={form.newsletter}
              onChange={(e) => setForm({ ...form, newsletter: e.target.checked })}
              className="mt-1 w-4 h-4 accent-fm-paper shrink-0"
            />
            <span>{NEWSLETTER_CONSENT}</span>
          </label>

          {error && (
            <p className="mt-5 text-sm text-fm-paper" role="alert">
              {error}
            </p>
          )}

          <div className="mt-8">
            <AnimatedButton variant="secondary" size="lg" className="border-fm-paper">
              {status === 'working' ? 'Building your report…' : 'Download my report'}
            </AnimatedButton>
          </div>
        </form>
      )}
    </Section>
  );
}

/* ------------------------------------------------------------------------ */
/* Page                                                                     */
/* ------------------------------------------------------------------------ */

export function PlaybookPage() {
  const [inputs, setInputs] = useState<PlaybookInputs>(emptyInputs);
  const [current, setCurrent] = useState<QuestionKey>('visits');
  const [phase, setPhase] = useState<'intro' | 'asking' | 'done'>('intro');
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);
  const result = useMemo(() => (phase === 'done' ? analyse(inputs) : null), [phase, inputs]);

  // Scroll after the target section has rendered.
  useEffect(() => {
    if (!pendingScroll) return;
    const t = window.setTimeout(() => {
      scrollToId(pendingScroll);
      setPendingScroll(null);
    }, 60);
    return () => window.clearTimeout(t);
  }, [pendingScroll, phase]);

  const start = () => {
    if (phase === 'intro') trackEvent('playbook_start');
    setPhase((p) => (p === 'done' ? 'done' : 'asking'));
    setPendingScroll('numbers');
  };

  const example = () => {
    trackEvent('playbook_example');
    setInputs(exampleInputs);
    setPhase('done');
    setPendingScroll('your-leak');
  };

  const finish = () => {
    setPhase('done');
    setPendingScroll('your-leak');
  };

  useEffect(() => {
    if (phase === 'done' && result) trackEvent('playbook_complete', { leak: result.leak, flow: inputs.flow });
    // Only when a result first appears or changes leak.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, result?.leak]);

  const edit = () => {
    setInputs((prev) => ({ ...prev, flow: 'quote' }));
    setCurrent('visits');
    setPhase('asking');
    setPendingScroll('numbers');
  };

  return (
    <div className="w-full">
      <Hero onStart={start} onExample={example} />
      {phase !== 'intro' && (
        <>
          {phase === 'asking' && (
            <Stepper inputs={inputs} setInputs={setInputs} current={current} setCurrent={setCurrent} onFinish={finish} />
          )}
          {phase === 'done' && result && (
            <>
              <Results inputs={inputs} result={result} onEdit={edit} />
              <Chapters result={result} />
              <Report inputs={inputs} result={result} />
            </>
          )}
        </>
      )}
      {phase === 'intro' && <HowItWorks onStart={start} />}
    </div>
  );
}

/** Shown before the visitor starts: what happens, in three steps. */
function HowItWorks({ onStart }: { onStart: () => void }) {
  const steps = [
    { title: 'Six numbers', text: 'Visits, enquiries, quotes, new customers, average sale and how many buy again. Rough figures are fine.' },
    { title: 'One leak', text: 'We find the step where the most is falling out, and put a rough rand figure on fixing it.' },
    { title: 'Your playbook', text: 'The four chapters we would work through for that leak, each ending in a decision.' },
  ];
  return (
    <Section
      tone="paper"
      label="How it works"
      heading="Three minutes, no sign-up."
      intro={<p>Nothing is sent anywhere unless you ask for the report at the end.</p>}
      wide
    >
      <ol className="grid md:grid-cols-3 gap-x-6 gap-y-10">
        {steps.map((s, i) => (
          <li key={s.title} className="border-t border-fm-ink pt-5">
            <span className="fm-meta text-fm-graphite" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="fm-display-3 mt-8 text-fm-ink">{s.title}</h3>
            <p className="fm-body mt-4 text-fm-graphite">{s.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-12">
        <AnimatedButton onClick={onStart} variant="primary" size="lg">
          Start with your numbers
        </AnimatedButton>
      </div>
    </Section>
  );
}
