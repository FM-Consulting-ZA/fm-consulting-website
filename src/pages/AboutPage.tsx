import { aboutConfig } from '@/config';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { CTA } from '@/sections/CTA';

const values = [
  {
    title: 'Growth should be measured',
    description: 'What gets measured gets managed. Every strategy we develop includes clear KPIs and a way to measure them.',
  },
  {
    title: 'Strategy must serve commercial reality',
    description: "A strategy that looks good on paper but doesn't drive revenue is worthless. We build practical, executable plans that pay back.",
  },
  {
    title: 'Acquisition and retention work together',
    description: 'Sustainable growth needs both. We build systems that attract customers and keep them coming back.',
  },
  {
    title: 'Performance matters more than noise',
    description: "Revenue, margin and lifetime value come before vanity metrics that don't translate into business results.",
  },
];

const beliefs = [
  'Marketing should be accountable to business outcomes',
  'Data without insight is just numbers',
  'Strategy without execution is just theory',
  'Growth without efficiency is unsustainable',
  'Customer understanding drives competitive advantage',
];

const asSentence = (label: string) => {
  const flat = label.replace(/\s*\n\s*/g, ' ').trim().toLowerCase();
  return flat.charAt(0).toUpperCase() + flat.slice(1);
};

export function AboutPage() {
  const stats = [
    { value: aboutConfig.experienceValue, label: aboutConfig.experienceLabel },
    ...aboutConfig.stats,
  ].filter((s) => s.value);

  return (
    <div className="w-full">
      <PageHeader
        label="About"
        title="We help South African businesses grow on purpose."
        intro="FM Consulting works with ambitious companies to improve acquisition, retention, efficiency and commercial outcomes through strategy, analytics and performance-led execution."
      />

      <Section
        tone="white"
        label="Who we are"
        heading="Marketing held to commercial outcomes."
        intro={
          <div className="space-y-5">
            <p>
              FM Consulting is a South African business growth consultancy founded on a simple belief: marketing and
              strategy should be held accountable to commercial outcomes.
            </p>
            <p>
              We work at the intersection of growth strategy, digital marketing, performance media and analytics,
              combining strategic thinking with practical execution.
            </p>
            <p>
              Our clients are mostly SMEs, founder-led businesses, hospitality brands, professional services firms and
              B2B companies ready for a more disciplined, data-informed approach to growth.
            </p>
          </div>
        }
      >
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 border-t border-fm-silver pt-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse justify-end">
              <dt className="mt-3 text-[0.95rem] leading-snug text-fm-graphite">{asSentence(stat.label)}</dt>
              <dd className="fm-figure text-fm-ink">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="paper" label="Principles" heading="What we believe.">
        <ul className="grid md:grid-cols-2 gap-x-6 gap-y-12">
          {values.map((value) => (
            <li key={value.title} className="border-t border-fm-ink pt-6">
              <h3 className="fm-display-3 text-fm-ink">{value.title}</h3>
              <p className="fm-body mt-4 text-fm-graphite max-w-[28rem]">{value.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        tone="white"
        label="Difference"
        heading="Operators, not presenters."
        intro={
          <p>
            In a market full of agencies promising the world and consultants delivering slide decks, we work as
            operators who know results matter more than reports.
          </p>
        }
      >
        <ul className="border-t border-fm-ink">
          {beliefs.map((belief) => (
            <li key={belief} className="fm-display-3 text-fm-ink py-5 lg:py-6 border-b border-fm-silver">
              {belief}
            </li>
          ))}
        </ul>
      </Section>

      <CTA />
    </div>
  );
}
