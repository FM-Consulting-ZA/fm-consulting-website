import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

/*
 * The broken circle from the FM mark, drawn at hero scale: a hairline ring
 * that is open at the bottom, with a stem dropping from the gap (the circle
 * sits above the M's stem in the logo the same way). It draws once on load
 * and is static afterwards. Purely decorative.
 */

const GAP_DEGREES = 16; // width of the opening at the bottom of the ring
const R = 49.5; // ring radius inside a 100 x 100 viewBox

function point(angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
}

// Bottom of the ring is 90deg in SVG space (y grows downward). The arc runs
// clockwise the long way round from one side of the gap to the other.
const start = point(90 + GAP_DEGREES / 2);
const end = point(90 - GAP_DEGREES / 2);
const ARC = `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${R} ${R} 0 1 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;

interface BrokenCircleProps {
  className?: string;
  style?: CSSProperties;
  /** Classes for the stem, e.g. to hide it on small screens. */
  stemClassName?: string;
  /** Show the stem that drops from the opening to the bottom of the parent. */
  stem?: boolean;
}

export function BrokenCircle({ className, style, stemClassName, stem = true }: BrokenCircleProps) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none', className)} style={style}>
      <svg viewBox="0 0 100 100" className="fm-ring block w-full h-full overflow-visible" fill="none">
        <path
          d={ARC}
          pathLength={1}
          className="fm-ring-arc"
          stroke="currentColor"
          strokeLinecap="round"
        />
      </svg>
      {stem && (
        <span
          className={cn('fm-ring-stem absolute top-full w-px bg-current', stemClassName)}
          style={{ left: 'calc(50% - 0.5px)', height: 'var(--fm-stem, 30vh)' }}
        />
      )}
    </div>
  );
}
