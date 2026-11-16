import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppShell } from './App'

/**
 * Build-time render of one route. Used only by scripts/prerender.mjs; never
 * shipped to the browser. Returns the markup for #root, with the page's
 * <title>, <meta> and <link rel="canonical"> tags (from <Seo>) at the front,
 * which the prerender script moves into <head>.
 */
export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppShell />
      </StaticRouter>
    </StrictMode>,
  )
}
