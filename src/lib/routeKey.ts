/**
 * Groups paths that belong to one page so that moving between them neither
 * replays the page transition nor resets scroll. /work/:slug opens a viewer
 * over /work, so both share the key '/work'.
 */
export function routeKey(pathname: string) {
  return pathname === '/work' || pathname.startsWith('/work/') ? '/work' : pathname;
}
