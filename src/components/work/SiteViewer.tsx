import { useEffect, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ArrowUpRight, Monitor, Smartphone, Tablet, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getLenis } from '@/components/motion/SmoothScroll';
import { hostOf, kindLabel, type WorkProject } from '@/data/work';

type Device = 'desktop' | 'tablet' | 'mobile';

const DEVICES: { id: Device; label: string; width: number | null; Icon: typeof Monitor }[] = [
  { id: 'desktop', label: 'Desktop', width: null, Icon: Monitor },
  { id: 'tablet', label: 'Tablet', width: 834, Icon: Tablet },
  { id: 'mobile', label: 'Mobile', width: 390, Icon: Smartphone },
];

/**
 * Full-screen viewer that shows a project's real site inside the FM site.
 * The frame is sandboxed: scripts run and outbound links open in a new tab,
 * but the framed site cannot submit forms or navigate this page away.
 */
export function SiteViewer({ project, onClose }: { project: WorkProject | null; onClose: () => void }) {
  const open = !!project;
  const slug = project?.slug ?? '';

  // Device and load state belong to one project; opening another starts fresh.
  const [state, setState] = useState<{ slug: string; device: Device; loaded: boolean }>({
    slug,
    device: 'desktop',
    loaded: false,
  });
  const current = state.slug === slug ? state : { slug, device: 'desktop' as Device, loaded: false };
  const { device, loaded } = current;
  const setDevice = (d: Device) => setState({ ...current, device: d });
  const setLoaded = () => setState((s) => (s.slug === slug ? { ...s, loaded: true } : { slug, device: 'desktop', loaded: true }));

  // Freeze smooth scroll behind the viewer.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    return () => {
      lenis?.start();
      document.documentElement.classList.remove('cursor-in-frame');
    };
  }, [open]);

  const width = DEVICES.find((d) => d.id === device)?.width ?? null;
  const host = hostOf(project?.url);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[9990] bg-fm-ink data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          data-lenis-prevent
          aria-describedby={undefined}
          className="fixed inset-0 z-[9991] flex flex-col bg-fm-ink text-white focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          {project && (
            <>
              {/* Chrome */}
              <header className="h-14 shrink-0 grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 lg:px-6 border-b border-white/10">
                <div className="min-w-0 flex items-center gap-3">
                  <DialogPrimitive.Title className="truncate text-sm font-semibold tracking-tight">
                    {project.client}
                  </DialogPrimitive.Title>
                  <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                    {kindLabel[project.kind]}
                  </span>
                </div>

                {project.view === 'embed' ? (
                  <div role="group" aria-label="Preview size" className="hidden md:flex items-center gap-1 rounded-full border border-white/15 p-1">
                    {DEVICES.map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setDevice(id)}
                        aria-pressed={device === id}
                        className={cn(
                          'flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors',
                          device === id ? 'bg-white text-fm-ink' : 'text-white/60 hover:text-white'
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden />
                        {label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span />
                )}

                <div className="flex items-center justify-end gap-2">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 hover:text-white transition-colors"
                    >
                      New tab
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
                    </a>
                  )}
                  <DialogPrimitive.Close
                    className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] hover:bg-white hover:text-fm-ink transition-colors"
                  >
                    Close
                    <X className="w-3.5 h-3.5" aria-hidden />
                  </DialogPrimitive.Close>
                </div>
              </header>

              {/* Stage */}
              <div className="relative flex-1 min-h-0 flex justify-center bg-fm-ink">
                {project.view === 'embed' && project.url && (
                  <div
                    className={cn(
                      'relative h-full w-full bg-white transition-[max-width,margin,border-radius] duration-500 ease-out-quart overflow-hidden',
                      width && 'md:my-6 md:h-[calc(100%-3rem)] md:rounded-2xl md:ring-1 md:ring-white/15'
                    )}
                    style={{ maxWidth: width ?? '100%' }}
                    onMouseEnter={() => document.documentElement.classList.add('cursor-in-frame')}
                    onMouseLeave={() => document.documentElement.classList.remove('cursor-in-frame')}
                  >
                    <iframe
                      key={project.slug}
                      src={project.url}
                      title={`${project.client}, ${kindLabel[project.kind].toLowerCase()}`}
                      className="absolute inset-0 h-full w-full border-0"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                      allow="fullscreen"
                      referrerPolicy="strict-origin-when-cross-origin"
                      onLoad={setLoaded}
                    />
                    {!loaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-fm-paper">
                        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-fm-graphite animate-pulse">
                          Loading {host}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {project.view === 'video' && project.video && (
                  <div className="flex h-full w-full items-center justify-center p-4 lg:p-10">
                    <video
                      key={project.slug}
                      src={project.video}
                      poster={project.poster}
                      className="max-h-full max-w-full rounded-xl ring-1 ring-white/15"
                      controls
                      autoPlay
                      muted
                      playsInline
                    />
                  </div>
                )}

                {(project.view === 'link' || (project.view === 'video' && !project.video)) && (
                  <div className="flex h-full w-full items-center justify-center px-6">
                    <div className="max-w-md text-center">
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">{host}</p>
                      <p className="mt-4 text-xl leading-snug">
                        This site can’t be shown inside another page. It opens in a new tab instead.
                      </p>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-8 inline-flex items-center gap-2 border border-white/60 px-6 py-3 font-mono text-sm hover:bg-white hover:text-fm-ink transition-colors"
                        >
                          Open {project.client}
                          <ArrowUpRight className="w-4 h-4" aria-hidden />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
