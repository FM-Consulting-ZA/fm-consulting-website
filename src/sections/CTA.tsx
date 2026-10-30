import { ctaConfig } from '@/config';
import { Section } from '@/components/layout/Section';
import { AnimatedButton } from '@/components/AnimatedButton';

/** The one closing ask, on ink so it runs straight into the footer. */
export function CTA() {
  if (!ctaConfig.heading) return null;

  return (
    <Section tone="ink" compact label={ctaConfig.label} heading={ctaConfig.heading} intro={<p>{ctaConfig.description}</p>} className="pb-0 lg:pb-0">
      <div className="flex flex-wrap items-center gap-x-9 gap-y-5" data-cta-location="home_closing">
        <AnimatedButton to={ctaConfig.buttonHref} variant="secondary" size="lg" className="border-fm-paper">
          {ctaConfig.buttonText}
        </AnimatedButton>
        <a
          href={`mailto:${ctaConfig.email}`}
          className="fm-link text-base text-fm-paper/75 decoration-fm-paper/35 hover:text-fm-paper hover:decoration-fm-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fm-paper"
        >
          {ctaConfig.email}
        </a>
      </div>
    </Section>
  );
}
