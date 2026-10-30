import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/*
 * The one section anatomy used across the home page, matching the legal and
 * Insights pages: a rule, a label in the left index column, the heading and
 * intro in the right-hand nine columns, then the content on the same line.
 * Every section starts its text at the same x position, which is most of
 * what makes a page read as planned.
 */

export type SectionTone = 'paper' | 'white' | 'ink';

const tones: Record<SectionTone, { bg: string; rule: string; label: string; intro: string }> = {
  paper: { bg: 'bg-fm-paper text-fm-ink', rule: 'border-fm-ink', label: 'text-fm-graphite', intro: 'text-fm-graphite' },
  white: { bg: 'bg-white text-fm-ink', rule: 'border-fm-ink', label: 'text-fm-graphite', intro: 'text-fm-graphite' },
  ink: { bg: 'bg-fm-ink text-fm-paper', rule: 'border-fm-paper/25', label: 'text-fm-paper/55', intro: 'text-fm-paper/70' },
};

interface SectionProps {
  id?: string;
  tone?: SectionTone;
  label: string;
  heading: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  /** Let the content use all twelve columns (for content that is a row). */
  wide?: boolean;
  /** Smaller gap above the content, for a single link or a pair of actions. */
  compact?: boolean;
  className?: string;
}

export function Section({ id, tone = 'paper', label, heading, intro, children, wide = false, compact = false, className }: SectionProps) {
  const headingId = useId();
  const t = tones[tone];

  return (
    <section id={id} aria-labelledby={headingId} className={cn('w-full fm-section', t.bg, className)}>
      <div className="container-large px-6 lg:px-12">
        <div className={cn('grid grid-cols-12 gap-x-6 gap-y-6 border-t pt-6 lg:pt-8', t.rule)}>
          <p className={cn('fm-meta col-span-12 lg:col-span-3 lg:pt-3', t.label)}>{label}</p>
          <div className="col-span-12 lg:col-span-9">
            <h2 id={headingId} className="fm-display-2 max-w-[17ch]">
              {heading}
            </h2>
            {intro && <div className={cn('fm-body mt-6 lg:mt-8 max-w-[40rem]', t.intro)}>{intro}</div>}
          </div>
        </div>

        {children && (
          <div className={cn('grid grid-cols-12 gap-x-6', compact ? 'mt-10 lg:mt-12' : 'mt-14 lg:mt-20')}>
            <div className={wide ? 'col-span-12' : 'col-span-12 lg:col-start-4 lg:col-span-9'}>{children}</div>
          </div>
        )}
      </div>
    </section>
  );
}
