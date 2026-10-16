#!/usr/bin/env node
/**
 * Per-page comparison of two static exports (e.g. the production baseline and a new build).
 *
 *   node scripts/compare-out.mjs <baselineDir> [newDir=out]
 *
 * Ignores build IDs, hashed chunk names and sitemap lastmod. Reports the HTML route set, sitemap URL
 * set, robots.txt, _headers and _redirects, then for every changed page which SEO elements changed
 * (title, meta description, canonical, robots, H1, JSON-LD types) and the visible-text differences.
 * Exits 1 if routes, sitemap URLs or robots.txt differ.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { extractPage, htmlRoutes, sitemapUrls, textDiff } from "./lib/html-extract.mjs";

const [baseDir, newDir = join(import.meta.dirname, "..", "out")] = process.argv.slice(2);
if (!baseDir || !existsSync(baseDir) || !existsSync(newDir)) {
  console.error("usage: node scripts/compare-out.mjs <baselineDir> [newDir=out]");
  process.exit(2);
}

const read = (dir, rel) => (existsSync(join(dir, rel)) ? readFileSync(join(dir, rel), "utf8") : null);
const buildId = (html) => html.match(/\\"b\\":\\"([A-Za-z0-9_-]{10,})\\"/)?.[1];
const CHUNK = /(\/?_next\/)?static\/chunks\/[A-Za-z0-9_\-~.]+?\.(js|css)/g;
function normalise(html, id) {
  let s = html.replace(CHUNK, "static/chunks/H.$2");
  if (id) s = s.split(id).join("BUILDID");
  return s;
}

const failures = [];
const lines = [];
const out = (s = "") => lines.push(s);

const baseRoutes = htmlRoutes(baseDir);
const newRoutes = htmlRoutes(newDir);
const onlyBase = [...baseRoutes.keys()].filter((r) => !newRoutes.has(r));
const onlyNew = [...newRoutes.keys()].filter((r) => !baseRoutes.has(r));
out(`HTML routes: baseline ${baseRoutes.size}, new ${newRoutes.size}`);
if (onlyBase.length || onlyNew.length) {
  failures.push("HTML route set changed");
  out(`  removed: ${onlyBase.join(", ") || "none"}\n  added: ${onlyNew.join(", ") || "none"}`);
}

const smBase = sitemapUrls(read(baseDir, "sitemap.xml") ?? "");
const smNew = sitemapUrls(read(newDir, "sitemap.xml") ?? "");
const smSame = JSON.stringify(smBase) === JSON.stringify(smNew);
out(`Sitemap URLs: baseline ${smBase.length}, new ${smNew.length}, ${smSame ? "identical set" : "DIFFERENT"}`);
if (!smSame) failures.push("sitemap URL set changed");

const robotsSame = read(baseDir, "robots.txt") === read(newDir, "robots.txt");
out(`robots.txt: ${robotsSame ? "identical" : "DIFFERENT"}`);
if (!robotsSame) failures.push("robots.txt changed");
for (const f of ["_headers", "_redirects"]) {
  const a = read(baseDir, f);
  const b = read(newDir, f);
  out(`${f}: ${a === b ? "identical" : a === null ? "added" : b === null ? "REMOVED" : "changed"}`);
  if (a !== b && b !== null) out(b.split("\n").map((l) => `    ${l}`).join("\n"));
}

const idBase = buildId(read(baseDir, "index.html") ?? "");
const idNew = buildId(read(newDir, "index.html") ?? "");
let identical = 0;
const markupOnly = [];
const changed = [];
for (const [route, baseFile] of baseRoutes) {
  const newFile = newRoutes.get(route);
  if (!newFile) continue;
  const a = readFileSync(baseFile, "utf8");
  const b = readFileSync(newFile, "utf8");
  if (normalise(a, idBase) === normalise(b, idNew)) {
    identical++;
    continue;
  }
  const pa = extractPage(a);
  const pb = extractPage(b);
  const fields = ["title", "metaDescription", "canonical", "robots", "h1"].filter((k) => JSON.stringify(pa[k]) !== JSON.stringify(pb[k]));
  const typesA = new Map(pa.jsonLd.map((x) => [x.type, x.raw]));
  const typesB = new Map(pb.jsonLd.map((x) => [x.type, x.raw]));
  const jsonLd = [...new Set([...typesA.keys(), ...typesB.keys()])].filter((t) => typesA.get(t) !== typesB.get(t));
  const text = textDiff(pa.text, pb.text);
  if (!fields.length && !jsonLd.length && !text.length) markupOnly.push(route);
  else changed.push({ route, fields, jsonLd, text });
}

out();
out(`Pages identical after normalisation: ${identical}`);
out(`Pages with markup/attribute changes only (no SEO field, JSON-LD or visible-text change): ${markupOnly.length}`);
if (markupOnly.length) out(`  ${markupOnly.join(", ")}`);
out(`Pages with SEO-field, JSON-LD or visible-text changes: ${changed.length}`);

const sitewide = new Map();
for (const c of changed) for (const t of c.jsonLd) sitewide.set(t, (sitewide.get(t) ?? 0) + 1);
if (sitewide.size) out(`  JSON-LD blocks changed (pages): ${[...sitewide].map(([t, n]) => `${t} ${n}`).join(", ")}`);
for (const c of changed) {
  if (!c.fields.length && !c.text.length) continue;
  out();
  out(`${c.route}${c.fields.length ? `  SEO FIELDS CHANGED: ${c.fields.join(", ")}` : ""}`);
  for (const [removed, added] of c.text) {
    out(`    - ${JSON.stringify(removed.slice(0, 300))}`);
    out(`    + ${JSON.stringify(added.slice(0, 300))}`);
  }
}
const jsonLdOnly = changed.filter((c) => !c.fields.length && !c.text.length).map((c) => c.route);
if (jsonLdOnly.length) {
  out();
  out(`JSON-LD-only changes (${jsonLdOnly.length} pages): ${jsonLdOnly.join(", ")}`);
}

console.log(lines.join("\n"));
if (failures.length) {
  console.error(`\nFAILED: ${failures.join("; ")}`);
  process.exit(1);
}
