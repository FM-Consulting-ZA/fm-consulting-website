import { useEffect, useRef, useState, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedButton } from '@/components/AnimatedButton';
import { Reveal } from '@/components/motion/Reveal';
import { pricingConfig, type CellValue, type PricingPlan } from '@/data/pricing';

/*
 * Pricing page modelled on the Shopify plan comparison pattern:
 * four plan cards sit directly above a comparison table that shares their
 * column grid. As the cards scroll up under the navigation they fade out and
 * a condensed header (plan, price, action) slides in and pins to the top of
 * the table until the table ends. Scroll-linked, so it tracks the wheel 1:1.
 */

// Column geometry shared by the cards, the sticky bar and the table so every
// edge lines up. Label column, then four equal plan columns.
const LABEL_COL = '26%';
const GRID = 'grid grid-cols-[26%_repeat(4,minmax(0,1fr))]';

const BAR_HEIGHT = 76; // condensed header height, px
const MORPH_DISTANCE = 160; // px of scroll over which cards hand over to the bar

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

function contactHref(plan: PricingPlan) {
  return `/contact?plan=${plan.id}`;
}

/** Live height of the fixed site navigation, so the bar pins just below it. */
function useNavHeight() {
  const [height, setHeight] = useState(72);
  useEffect(() => {
    const nav = document.querySelector('nav');
    if (!nav) return;
    const update = () => setHeight(Math.round(nav.getBoundingClientRect().height));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);
  return height;
}

/**
 * 0 → 1 as the bottom of the plan cards travels from MORPH_DISTANCE below the
 * nav to the nav itself, and 0 → 1 again ("exit") as the table runs out.
 */
function useCompareProgress(
  cardsRef: RefObject<HTMLElement | null>,
  tableRef: RefObject<HTMLElement | null>,
  navHeight: number
) {
  const enter = useMotionValue(0);
  const exit = useMotionValue(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const cards = cardsRef.current?.getBoundingClientRect();
      const table = tableRef.current?.getBoundingClientRect();
      if (cards) {
        enter.set(clamp((navHeight + MORPH_DISTANCE - cards.bottom) / MORPH_DISTANCE));
      }
      if (table) {
        exit.set(clamp((navHeight + BAR_HEIGHT + 96 - table.bottom) / 96));
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [cardsRef, tableRef, navHeight, enter, exit]);

  return { enter, exit };
}

function Cell({ value, compact = false }: { value: CellValue; compact?: boolean }) {
  if (value === true) {
    return (
      <>
        <Check aria-hidden className={cn('w-[18px] h-[18px] text-fm-ink', !compact && 'mx-auto')} strokeWidth={1.75} />
        <span className="sr-only">Included</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <span aria-hidden className={cn('block w-3 h-px bg-fm-silver', !compact && 'mx-auto')} />
        <span className="sr-only">Not included</span>
      </>
    );
  }
  return <span className="font-mono text-[13px] leading-snug text-fm-ink">{value}</span>;
}

function PlanCard({ plan, className }: { plan: PricingPlan; className?: string }) {
  return (
    <div
      className={cn(
        'h-full flex flex-col px-5 lg:px-4 xl:px-6 pt-6 pb-8 border-t',
        plan.featured ? 'border-t-2 border-fm-ink bg-fm-paper' : 'border-fm-silver',
        className
      )}
    >
      <div className="h-5">
        {plan.badge && (
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fm-ink">{plan.badge}</span>
        )}
      </div>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-fm-ink">
        <span className="hidden lg:inline xl:hidden">{plan.shortName}</span>
        <span className="lg:hidden xl:inline">{plan.name}</span>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-fm-graphite lg:min-h-[2.75rem]">{plan.tagline}</p>

      <div className="mt-6 lg:mt-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fm-graphite">{plan.pricePrefix}</span>
        <div className="mt-1 flex items-baseline gap-2 flex-wrap">
          <span className="font-mono text-[2rem] leading-none tracking-tight text-fm-ink">{plan.price}</span>
          <span className="text-sm text-fm-graphite">{plan.priceSuffix}</span>
        </div>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-fm-graphite">{plan.priceNote}</p>
      </div>

      <div className="mt-auto pt-6 lg:pt-8">
        <AnimatedButton
          to={contactHref(plan)}
          variant={plan.featured ? 'primary' : 'outline'}
          size="sm"
          showIcon
          className="w-full whitespace-nowrap lg:px-3 xl:px-4 lg:[&_svg]:hidden xl:[&_svg]:block"
        >
          {plan.ctaLabel}
        </AnimatedButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Desktop: cards + morphing sticky header + full comparison table           */
/* ------------------------------------------------------------------------ */

function DesktopCompare() {
  const { plans, categories, compareHeading, compareIntro } = pricingConfig;
  const reduced = useReducedMotion();
  const navHeight = useNavHeight();
  const cardsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const { enter, exit } = useCompareProgress(cardsRef, tableRef, navHeight);

  const barOpacity = useTransform([enter, exit], ([a, b]: number[]) => a * (1 - b));
  const barY = useTransform(enter, [0, 1], [reduced ? 0 : -10, 0]);
  const cardsOpacity = useTransform(enter, [0, 1], [1, reduced ? 1 : 0.15]);
  const cardsY = useTransform(enter, [0, 1], [0, reduced ? 0 : -12]);

  const [barActive, setBarActive] = useState(false);
  useMotionValueEvent(barOpacity, 'change', (v) => setBarActive(v > 0.6));

  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(categories.map((c) => [c.title, true]))
  );

  return (
    <div className="hidden lg:block">
      {/* Plan cards: same grid as the table below */}
      <div ref={cardsRef} className={GRID}>
        <div className="pr-8 pb-8 flex flex-col justify-end">
          <h2 className="text-3xl font-semibold tracking-tight text-fm-ink">{compareHeading}</h2>
          <p className="mt-3 text-sm leading-relaxed text-fm-graphite max-w-[16rem]">{compareIntro}</p>
        </div>
        {plans.map((plan, i) => (
          <motion.div key={plan.id} style={{ opacity: cardsOpacity, y: cardsY }}>
            <Reveal delay={0.08 * i} y={20} className="h-full">
              <PlanCard plan={plan} />
            </Reveal>
          </motion.div>
        ))}
      </div>

      {/* Table, with the condensed header pinned inside it */}
      <div ref={tableRef} className="relative">
        <div className="sticky z-30 h-0" style={{ top: navHeight }}>
          <motion.div
            aria-hidden={!barActive}
            style={{ opacity: barOpacity, y: barY, height: BAR_HEIGHT }}
            className={cn(
              'absolute inset-x-0 top-0 bg-white/95 backdrop-blur-md border-b border-fm-ink',
              GRID,
              barActive ? 'pointer-events-auto' : 'pointer-events-none'
            )}
          >
            <div className="flex items-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-fm-graphite">{compareHeading}</span>
            </div>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  'flex items-center justify-between gap-3 px-5 xl:px-6',
                  plan.featured && 'bg-fm-paper'
                )}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-fm-ink truncate">
                    <span className="xl:hidden">{plan.shortName}</span>
                    <span className="hidden xl:inline">{plan.name}</span>
                  </p>
                  <p className="mt-1 font-mono text-[12px] text-fm-graphite whitespace-nowrap">
                    {plan.price} <span className="hidden xl:inline text-fm-graphite/80">{plan.priceSuffix}</span>
                  </p>
                </div>
                <Link
                  to={contactHref(plan)}
                  tabIndex={barActive ? 0 : -1}
                  aria-label={`${plan.ctaLabel}: ${plan.name}`}
                  className={cn(
                    'shrink-0 w-9 h-9 flex items-center justify-center border transition-colors duration-300',
                    plan.featured
                      ? 'bg-fm-ink border-fm-ink text-white hover:bg-white hover:text-fm-ink'
                      : 'border-fm-ink/30 text-fm-ink hover:border-fm-ink hover:bg-fm-ink hover:text-white',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fm-ink'
                  )}
                >
                  <ArrowUpRight className="w-4 h-4" strokeWidth={1.75} />
                </Link>
              </div>
            ))}
          </motion.div>
        </div>

        <table className="w-full table-fixed border-collapse" aria-label="Plan comparison">
          <colgroup>
            <col style={{ width: LABEL_COL }} />
            {plans.map((p) => (
              <col key={p.id} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th className="p-0 h-0">
                <span className="sr-only">Feature</span>
              </th>
              {plans.map((p) => (
                <th key={p.id} scope="col" className={cn('p-0 h-0', p.featured && 'bg-fm-paper')}>
                  <span className="sr-only">{p.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          {categories.map((cat, catIndex) => {
            const isOpen = open[cat.title];
            const id = `cat-${cat.title.toLowerCase().replace(/[^a-z]+/g, '-')}`;
            return (
              <tbody key={cat.title}>
                <tr className="border-b border-fm-ink">
                  <th scope="colgroup" className="text-left p-0">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={cat.rows.map((_, r) => `${id}-${r}`).join(' ')}
                      onClick={() => setOpen((o) => ({ ...o, [cat.title]: !o[cat.title] }))}
                      className={cn(
                        'group w-full flex items-center justify-between gap-4 pb-4 pr-6',
                        // First header leaves room for the condensed bar to land on empty space.
                        catIndex === 0 ? 'pt-24' : 'pt-14',
                        'text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fm-ink'
                      )}
                    >
                      <span className="text-lg font-semibold tracking-tight text-fm-ink">{cat.title}</span>
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          'w-4 h-4 text-fm-graphite transition-transform duration-300 group-hover:text-fm-ink',
                          !isOpen && '-rotate-90'
                        )}
                        strokeWidth={1.75}
                      />
                    </button>
                  </th>
                  {plans.map((p) => (
                    <td key={p.id} className={cn(p.featured && 'bg-fm-paper')} />
                  ))}
                </tr>
                {cat.rows.map((row, r) => (
                  <tr
                    key={row.label}
                    id={`${id}-${r}`}
                    hidden={!isOpen}
                    className="border-b border-fm-mist transition-colors duration-200 hover:bg-fm-paper/50"
                  >
                    <th scope="row" className="text-left font-normal text-[15px] leading-snug text-fm-ink py-4 pr-6">
                      {row.label}
                    </th>
                    {row.values.map((v, i) => (
                      <td
                        key={plans[i].id}
                        className={cn('px-5 xl:px-6 py-4 text-center align-middle', plans[i].featured && 'bg-fm-paper')}
                      >
                        <Cell value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Mobile: stacked cards, then a sticky plan switcher over a two-column table */
/* ------------------------------------------------------------------------ */

function MobileCompare() {
  const { plans, categories, compareHeading, compareIntro } = pricingConfig;
  const navHeight = useNavHeight();
  const [active, setActive] = useState(() => Math.max(0, plans.findIndex((p) => p.featured)));
  const plan = plans[active];

  return (
    <div className="lg:hidden">
      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-6">
        {plans.map((p, i) => (
          <Reveal key={p.id} delay={0.05 * i} y={16}>
            <PlanCard plan={p} />
          </Reveal>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="text-3xl font-semibold tracking-tight text-fm-ink">{compareHeading}</h2>
        <p className="mt-3 text-sm leading-relaxed text-fm-graphite">{compareIntro}</p>
      </div>

      <div className="relative mt-8">
        <div className="sticky z-30 -mx-6 px-6 bg-white/95 backdrop-blur-md border-b border-fm-ink" style={{ top: navHeight }}>
          <div role="tablist" aria-label="Choose a plan to compare" className="grid grid-cols-4 gap-1 pt-3">
            {plans.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls="mobile-compare-table"
                onClick={() => setActive(i)}
                className={cn(
                  'py-2 px-1 text-[11px] leading-tight font-medium border transition-colors duration-200',
                  i === active ? 'bg-fm-ink text-white border-fm-ink' : 'bg-white text-fm-ink border-fm-silver'
                )}
              >
                {p.shortName}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <p className="font-mono text-[12px] text-fm-graphite">
              {plan.pricePrefix} <span className="text-fm-ink">{plan.price}</span> {plan.priceSuffix}
            </p>
            <Link
              to={contactHref(plan)}
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-fm-ink inline-flex items-center gap-1 underline underline-offset-4"
            >
              {plan.ctaLabel}
              <ArrowUpRight aria-hidden className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <table
          id="mobile-compare-table"
          role="tabpanel"
          aria-label={`${plan.name} inclusions`}
          className="w-full table-fixed border-collapse"
        >
          <colgroup>
            <col style={{ width: '62%' }} />
            <col />
          </colgroup>
          {categories.map((cat) => (
            <tbody key={cat.title}>
              <tr className="border-b border-fm-ink">
                <th colSpan={2} scope="colgroup" className="text-left pt-10 pb-3 text-base font-semibold text-fm-ink">
                  {cat.title}
                </th>
              </tr>
              {cat.rows.map((row) => (
                <tr key={row.label} className="border-b border-fm-mist">
                  <th scope="row" className="text-left font-normal text-sm leading-snug text-fm-ink py-3.5 pr-4">
                    {row.label}
                  </th>
                  <td className="py-3.5 text-right">
                    <span className="inline-flex justify-end">
                      <Cell value={row.values[active]} compact />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}

export function PricingPage() {
  const { label, heading, intro, footnotes } = pricingConfig;

  return (
    <div className="w-full pt-24 lg:pt-32 bg-white">
      <section className="w-full pb-16 lg:pb-20">
        <div className="container-large px-6 lg:px-12">
          <Reveal y={16}>
            <span className="text-xs font-geist-mono uppercase tracking-widest text-exvia-black/50">{label}</span>
          </Reveal>
          <Reveal delay={0.08} y={20}>
            <h1 className="mt-6 max-w-4xl text-4xl lg:text-6xl font-semibold leading-tight tracking-tight text-fm-ink">
              {heading}
            </h1>
          </Reveal>
          <Reveal delay={0.16} y={20}>
            <p className="mt-6 max-w-2xl text-lg lg:text-xl leading-relaxed text-fm-graphite">{intro}</p>
          </Reveal>
        </div>
      </section>

      <section className="w-full pb-24 lg:pb-32">
        <div className="container-large px-6 lg:px-12">
          <DesktopCompare />
          <MobileCompare />

          <div className="mt-12 grid lg:grid-cols-[26%_1fr] gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-fm-graphite">Notes</span>
            <ul className="space-y-2 text-sm leading-relaxed text-fm-graphite">
              {footnotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="w-full bg-fm-ink text-white">
        <div className="container-large px-6 lg:px-12 py-20 lg:py-28 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight leading-tight">Not sure which fits?</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Book a 30-minute call. We will look at where growth is stuck and tell you which engagement makes sense,
              including when none of them do.
            </p>
          </div>
          <AnimatedButton to="/contact" variant="outline-white" size="lg" showIcon>
            Book a call
          </AnimatedButton>
        </div>
      </section>
    </div>
  );
}
