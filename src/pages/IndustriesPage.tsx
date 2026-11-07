import { industriesConfig } from '@/config';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { CTA } from '@/sections/CTA';

/** Each sector as one row: what it is, where growth gets stuck, how we help. */
export function IndustriesPage() {
  return (
    <div className="w-full">
      <PageHeader label={industriesConfig.label} title="The sectors we know from the inside." intro={industriesConfig.description} />

      <Section
        tone="white"
        label="Sectors"
        heading="Different markets, the same leaks."
        intro={<p>Every sector has its own buying cycle and its own way of losing customers. These are the patterns we see most often, and where we start.</p>}
        wide
      >
        <div className="border-t border-fm-ink">
          {industriesConfig.industries.map((industry) => (
            <article key={industry.name} className="grid grid-cols-12 gap-x-6 gap-y-6 py-10 lg:py-12 border-b border-fm-silver">
              <div className="col-span-12 lg:col-span-3">
                <h3 className="fm-display-3 text-fm-ink">{industry.name}</h3>
              </div>
              <p className="col-span-12 lg:col-span-3 fm-body text-fm-graphite">{industry.description}</p>
              <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                <h4 className="fm-meta text-fm-graphite">Where growth gets stuck</h4>
                <ul className="mt-3">
                  {industry.challenges.map((c) => (
                    <li key={c} className="py-2 border-b border-fm-mist fm-body text-fm-ink">{c}</li>
                  ))}
                </ul>
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                <h4 className="fm-meta text-fm-graphite">How we help</h4>
                <ul className="mt-3">
                  {industry.solutions.map((s) => (
                    <li key={s} className="py-2 border-b border-fm-mist fm-body text-fm-ink">{s}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CTA />
    </div>
  );
}
