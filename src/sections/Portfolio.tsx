import { Link } from 'react-router-dom';
import { portfolioConfig } from '@/config';
import { workEnabled } from '@/data/work';
import { Section } from '@/components/layout/Section';

/*
 * Client work as an index rather than photographs. The previous version paired
 * each client with a stock photo that wasn't their work; names, sectors and
 * years are the honest proof until real screenshots or case studies exist.
 */
export function Portfolio() {
  if (portfolioConfig.projects.length === 0) return null;

  return (
    <Section
      id="work"
      tone="paper"
      label={portfolioConfig.label}
      heading={portfolioConfig.heading}
      intro={<p>{portfolioConfig.description}</p>}
    >
      <table className="w-full border-t border-fm-ink text-left">
        <caption className="sr-only">Selected clients by sector and year</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Client</th>
            <th scope="col">Sector</th>
            <th scope="col">Years</th>
          </tr>
        </thead>
        <tbody>
          {portfolioConfig.projects.map((project) => (
            <tr key={project.title} className="border-b border-fm-silver align-baseline">
              <th scope="row" className="py-6 lg:py-7 pr-6 font-normal">
                <span className="fm-display-3 text-fm-ink">{project.title}</span>
                <span className="block md:hidden mt-2 fm-body text-fm-graphite">{project.category}</span>
              </th>
              <td className="hidden md:table-cell py-6 lg:py-7 pr-6 fm-body text-fm-graphite w-[32%]">{project.category}</td>
              <td className="py-6 lg:py-7 fm-meta text-fm-graphite text-right whitespace-nowrap w-[1%]">{project.year}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {workEnabled && (
        <Link
          to="/work"
          className="fm-link inline-block mt-12 text-base text-fm-ink decoration-fm-silver hover:decoration-fm-ink"
        >
          See the work
        </Link>
      )}
    </Section>
  );
}
