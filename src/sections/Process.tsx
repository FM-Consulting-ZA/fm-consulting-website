import { processConfig } from '@/config';
import { Section } from '@/components/layout/Section';

/** The five stages, in order, across the full width of the grid. */
export function Process() {
  if (processConfig.steps.length === 0) return null;

  return (
    <Section
      id="method"
      tone="white"
      label={processConfig.label}
      heading={processConfig.heading}
      intro={<p>{processConfig.description}</p>}
      wide
    >
      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-12">
        {processConfig.steps.map((step) => (
          <li key={step.title} className="border-t border-fm-ink pt-5">
            <span className="fm-meta text-fm-graphite" aria-hidden="true">
              {step.number}
            </span>
            <h3 className="fm-display-3 mt-8 lg:mt-12 text-fm-ink">{step.title}</h3>
            <p className="fm-body mt-4 text-fm-graphite">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
