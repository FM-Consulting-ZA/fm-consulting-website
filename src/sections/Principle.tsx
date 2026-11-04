import { Link } from 'react-router-dom';
import { viewConfig } from '@/config';
import { Section } from '@/components/layout/Section';
import { BrandFilm } from '@/components/BrandFilm';
import { findTheLeakFilm } from '@/data/films';

/** The point of view the whole practice is built on, stated once, then shown. */
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
      {/* Phones get the vertical cut once it exists; the 16:9 is too small to read there. */}
      <BrandFilm {...findTheLeakFilm} placement="home" className="mt-14 lg:mt-20 hidden md:block" />
    </Section>
  );
}
