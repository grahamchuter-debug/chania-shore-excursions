#!/usr/bin/env node
/**
 * Guards the ranking elements of protected pages against a committed snapshot.
 *
 *   node scripts/ranking-check.mjs check [outDir]      compare out/ with scripts/ranking-baseline.json (exit 1 on any change)
 *   node scripts/ranking-check.mjs snapshot <outDir>   rewrite the snapshot from a reviewed export
 *
 * Every protected page keeps its title, meta description, canonical, robots and H1. The Ancient Aptera
 * excursion additionally keeps its opening paragraph, FAQ section, JSON-LD (except the sitewide
 * TravelAgency block) and all visible text outside the "Related guides" list.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { extractPage, htmlRoutes, sha256 } from "./lib/html-extract.mjs";

const ROOT = join(import.meta.dirname, "..");
const SNAPSHOT = join(ROOT, "scripts/ranking-baseline.json");
const APTERA = "/shore-excursions/ancient-aptera-excursion/";
const PROTECTED = [
  "/",
  "/shore-excursions/",
  APTERA,
  "/cruise-port-guide/",
  "/chania-old-town-walking-guide/",
  "/ancient-aptera/",
  "/ship-schedules/",
];
const isProtected = (route) => PROTECTED.includes(route) || route.startsWith("/ship-schedules/chania/");
const SITEWIDE_JSON_LD = new Set(["TravelAgency"]);

function withoutRelatedGuides(text) {
  return text.replace(/ Related guides .*? Related excursions /, " Related excursions ");
}

function rankingElements(route, html) {
  const p = extractPage(html);
  const elements = { title: p.title, metaDescription: p.metaDescription, canonical: p.canonical, robots: p.robots, h1: p.h1 };
  if (route === APTERA) {
    elements.lead = p.lead;
    elements.faqSectionSha256 = p.faqSection && sha256(p.faqSection);
    elements.jsonLdSha256 = Object.fromEntries(p.jsonLd.filter((b) => !SITEWIDE_JSON_LD.has(b.type)).map((b) => [b.type, sha256(b.raw)]));
    elements.textOutsideRelatedGuidesSha256 = sha256(withoutRelatedGuides(p.text));
  }
  return elements;
}

function collect(outDir) {
  const pages = {};
  for (const [route, file] of [...htmlRoutes(outDir)].sort(([a], [b]) => a.localeCompare(b))) {
    if (isProtected(route)) pages[route] = rankingElements(route, readFileSync(file, "utf8"));
  }
  return pages;
}

const [mode = "check", outArg] = process.argv.slice(2);
const outDir = outArg ?? join(ROOT, "out");
if (!existsSync(outDir)) {
  console.error(`No export at ${outDir}; run npm run build first.`);
  process.exit(1);
}

if (mode === "snapshot") {
  const pages = collect(outDir);
  writeFileSync(SNAPSHOT, JSON.stringify({ source: outDir, pages }, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(pages).length} protected pages to ${SNAPSHOT}`);
  process.exit(0);
}

const expected = JSON.parse(readFileSync(SNAPSHOT, "utf8")).pages;
const actual = collect(outDir);
const failures = [];
for (const [route, want] of Object.entries(expected)) {
  const got = actual[route];
  if (!got) {
    failures.push(`${route}: page missing`);
    continue;
  }
  for (const key of Object.keys(want)) {
    if (JSON.stringify(want[key]) !== JSON.stringify(got[key])) {
      failures.push(`${route}: ${key} changed\n    was: ${JSON.stringify(want[key])}\n    now: ${JSON.stringify(got[key])}`);
    }
  }
}
for (const route of Object.keys(actual)) if (!expected[route]) failures.push(`${route}: new protected page not in snapshot`);

const count = Object.keys(expected).length;
if (failures.length) {
  console.error(`Ranking check FAILED (${failures.length} change(s) across ${count} protected pages):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`Ranking check passed: ${count} protected pages unchanged (title, meta description, canonical, robots, H1; Aptera lead, FAQ, JSON-LD, body text).`);
