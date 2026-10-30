import { Link } from 'react-router-dom';
import { aboutConfig } from '@/config';
import { Section } from '@/components/layout/Section';

// Config labels carry line breaks and title case for the About page's
// layout; here they read as one line in sentence case.
const asSentence = (label: string) => {
  const flat = label.replace(/\s*\n\s*/g, ' ').trim().toLowerCase();
  return flat.charAt(0).toUpperCase() + flat.slice(1);
};

export function About() {
  const stats = [
    { value: aboutConfig.experienceValue, label: aboutConfig.experienceLabel },
    ...aboutConfig.stats,
  ].filter((s) => s.value);

  return (
    <Section
      id="about"
      tone="paper"
      label={aboutConfig.label}
      heading={aboutConfig.heading}
      intro={<p>{aboutConfig.description}</p>}
    >
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 border-t border-fm-silver pt-8">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse justify-end">
            <dt className="mt-3 text-[0.95rem] leading-snug text-fm-graphite">{asSentence(stat.label)}</dt>
            <dd className="fm-figure text-fm-ink">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <Link
        to="/about"
        className="fm-link inline-block mt-12 text-base text-fm-ink decoration-fm-silver hover:decoration-fm-ink"
      >
        More about FM Consulting
      </Link>
    </Section>
  );
}
