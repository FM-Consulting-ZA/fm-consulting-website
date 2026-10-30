import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Principle } from '@/sections/Principle';
import { Services } from '@/sections/Services';
import { Process } from '@/sections/Process';
import { Portfolio } from '@/sections/Portfolio';
import { CTA } from '@/sections/CTA';

export function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Principle />
      <Services />
      <Process />
      <Portfolio />
      {/* Testimonials are withheld until real, attributable quotes exist.
          The section and its config remain in place — restore it once
          testimonialsConfig holds genuine client quotes. */}
      <CTA />
    </>
  );
}
