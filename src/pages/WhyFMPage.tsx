import { whyFMConfig } from '@/config';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { CTA } from '@/sections/CTA';

// Client testimonials are not shown until real, attributable quotes exist
// (same rule as the home page).

const comparison = [
  { aspect: 'Strategic depth', agency: 'Limited', consultancy: 'Extensive', fm: 'Deep and practical' },
  { aspect: 'Execution support', agency: 'Yes', consultancy: 'Minimal', fm: 'Full support' },
  { aspect: 'Commercial focus', agency: 'Activity-based', consultancy: 'Theory-heavy', fm: 'Outcome-driven' },
  { aspect: 'Data and analytics', agency: 'Basic reporting', consultancy: 'Complex models', fm: 'Actionable insight' },
  { aspect: 'Pricing model', agency: 'Retainer plus % of spend', consultancy: 'Day rates', fm: 'Published from-prices, fixed scope' },
  { aspect: 'Accessibility', agency: 'High', consultancy: 'Low', fm: 'Premium but accessible' },
];

const asSentence = (text: string) => {
  const flat = text.replace(/\s*\n\s*/g, ' ').trim();
  return flat.charAt(0) + flat.slice(1).toLowerCase();
};

export function WhyFMPage() {
  return (
    <div className="w-full">
      <PageHeader
        label="Why FM Consulting"
        title="Strategy without fluff. Performance with accountability."
        intro={whyFMConfig.description}
      />

      <Section tone="white" label="Difference" heading="Why businesses choose us.">
        <ul className="grid md:grid-cols-2 gap-x-6 gap-y-12">
          {whyFMConfig.differentiators.map((d) => (
            <li key={d.title} className="border-t border-fm-ink pt-6">
              <h3 className="fm-display-3 text-fm-ink">{asSentence(d.title)}</h3>
              <p className="fm-body mt-4 text-fm-graphite max-w-[28rem]">{d.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      {whyFMConfig.stats.length > 0 && (
        <Section
          tone="paper"
          label="Results"
          heading="We measure success by yours."
          intro={<p>Every engagement is set up to deliver measurable commercial outcomes. These are client averages.</p>}
        >
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 border-t border-fm-silver pt-8">
            {whyFMConfig.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse justify-end">
                <dt className="mt-3 text-[0.95rem] leading-snug text-fm-graphite">{asSentence(stat.label)}</dt>
                <dd className="fm-figure text-fm-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      <Section tone="white" label="Comparison" heading="How we compare." wide>
        <div className="overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0">
          <table className="w-full min-w-[44rem] table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[25%]" />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr className="border-b border-fm-ink">
                <th scope="col" className="py-4 pr-6 fm-meta text-fm-graphite font-medium">Aspect</th>
                <th scope="col" className="py-4 pr-6 fm-meta text-fm-graphite font-medium">Traditional agencies</th>
                <th scope="col" className="py-4 pr-6 fm-meta text-fm-graphite font-medium">Big consultancies</th>
                <th scope="col" className="py-4 px-5 fm-meta font-medium bg-fm-ink text-fm-paper">FM Consulting</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.aspect} className="border-b border-fm-silver align-top">
                  <th scope="row" className="py-5 pr-6 font-normal fm-display-3 text-fm-ink !text-[1.15rem]">{row.aspect}</th>
                  <td className="py-5 pr-6 fm-body text-fm-graphite">{row.agency}</td>
                  <td className="py-5 pr-6 fm-body text-fm-graphite">{row.consultancy}</td>
                  <td className="py-5 px-5 fm-body text-fm-ink bg-fm-paper">{row.fm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <CTA />
    </div>
  );
}
