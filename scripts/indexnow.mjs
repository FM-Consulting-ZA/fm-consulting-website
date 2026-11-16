#!/usr/bin/env node
// IndexNow submitter for fmconsultingza.co.za
//
// Tells Bing (and the other IndexNow engines: Yandex, Seznam, Naver, Yep)
// that pages have been added or changed, so they recrawl within hours
// instead of waiting for a scheduled crawl.
//
// Usage (run from the repo root, after the change is live on Vercel):
//   npm run indexnow                       -> submits every URL in public/sitemap.xml
//   npm run indexnow -- /pricing /work     -> submits only these paths
//
// Only submit pages that are live and have actually changed. Re-submitting
// unchanged pages over and over can get the key throttled.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HOST = "www.fmconsultingza.co.za";
const KEY = "8ba459a213056db754d5a501192e22f5";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function urlsFromSitemap() {
  const xml = readFileSync(join(root, "public", "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

function normalise(arg) {
  if (/^https?:\/\//.test(arg)) return arg;
  return `https://${HOST}${arg.startsWith("/") ? "" : "/"}${arg}`;
}

const args = process.argv.slice(2);
const urlList = args.length ? args.map(normalise) : urlsFromSitemap();

const offHost = urlList.filter((u) => new URL(u).host !== HOST);
if (offHost.length) {
  console.error(`These URLs are not on ${HOST} and would be rejected:\n${offHost.join("\n")}`);
  process.exit(1);
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
});

const meaning = {
  200: "OK, URLs submitted",
  202: "Accepted, key validation pending",
  400: "Bad request",
  403: "Key not valid (key file missing or does not match)",
  422: "URLs do not belong to the host, or key does not match",
  429: "Too many requests, back off",
};

console.log(`${res.status} ${meaning[res.status] ?? res.statusText} (${urlList.length} URLs)`);
if (res.status >= 400) {
  console.log(await res.text());
  process.exit(1);
}
