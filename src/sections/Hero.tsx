import { Link } from 'react-router-dom';
import { heroConfig } from '@/config';
import { AnimatedButton } from '@/components/AnimatedButton';
import { BrokenCircle } from '@/components/BrokenCircle';

/*
 * One message, one supporting line, two actions. The only image is the
 * broken circle from the FM mark, drawn once as the page loads. The ring's
 * size and position are CSS variables so the stem can run from the opening
 * to the bottom edge of the hero at any viewport size.
 */
export function Hero() {
  if (!heroConfig.headline) return null;

  return (
    <section
      className={[
        'relative w-full min-h-[100svh] bg-fm-ink text-fm-paper overflow-hidden',
        '[--ring-size:78vw] [--ring-top:11svh] [--ring-right:-24vw] [--ring-stroke:0.34]',
        'sm:[--ring-size:56vw] sm:[--ring-right:-12vw] sm:[--ring-stroke:0.26]',
        'lg:[--ring-size:min(60svh,40vw)] lg:[--ring-top:18svh] lg:[--ring-stroke:0.19]',
        'lg:[--ring-right:max(3rem,calc((100vw_-_80rem)/2_+_3rem))]',
        '[--fm-stem:calc(100svh_-_var(--ring-top)_-_var(--ring-size))]',
      ].join(' ')}
    >
      {/* Tablet and desktop: the ring sits beside the copy. */}
      <BrokenCircle
        className="absolute hidden md:block text-fm-paper/25 lg:text-fm-paper/40"
        style={{
          top: 'var(--ring-top)',
          right: 'var(--ring-right)',
          width: 'var(--ring-size)',
          height: 'var(--ring-size)',
        }}
        stemClassName="hidden lg:block"
      />

      <div className="relative z-10 container-large px-6 lg:px-12 min-h-[100svh] flex flex-col justify-end lg:justify-center pt-28 pb-16 lg:pt-28 lg:pb-24">
        {/* Phones: the ring sits above the headline in the flow, so it can
            never cross the text, with its stem leading down to it. */}
        <BrokenCircle
          className="md:hidden relative self-end w-[40vw] aspect-square mb-[13svh] text-fm-paper/35 [--ring-stroke:0.55] [--fm-stem:8svh]"
        />

        <h1 className="fm-display-1 max-w-[12ch]">{heroConfig.headline}</h1>

        <p className="fm-lede mt-8 lg:mt-10 max-w-[34rem] text-fm-paper/70">{heroConfig.lede}</p>

        <div className="mt-10 lg:mt-12 flex flex-wrap items-center gap-x-9 gap-y-5">
          <AnimatedButton to={heroConfig.primaryHref} variant="secondary" size="lg" className="border-fm-paper">
            {heroConfig.primaryCta}
          </AnimatedButton>
          <Link
            to={heroConfig.secondaryHref}
            className="fm-link text-base text-fm-paper/75 decoration-fm-paper/35 hover:text-fm-paper hover:decoration-fm-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fm-paper"
          >
            {heroConfig.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
