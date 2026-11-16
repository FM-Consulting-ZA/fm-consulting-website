import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * False while a page is being pre-rendered at build time and while React is
 * attaching to that pre-rendered HTML; true from then on. Use it to hold back
 * anything that can only be decided in the browser (screen size, motion
 * preference), so the first browser render matches the pre-rendered markup.
 */
export function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
