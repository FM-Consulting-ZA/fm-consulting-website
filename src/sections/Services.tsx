import { Link } from 'react-router-dom';
import { servicesConfig } from '@/config';
import { Section } from '@/components/layout/Section';

/** Services as a plain list on the grid: name on the left, scope on the right. */
export function Services() {
  if (servicesConfig.services.length === 0) return null;

  return (
    <Section
      id="services"
      tone="paper"
      label={servicesConfig.label}
      heading={servicesConfig.heading}
      intro={<p>{servicesConfig.intro}</p>}
    >
      <ul className="border-t border-fm-ink">
        {servicesConfig.services.map((service) => (
          <li key={service.title} className="grid grid-cols-9 gap-x-6 gap-y-2 py-7 lg:py-8 border-b border-fm-silver">
            <h3 className="col-span-9 md:col-span-4 fm-display-3 text-fm-ink">{service.title}</h3>
            <p className="col-span-9 md:col-span-5 fm-body text-fm-graphite">{service.description}</p>
          </li>
        ))}
      </ul>

      <Link
        to="/services"
        className="fm-link inline-block mt-12 text-base text-fm-ink decoration-fm-silver hover:decoration-fm-ink"
      >
        How each service is delivered
      </Link>
    </Section>
  );
}
