#!/usr/bin/env node
// Pre-renders every URL in public/sitemap.xml to its own HTML file.
//
// Why: the site is a client-rendered React app, so without this every URL
// returns the same empty index.html and search engines and AI crawlers that do
// not run JavaScript (or run it late) see no title, description, canonical,
// heading or copy for the page. After this step each URL serves its real
// content in the first response; React then attaches to it in the browser.
//
// Runs as the last step of `npm run build`:
//   vite build                      -> dist/           (the browser app)
//   vite build --ssr ...            -> dist-ssr/       (the same app, for Node)
//   node scripts/prerender.mjs      -> dist/<route>/index.html for each route
//
// To pre-render a new page, add it to public/sitemap.xml. Nothing else to do.
// URLs that are not in the sitemap (e.g. /work/<slug>) are served the empty
// shell, dist/shell.html, and render in the browser as before (vercel.json).

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Render with React's production build, as the browser bundle does.
process.env.NODE_ENV = "production";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE = "https://www.fmconsultingza.co.za";

const sitemap = readFileSync(join(root, "public", "sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => {
  const url = new URL(m[1]);
  if (url.origin !== SITE) throw new Error(`Sitemap URL is not on ${SITE}: ${m[1]}`);
  return url.pathname;
});

const template = readFileSync(join(dist, "index.html"), "utf8");
if (!template.includes('<div id="root"></div>')) {
  throw new Error("dist/index.html has no empty #root; has it already been pre-rendered?");
}

// Keep the untouched shell for every URL that is not pre-rendered.
writeFileSync(join(dist, "shell.html"), template);

const { render } = await import(pathToFileURL(join(root, "dist-ssr", "entry-server.js")).href);

// React puts the page's <title>, <meta> and <link> tags at the very front of
// the rendered string. Peel them off so they can go into <head>.
const HEAD_TAG = /^(?:<title[^>]*>[\s\S]*?<\/title>|<meta[^>]*\/?>|<link[^>]*\/?>)/;
function splitHead(html) {
  const head = [];
  let rest = html;
  // data-prerendered lets src/main.tsx find and remove these tags on the
  // visits where it renders from scratch instead of attaching to this HTML.
  for (let m; (m = rest.match(HEAD_TAG)); rest = rest.slice(m[0].length)) {
    head.push(m[0].replace(/^<(\w+)/, "<$1 data-prerendered"));
  }
  return { head, body: rest };
}

// The template's default <title> and description are replaced by the page's own.
const stripDefaults = (html) =>
  html.replace(/\s*<title>[\s\S]*?<\/title>/, "").replace(/\s*<meta name="description"[^>]*>/, "");

const problems = [];
for (const route of routes) {
  const { head, body } = splitHead(render(route));
  const headHtml = head.join("\n    ");

  const canonical = `<link data-prerendered rel="canonical" href="${SITE}${route}"/>`;
  if (!/<title data-prerendered>[^<]+<\/title>/.test(headHtml)) problems.push(`${route}: no <title>`);
  if (!headHtml.includes('<meta data-prerendered name="description"')) problems.push(`${route}: no meta description`);
  if (!headHtml.includes(canonical)) problems.push(`${route}: canonical is missing or does not match the URL`);
  if ((body.match(/<h1[\s>]/g) || []).length !== 1) problems.push(`${route}: expected exactly one <h1>`);

  const html = stripDefaults(template)
    .replace("</head>", `  ${headHtml}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);

  const file = route === "/" ? join(dist, "index.html") : join(dist, route, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log(`pre-rendered ${route}  (${(html.length / 1024).toFixed(0)} kB)`);
}

rmSync(join(root, "dist-ssr"), { recursive: true, force: true });

if (problems.length) {
  console.error(`\nPre-render checks failed:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`\n${routes.length} routes pre-rendered.`);
