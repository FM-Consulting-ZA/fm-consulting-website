import { Link } from 'react-router-dom';
import { viewConfig } from '@/config';
import { Section } from '@/components/layout/Section';

/** The point of view the whole practice is built on, stated once. */
export function Principle() {
  if (!viewConfig.heading) return null;

  return (
    <Section tone="white" compact label={viewConfig.label} heading={viewConfig.heading} intro={<p>{viewConfig.body}</p>}>
      <Link
        to={viewConfig.linkHref}
        className="fm-link inline-block text-base text-fm-ink decoration-fm-silver hover:decoration-fm-ink"
      >
        {viewConfig.linkLabel}
      </Link>
    </Section>
  );
}
