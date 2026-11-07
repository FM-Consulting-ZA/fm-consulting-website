import { useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { aboutConfig, footerConfig, portfolioConfig } from '@/config';
import { pricingConfig } from '@/data/pricing';
import { workEnabled } from '@/data/work';
import { BrokenCircle } from '@/components/BrokenCircle';
import { cn } from '@/lib/utils';

/*
 * The work wall: real screens from cleared projects, set among the practice's
 * own material (clients, commitments, engagements), on a wall tilted off the
 * grid. As it scrolls into view it levels out, settles to size, and the tiles
 * round the centre step back to give "See the work" room. Clutter into order,
 * which is the job.
 *
 * Only screens from projects marked `published` in src/data/work.ts belong
 * here (Thynkverse and Lobster Tavern, both signed off on 30 Oct 2026).
 */

type Tone = 'ink' | 'white' | 'mist' | 'paper';

type Tile =
  | { kind: 'screen'; src: string; alt: string }
  | { kind: 'client'; name: string; sector: string; year: string; tone: Tone }
  | { kind: 'stat'; value: string; label: string; tone: Tone }
  | { kind: 'plan'; name: string; lead: string; tone: Tone }
  | { kind: 'tagline'; tone: Tone }
  | { kind: 'ring'; tone: Tone }
  | { kind: 'centre' };

const tones: Record<Tone, string> = {
  ink: 'bg-fm-ink text-fm-paper',
  white: 'bg-white text-fm-ink',
  mist: 'bg-fm-mist text-fm-ink',
  paper: 'bg-fm-paper text-fm-ink ring-1 ring-inset ring-fm-silver',
};
const metaTone: Record<Tone, string> = {
  ink: 'text-fm-paper/55',
  white: 'text-fm-graphite',
  mist: 'text-fm-graphite',
  paper: 'text-fm-graphite',
};

const screen = (file: string, alt: string): Tile => ({
  kind: 'screen',
  src: `/images/work-wall/${file}.webp`,
  alt,
});
const client = (title: string, tone: Tone): Tile => {
  const p = portfolioConfig.projects.find((x) => x.title === title);
  return {
    kind: 'client',
    name: title,
    sector: p?.category ?? '',
    year: p?.year ?? '',
    tone,
  };
};
const stat = (i: number, tone: Tone): Tile => ({
  kind: 'stat',
  value: aboutConfig.stats[i]?.value ?? '',
  label: aboutConfig.stats[i]?.label ?? '',
  tone,
});
const plan = (i: number, tone: Tone): Tile => ({
  kind: 'plan',
  name: pricingConfig.plans[i]?.name ?? '',
  lead: pricingConfig.plans[i]?.lead ?? '',
  tone,
});

const COLS = 7;
const CENTRE_COL = 3;
// Three rows of seven. The centre column, which is most of what a phone
// sees, is real screens above and below "See the work".
const TILES: Tile[] = [
  plan(2, 'white'),
  stat(0, 'mist'),
  screen('lobster-tavern-feast', 'Lobster Tavern website, the feast menu'),
  screen('thynkverse-home', 'Thynkverse website, home page'),
  client('Mr Telly', 'white'),
  stat(2, 'ink'),
  plan(3, 'mist'),

  stat(3, 'white'),
  screen('lobster-tavern-mess', 'Lobster Tavern website, about the tavern'),
  client('Thynkverse', 'mist'),
  { kind: 'centre' },
  screen('fm-leak', 'FM Consulting film, finding the leak'),
  client('Lobster Tavern', 'ink'),
  plan(0, 'white'),

  { kind: 'tagline', tone: 'ink' },
  client('International Tobacco Manufacturer', 'paper'),
  { kind: 'ring', tone: 'white' },
  screen('lobster-tavern-home', 'Lobster Tavern website, home page'),
  screen('lobster-tavern-choice', 'Lobster Tavern website, how ordering works'),
  stat(1, 'mist'),
  plan(1, 'ink'),
];

const small = 'text-[clamp(0.6rem,0.72vw,0.72rem)]';
const name = 'font-semibold tracking-[-0.03em] leading-[1.05] text-[clamp(0.95rem,1.55vw,1.5rem)]';

function TileBody({ tile }: { tile: Exclude<Tile, { kind: 'centre' }> }) {
  switch (tile.kind) {
    case 'screen':
      return (
        <img src={tile.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" draggable={false} />
      );
    case 'client':
      return (
        <div className={cn('flex h-full flex-col justify-between p-[7%]', tones[tile.tone])}>
          <div className={cn('flex justify-between gap-3 fm-meta', small, metaTone[tile.tone])}>
            <span>{tile.sector}</span>
            <span className="whitespace-nowrap">{tile.year}</span>
          </div>
          <p className={cn(name, 'max-w-[14ch]')}>{tile.name}</p>
        </div>
      );
    case 'stat':
      return (
        <div className={cn('flex h-full flex-col justify-between p-[7%]', tones[tile.tone])}>
          <p className="font-mono tracking-[-0.045em] leading-none text-[clamp(1.6rem,3vw,2.9rem)]">{tile.value}</p>
          <p className={cn('fm-meta whitespace-pre-line', small, metaTone[tile.tone])}>{tile.label}</p>
        </div>
      );
    case 'plan':
      return (
        <div className={cn('flex h-full flex-col justify-between p-[7%]', tones[tile.tone])}>
          <div className={cn('flex justify-between gap-3 fm-meta', small, metaTone[tile.tone])}>
            <span>Engagement</span>
            <span>{tile.lead}</span>
          </div>
          <p className={name}>{tile.name}</p>
        </div>
      );
    case 'tagline':
      return (
        <div className={cn('flex h-full flex-col justify-end p-[7%]', tones[tile.tone])}>
          <p className={cn(name, 'whitespace-pre-line')}>{footerConfig.tagline.replace(/\. /g, '.\n')}</p>
        </div>
      );
    case 'ring':
      return (
        <div className={cn('relative flex h-full items-center justify-center', tones[tile.tone])}>
          <BrokenCircle className="h-[52%] aspect-square text-fm-ink [--ring-stroke:1]" stem={false} />
        </div>
      );
  }
}

function WallTile({
  tile,
  col,
  row,
  part,
  children,
}: {
  tile: Tile;
  col: number;
  row: number;
  part: MotionValue<number>;
  children?: ReactNode;
}) {
  // Tiles step away from the centre tile: sideways for the columns either
  // side, up or down for the tiles above and below it.
  const dir = col < CENTRE_COL ? -1 : col > CENTRE_COL ? 1 : 0;
  const vdir = col === CENTRE_COL ? (row === 0 ? -1 : row === 2 ? 1 : 0) : 0;
  const x = useTransform(part, [0, 1], ['0%', `${dir * 16}%`]);
  const y = useTransform(part, [0, 1], ['0%', `${vdir * 22}%`]);
  const isCentre = tile.kind === 'centre';
  return (
    <motion.div
      style={{ x, y }}
      className={cn(
        'relative aspect-[16/10] overflow-hidden rounded-[4px]',
        isCentre ? 'z-10 shadow-[0_40px_90px_-36px_rgba(15,18,17,0.55)]' : 'shadow-[0_24px_60px_-30px_rgba(15,18,17,0.35)]',
      )}
    >
      {children ?? (tile.kind !== 'centre' && <TileBody tile={tile} />)}
    </motion.div>
  );
}

export function WorkWall() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  // 0 → 0.75: the wall levels out and settles. 0.72 → 1: tiles step back.
  const rotate = useTransform(scrollYProgress, [0, 0.75], reduced ? [0, 0] : [-13, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.75], reduced ? [1, 1] : [1.32, 1]);
  const x = useTransform(scrollYProgress, [0, 0.75], reduced ? ['0%', '0%'] : ['-5%', '0%']);
  const y = useTransform(scrollYProgress, [0, 0.75], reduced ? ['0%', '0%'] : ['7%', '0%']);
  const part = useTransform(scrollYProgress, [0.72, 1], reduced ? [1, 1] : [0, 1]);
  const centreScale = useTransform(part, [0, 1], [1, 1.06]);

  const centre = workEnabled ? (
    <Link
      to="/work"
      className="group flex h-full flex-col justify-between bg-fm-ink p-[7%] text-fm-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fm-paper"
    >
      <span className={cn('fm-meta text-fm-paper/55', small)}>Selected work</span>
      <span className="flex items-end justify-between gap-4">
        <span className="font-semibold tracking-[-0.035em] leading-none text-[clamp(1.35rem,2.4vw,2.4rem)]">See the work</span>
        <span
          aria-hidden="true"
          className="text-[clamp(1.2rem,2vw,2rem)] leading-none transition-transform duration-300 group-hover:translate-x-1.5"
        >
          →
        </span>
      </span>
    </Link>
  ) : (
    <div className="flex h-full flex-col justify-end bg-fm-ink p-[7%] text-fm-paper">
      <span className={cn(name, 'whitespace-pre-line')}>{footerConfig.tagline.replace(/\. /g, '.\n')}</span>
    </div>
  );

  return (
    <div ref={ref} className="relative w-full overflow-hidden bg-fm-paper h-[clamp(480px,58vw,840px)]">
      <p className="sr-only">
        A wall of recent work: screens from the Thynkverse and Lobster Tavern websites, among cards naming clients, engagements and
        commitments.
      </p>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          style={{ rotate, scale, x, y }}
          className="grid shrink-0 gap-[clamp(10px,1.3vw,20px)] [--tile:clamp(190px,23vw,380px)] [grid-template-columns:repeat(7,var(--tile))] will-change-transform"
        >
          {TILES.map((tile, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            if (tile.kind === 'centre') {
              return (
                <motion.div key={i} style={{ scale: centreScale }} className="relative z-10">
                  <WallTile tile={tile} col={col} row={row} part={part}>
                    {centre}
                  </WallTile>
                </motion.div>
              );
            }
            return (
              <div key={i} aria-hidden="true">
                <WallTile tile={tile} col={col} row={row} part={part} />
              </div>
            );
          })}
        </motion.div>
      </div>
      {/* Soft fade at the edges so the wall reads as continuing past the frame. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:linear-gradient(to_right,rgba(242,243,240,1)_0%,rgba(242,243,240,0)_8%,rgba(242,243,240,0)_92%,rgba(242,243,240,1)_100%)]"
      />
    </div>
  );
}
