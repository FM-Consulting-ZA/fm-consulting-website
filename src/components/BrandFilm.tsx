import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/*
 * The brand film, played the way the rest of the site moves: quietly, and
 * only when it is on screen. It starts muted once half of it is in view,
 * plays once and holds on the end card. Sound is one tap away. With reduced
 * motion, or where the browser blocks autoplay, it waits on a still until
 * someone presses play. Phones get the 4:5 cut, set larger for a small
 * screen, when one is supplied.
 */

interface BrandFilmProps {
  src: string;
  poster: string;
  /** What the film shows, for screen readers. */
  description: string;
  /** Short label under the film, e.g. "Find the leak". */
  title: string;
  duration: string;
  /** Where the film sits, for analytics. */
  placement: string;
  /** A 4:5 cut for phones (under 768 px wide). */
  portrait?: { src: string; poster: string };
  className?: string;
}

type State = 'waiting' | 'playing' | 'paused' | 'ended';

export function BrandFilm({ src, poster, description, title, duration, placement, portrait, className }: BrandFilmProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<State>('waiting');
  const [muted, setMuted] = useState(true);
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  // Chosen once on load; a phone does not cross the breakpoint mid-film.
  const [tall] = useState(() => !!portrait && window.matchMedia('(max-width: 767px)').matches);
  const file = tall && portrait ? portrait : { src, poster };
  // Show the still over the first frame: with reduced motion, or once autoplay is refused.
  const [still, setStill] = useState(reduced);
  const autoTried = useRef(false);

  const play = useCallback(async (opts?: { restart?: boolean; sound?: boolean }) => {
    const v = ref.current;
    if (!v) return false;
    if (opts?.restart) v.currentTime = 0;
    if (opts?.sound !== undefined) {
      v.muted = !opts.sound;
      setMuted(!opts.sound);
    }
    try {
      await v.play();
      setStill(false);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Autoplay, muted, the first time the film is half on screen; pause when it
  // leaves, resume when it comes back (unless it has finished).
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!autoTried.current) {
            autoTried.current = true;
            v.muted = true;
            v.play().catch(() => setStill(true));
          } else if (v.paused && !v.ended && v.dataset.autopaused === '1') {
            v.dataset.autopaused = '';
            v.play().catch(() => undefined);
          }
        } else if (!v.paused) {
          v.dataset.autopaused = '1';
          v.pause();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  const withSound = () => {
    trackEvent('film_play_sound', { film: title, placement });
    play({ restart: true, sound: true });
  };
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (state === 'ended') {
      trackEvent('film_replay', { film: title, placement });
      play({ restart: true });
    } else if (v.paused) {
      v.dataset.autopaused = '';
      play();
    } else {
      v.pause();
    }
  };
  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) play();
  };

  const playing = state === 'playing';

  return (
    <figure className={cn('w-full', className)}>
      <div className={cn('group relative w-full overflow-hidden bg-fm-paper', tall ? 'aspect-[4/5]' : 'aspect-video')}>
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full"
          src={file.src}
          muted
          playsInline
          preload="metadata"
          aria-label={description}
          onPlay={() => setState('playing')}
          onPause={(e) => setState(e.currentTarget.ended ? 'ended' : 'paused')}
          onEnded={() => {
            setState('ended');
            trackEvent('film_complete', { film: title, placement, cut: tall ? '4x5' : '16x9' });
          }}
        />
        {still && (
          <img src={file.poster} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        )}

        {/* Before anything has played: one clear way in, with sound. */}
        {still && state === 'waiting' && (
          <button
            type="button"
            onClick={withSound}
            className="absolute inset-0 flex items-center justify-center bg-fm-ink/0 transition-colors hover:bg-fm-ink/[0.04] focus-visible:outline-none"
            aria-label={`Play the film: ${title}, ${duration}, with sound`}
          >
            <span className="flex items-center gap-3 rounded-full bg-fm-ink px-6 py-3.5 text-sm text-fm-paper shadow-[0_8px_30px_rgba(15,18,17,0.18)] transition-transform group-hover:scale-[1.03] group-focus-visible:ring-2 group-focus-visible:ring-fm-ink group-focus-visible:ring-offset-2">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Play with sound
            </span>
          </button>
        )}
      </div>

      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="fm-meta text-fm-graphite">
          Film <span aria-hidden="true">/</span> {title} <span aria-hidden="true">/</span> {duration}
        </p>
        <div className="flex items-center gap-1 -mr-2">
          {muted && state !== 'waiting' && (
            <button
              type="button"
              onClick={withSound}
              className="fm-meta inline-flex items-center gap-2 rounded-full px-3 py-2 text-fm-ink transition-colors hover:bg-fm-ink/5"
            >
              <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
              Watch with sound
            </button>
          )}
          {state !== 'waiting' && (
            <>
              <button
                type="button"
                onClick={toggle}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-fm-ink transition-colors hover:bg-fm-ink/5"
                aria-label={state === 'ended' ? 'Play again' : playing ? 'Pause' : 'Play'}
              >
                {state === 'ended' ? (
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                ) : playing ? (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Play className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={toggleSound}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-fm-ink transition-colors hover:bg-fm-ink/5"
                aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
                aria-pressed={!muted}
              >
                {muted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
              </button>
            </>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
