import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedButton } from './AnimatedButton';
import { BrandLogo } from './BrandLogo';
import { BrokenCircle } from './BrokenCircle';
import { getLenis } from './motion/SmoothScroll';
import { contactConfig, footerConfig, navigationConfig } from '@/config';

/*
 * The bar carries three pages and the call to action. Everything else, those
 * three included, lives in the menu: a full-height ink panel that draws down
 * from the top, set on the same 3 + 9 grid as the pages, with each page
 * numbered and described in a line. The current page carries the ring from
 * the mark.
 */

const EASE = [0.76, 0, 0.24, 1] as const;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const reduced = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isHomePage = location.pathname === '/';

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // While the menu is open: hold the page still, close on Escape, and keep
  // Tab inside the bar and the panel. Focus goes back to the button after.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.classList.add('overflow-hidden');
    const button = buttonRef.current;
    const first = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('ol a[href]')?.focus(), 350);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [navRef.current, panelRef.current]
        .flatMap((el) => (el ? Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)) : []))
        .filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : i === items.length - 1 ? 0 : i + 1;
      e.preventDefault();
      items[next].focus();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(first);
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('overflow-hidden');
      lenis?.start();
      button?.focus({ preventScroll: true });
    };
  }, [open]);

  const light = (isHomePage && !isScrolled) || open;
  const barLinks = navigationConfig.links.filter((l) => l.inBar);
  const socials = footerConfig.socialLinks.filter((s) => s.href);
  const phoneHref = `tel:${contactConfig.contactInfo.phone.replace(/[^+\d]/g, '')}`;
  const isCurrent = (href: string) => location.pathname === href || location.pathname.startsWith(`${href}/`);

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out-circ',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4',
          open
            ? 'bg-transparent border-b border-transparent'
            : isScrolled || !isHomePage
              ? 'bg-white/95 backdrop-blur-md border-b border-fm-ink/10'
              : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="container-large px-6 lg:px-12 py-3">
          <div className="flex items-center justify-between gap-6">
            <Link
              to="/"
              onClick={close}
              aria-label="FM Consulting home"
              className="flex items-center py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
            >
              <BrandLogo
                variant="lockup-compact"
                reverse={light}
                className={cn('h-7 sm:h-8 transition-colors duration-500', light ? 'text-fm-paper' : 'text-fm-ink')}
              />
            </Link>

            <div className="flex items-center gap-5 lg:gap-8">
              {barLinks.length > 0 && (
                <div className={cn('hidden lg:flex items-center gap-8 transition-opacity duration-300', open && 'lg:opacity-0 lg:pointer-events-none')}>
                  {barLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      tabIndex={open ? -1 : undefined}
                      aria-current={isCurrent(link.href) ? 'page' : undefined}
                      className={cn(
                        'relative group text-[15px] xl:text-base whitespace-nowrap transition-colors duration-500',
                        light ? 'text-white/90 hover:text-white' : 'text-fm-ink/80 hover:text-fm-ink'
                      )}
                    >
                      {link.label}
                      <span
                        className={cn(
                          'absolute -bottom-1 left-0 h-px transition-all duration-300 group-hover:w-full',
                          isCurrent(link.href) ? 'w-full' : 'w-0',
                          light ? 'bg-white' : 'bg-fm-ink'
                        )}
                      />
                    </Link>
                  ))}
                </div>
              )}

              <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="site-menu"
                className={cn(
                  'group inline-flex items-center gap-3 py-2 text-[15px] xl:text-base transition-colors duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current',
                  light ? 'text-white' : 'text-fm-ink'
                )}
              >
                <span className="relative block w-[3.2em] text-right" aria-hidden="true">
                  <span className={cn('block transition-all duration-300', open ? '-translate-y-2 opacity-0' : 'translate-y-0 opacity-100')}>Menu</span>
                  <span
                    className={cn('absolute inset-0 transition-all duration-300', open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0')}
                  >
                    Close
                  </span>
                </span>
                <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
                <span className="relative block h-3 w-5" aria-hidden="true">
                  <span
                    className={cn(
                      'absolute left-0 right-0 h-[1.5px] bg-current transition-all duration-500 ease-out-quad',
                      open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0.5 group-hover:-translate-y-px'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute left-0 right-0 h-[1.5px] bg-current transition-all duration-500 ease-out-quad',
                      open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0.5 group-hover:translate-y-px'
                    )}
                  />
                </span>
              </button>

              {navigationConfig.contactLabel && (
                <div className="hidden md:block" data-cta-location="nav_desktop">
                  <AnimatedButton
                    to={navigationConfig.contactHref || '/contact'}
                    onClick={close}
                    variant={light ? 'outline-white' : 'primary'}
                    size="md"
                    className="whitespace-nowrap lg:px-4 xl:px-6"
                  >
                    {navigationConfig.contactLabel}
                  </AnimatedButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            data-cta-location="nav_menu"
            data-lenis-prevent
            initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: reduced ? 0.2 : 0.75, ease: EASE }}
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-fm-ink text-fm-paper"
          >
            {/* The ring from the mark, drawn large and quiet behind the list. */}
            <BrokenCircle
              className="pointer-events-none absolute -right-[18vh] -bottom-[38vh] h-[96vh] aspect-square text-fm-paper/[0.08] [--ring-stroke:0.15] hidden md:block"
              stem={false}
            />

            <div className="container-large relative flex min-h-full flex-col px-6 lg:px-12 pt-24 lg:pt-32 pb-10">
              <div className="grid flex-1 grid-cols-12 gap-x-6 gap-y-10 border-t border-fm-paper/25 pt-6 lg:pt-8">
                <div className="col-span-12 lg:col-span-3 flex flex-col justify-between gap-10">
                  <p className="fm-meta text-fm-paper/55 lg:pt-3">Menu</p>
                  <MenuContact socials={socials} phoneHref={phoneHref} className="hidden lg:block" />
                </div>

                <ol className="group/list col-span-12 lg:col-span-9">
                  {navigationConfig.links.map((link, i) => {
                    const current = isCurrent(link.href);
                    return (
                      <motion.li
                        key={link.href}
                        initial={reduced ? false : { opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: reduced ? 0 : 0.3 + i * 0.045, ease: EASE_OUT }}
                        className="border-b border-fm-paper/15"
                      >
                        <Link
                          to={link.href}
                          onClick={close}
                          aria-current={current ? 'page' : undefined}
                          className="group/item flex items-baseline gap-4 sm:gap-6 py-3 lg:py-[0.9rem] transition-opacity duration-300 group-hover/list:opacity-40 hover:!opacity-100 focus-visible:!opacity-100 focus-visible:outline-none"
                        >
                          <span className="fm-meta w-6 shrink-0 text-fm-paper/45">{String(i + 1).padStart(2, '0')}</span>
                          <span className="flex items-center gap-[0.3em] font-semibold tracking-[-0.04em] leading-[1.02] text-[clamp(1.9rem,3.6vw,3.4rem)] transition-transform duration-500 ease-out-quart group-hover/item:translate-x-2 group-focus-visible/item:translate-x-2">
                            {link.label}
                            <BrokenCircle
                              className={cn(
                                'h-[0.36em] aspect-square [--ring-stroke:9] transition-all duration-300',
                                current
                                  ? 'opacity-100 scale-100'
                                  : 'opacity-0 scale-50 group-hover/item:opacity-100 group-hover/item:scale-100 group-focus-visible/item:opacity-100 group-focus-visible/item:scale-100'
                              )}
                              stem={false}
                            />
                          </span>
                          {link.note && (
                            <span className="ml-auto hidden md:block fm-body text-right text-fm-paper/50 transition-colors duration-300 group-hover/item:text-fm-paper/80">
                              {link.note}
                            </span>
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ol>
              </div>

              <motion.div
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: reduced ? 0 : 0.7, ease: EASE_OUT }}
                className="mt-10 flex flex-col gap-8 lg:hidden"
              >
                <MenuContact socials={socials} phoneHref={phoneHref} />
                <Link
                  to={navigationConfig.contactHref || '/contact'}
                  onClick={close}
                  className="md:hidden inline-flex w-full items-center justify-center bg-fm-paper px-6 py-4 font-mono text-sm text-fm-ink"
                >
                  {navigationConfig.contactLabel}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const quiet = 'text-fm-paper/65 hover:text-fm-paper transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fm-paper';

function MenuContact({
  socials,
  phoneHref,
  className,
}: {
  socials: { label: string; href: string }[];
  phoneHref: string;
  className?: string;
}) {
  return (
    <div className={cn('space-y-5 text-[0.95rem] leading-snug', className)}>
      <ul className="space-y-1.5">
        <li>
          <a href={`mailto:${contactConfig.contactInfo.email}`} className={quiet}>
            {contactConfig.contactInfo.email}
          </a>
        </li>
        <li>
          <a href={phoneHref} className={quiet}>
            {contactConfig.contactInfo.phone}
          </a>
        </li>
      </ul>
      {socials.length > 0 && (
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className={quiet}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      )}
      <p className="text-fm-paper/45">{contactConfig.contactInfo.address}</p>
      <p className="fm-meta text-fm-paper/45">{footerConfig.tagline}</p>
    </div>
  );
}
