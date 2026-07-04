#!/usr/bin/env node
/**
 * Post-implementation SEO QA for Chania Shore Excursions static export.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "out");
const SITE_URL = "https://chaniashoreexcursions.com";

const results = [];
const pass = (msg) => results.push({ status: "PASS", msg });
const fail = (msg) => results.push({ status: "FAIL", msg });
const info = (msg) => results.push({ status: "INFO", msg });

function walkHtml(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkHtml(p, files);
    else if (name.endsWith(".html")) files.push(p);
  }
  return files;
}

function readText(path) {
  return readFileSync(path, "utf8");
}

if (!existsSync(OUT)) {
  fail("out/ directory missing — run npm run build first");
} else {
  pass("Production build output (out/) exists");
}

const htmlFiles = walkHtml(OUT);
const noindexPages = [];
const indexedPages = [];
for (const file of htmlFiles) {
  const rel = file.replace(OUT, "").replace(/\\/g, "/").replace(/\/index\.html$/, "/").replace(/\.html$/, "/");
  const html = readText(file);
  const isNoindex = /noindex/i.test(html) && /robots/i.test(html);
  const isLegal = rel.includes("/privacy") || rel.includes("/terms");
  const is404 = rel.includes("404") || rel.includes("_not-found");
  if (isNoindex) noindexPages.push(rel);
  else if (!is404) indexedPages.push(rel);
  if (isNoindex && !isLegal && !is404) {
    fail(`Unexpected noindex on public page: ${rel}`);
  }
}
if (noindexPages.filter((p) => p.includes("privacy") || p.includes("/terms")).length >= 2) {
  pass("Privacy and Terms correctly use noindex");
}
const important = [
  "/",
  "/shore-excursions/",
  "/cruise-port-guide/",
  "/cruise-planner/",
  "/faq/",
  "/shore-excursions/agia-triada-monastery-and-chania/",
  "/why-agia-triada-is-our-editors-choice/",
  "/venetian-harbour-guide/",
  "/best-things-to-do-in-chania-from-a-cruise-ship/",
];
for (const p of important) {
  if (indexedPages.some((ip) => ip === p || ip.endsWith(p))) pass(`Important page indexable: ${p}`);
  else fail(`Important page missing or noindex: ${p}`);
}

let canonicalIssues = 0;
for (const file of htmlFiles) {
  const html = readText(file);
  const canonMatch = html.match(/rel="canonical"[^>]*href="([^"]+)"/);
  if (canonMatch) {
    const url = canonMatch[1];
    if (!url.startsWith(SITE_URL)) {
      fail(`Non-preferred canonical: ${url} in ${file}`);
      canonicalIssues++;
    } else if (url.includes("www.")) {
      fail(`WWW in canonical: ${url}`);
      canonicalIssues++;
    }
  }
}
if (canonicalIssues === 0) pass("Canonical tags point to https://chaniashoreexcursions.com (non-www)");

const redirects = readText(join(ROOT, "public/_redirects"));
if (redirects.includes("www.chaniashoreexcursions.com") && redirects.includes("301")) {
  pass("WWW → non-WWW redirects configured in public/_redirects");
} else {
  fail("WWW → non-WWW redirects missing from public/_redirects");
}
if (redirects.includes("http://chaniashoreexcursions.com")) {
  pass("HTTP → HTTPS redirect fallback configured");
} else {
  info("HTTP → HTTPS handled by Cloudflare; defensive redirect present check optional");
}

const sitemapPath = join(OUT, "sitemap.xml");
if (existsSync(sitemapPath)) {
  const sitemap = readText(sitemapPath);
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const badUrls = urls.filter((u) => u.includes("www.") || !u.startsWith(SITE_URL));
  const hasPrivacy = urls.some((u) => u.includes("/privacy"));
  const hasTerms = urls.some((u) => u.includes("/terms"));
  if (badUrls.length === 0) pass(`Sitemap contains ${urls.length} canonical URLs`);
  else fail(`Sitemap has non-canonical URLs: ${badUrls.join(", ")}`);
  if (!hasPrivacy && !hasTerms) pass("Sitemap excludes noindex legal pages (privacy, terms)");
  else fail("Sitemap incorrectly includes privacy/terms");
} else {
  fail("sitemap.xml missing from out/");
}

const robotsPath = join(OUT, "robots.txt");
if (existsSync(robotsPath)) {
  const robots = readText(robotsPath);
  if (/Allow:\s*\//i.test(robots) || !/Disallow:\s*\//.test(robots)) {
    pass("robots.txt allows public pages to be crawled");
  } else {
    fail("robots.txt may block crawling");
  }
  if (robots.includes("sitemap")) pass("robots.txt references sitemap");
} else {
  fail("robots.txt missing from out/");
}

const titles = new Map();
for (const file of htmlFiles) {
  const html = readText(file);
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    const t = titleMatch[1].trim();
    const rel = file.replace(OUT, "");
    if (!titles.has(t)) titles.set(t, []);
    titles.get(t).push(rel);
  }
}
const dupes = [...titles.entries()].filter(([t, files]) => files.length > 1 && !t.includes("404"));
if (dupes.length === 0) pass("No duplicate page titles detected");
else dupes.forEach(([t, files]) => fail(`Duplicate title "${t}": ${files.join(", ")}`));

let jsonLdCount = 0;
let jsonLdErrors = 0;
for (const file of htmlFiles) {
  const html = readText(file);
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const m of scripts) {
    jsonLdCount++;
    try {
      const data = JSON.parse(m[1]);
      if (!data["@context"] || !data["@type"]) jsonLdErrors++;
    } catch {
      jsonLdErrors++;
    }
  }
}
if (jsonLdErrors === 0) pass(`JSON-LD valid in ${jsonLdCount} blocks sampled across pages`);
else fail(`JSON-LD parse/structure errors: ${jsonLdErrors}`);

const homeHtml = existsSync(join(OUT, "index.html")) ? readText(join(OUT, "index.html")) : "";
if (homeHtml.includes('property="og:title"') && homeHtml.includes('property="og:url"')) {
  pass("Open Graph metadata present on homepage");
} else {
  fail("Open Graph metadata missing on homepage");
}

info("Intentional noindex pages: /privacy/, /terms/, 404/not-found");
info("Intentional redirects: www→non-www, http→https via Cloudflare + _redirects");

console.log("\n=== SEO QA Report ===\n");
for (const r of results) {
  console.log(`[${r.status}] ${r.msg}`);
}
const failures = results.filter((r) => r.status === "FAIL");
console.log(`\n${results.filter((r) => r.status === "PASS").length} passed, ${failures.length} failed, ${results.filter((r) => r.status === "INFO").length} informational`);
process.exit(failures.length ? 1 : 0);
