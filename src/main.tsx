import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
// Archivo variable — one file covers weight 100-900 and the width axis, which
// is what the wordmark and display headings use (font-stretch: 125%).
import '@fontsource-variable/archivo/wdth.css'
// IBM Plex Mono carries anything countable: labels, figures, addresses.
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './index.css'
import App from './App.tsx'
import { initAnalytics } from './lib/analytics'
import { prerenderMatchesHost } from './data/work'

initAnalytics()

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Pages in the sitemap are pre-rendered to HTML at build time (see
// scripts/prerender.mjs), so their markup is already in the page and React
// only has to attach to it ("hydrate"). That only works when the first browser
// render is identical to the pre-rendered one, so start from scratch instead
// when something the build could not know changes the page:
//   - a query string (e.g. /contact?plan=..., which pre-fills the form)
//   - reduced motion, which swaps animated wrappers for plain ones
//   - a host that shows draft work the pre-rendered HTML leaves out
// Any URL that is not pre-rendered gets the empty shell and also starts fresh.
const prerendered = container.hasChildNodes()
const matchesPrerender =
  prerendered &&
  prerenderMatchesHost &&
  window.location.search === '' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (matchesPrerender) {
  hydrateRoot(container, app)
} else {
  if (prerendered) {
    // Drop the pre-rendered <title>/<meta> tags so <Seo> does not double them.
    document.head.querySelectorAll('[data-prerendered]').forEach((el) => el.remove())
    container.replaceChildren()
  }
  createRoot(container).render(app)
}
