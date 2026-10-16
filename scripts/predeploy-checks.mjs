#!/usr/bin/env node
/**
 * Checks the built export (out/) before a production deploy:
 *   - _headers sends X-Robots-Tag: noindex on *.pages.dev only
 *   - /enquire/ posts to the shared enquiry service (production endpoint, siteId chania), with every field named
 *   - every excursion page links its related guides and carries its slug on the enquiry link
 *   - the schedule hub ships no build-day Today & Tomorrow data
 *   - no Italian / IT contact details left in the schema
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { htmlRoutes } from "./lib/html-extract.mjs";

const ROOT = join(import.meta.dirname, "..");
const OUT = process.argv[2] ?? join(ROOT, "out");
const PROD_ENDPOINT = "https://wowatour-enquiries.dark-violet-8d91.workers.dev/v1/enquiries";

const results = [];
const check = (ok, msg) => results.push({ ok, msg });
const read = (rel) => readFileSync(join(OUT, rel), "utf8");

if (!existsSync(OUT)) {
  console.error(`No export at ${OUT}; run npm run build first.`);
  process.exit(1);
}
const routes = htmlRoutes(OUT);

// pages.dev noindex
const headers = existsSync(join(OUT, "_headers")) ? read("_headers") : "";
const rules = headers.split(/\n(?=\S)/).map((block) => block.trim()).filter((b) => b && !b.startsWith("#"));
const noindexHosts = rules.filter((r) => /X-Robots-Tag:\s*noindex/i.test(r)).map((r) => r.split("\n")[0].trim());
check(
  noindexHosts.includes("https://:project.pages.dev/*") && noindexHosts.includes("https://:version.:project.pages.dev/*"),
  "_headers: X-Robots-Tag noindex for *.pages.dev and *.<project>.pages.dev",
);
check(noindexHosts.every((h) => h.includes(".pages.dev/")), "_headers: no noindex rule for the custom domains or paths");

// enquiry form
const enquire = read("enquire/index.html");
const form = enquire.match(/<form[^>]*>[\s\S]*?<\/form>/)?.[0] ?? "";
check(form && !/mailto:/i.test(form.match(/<form[^>]*>/)[0]) && /method="post"/.test(form), "/enquire/: form has no mailto action and uses method=post");
const names = [...form.matchAll(/<(?:input|textarea|select)[^>]*\sname="([^"]+)"/g)].map((m) => m[1]);
for (const field of ["name", "email", "productRef", "message", "website"]) check(names.includes(field), `/enquire/: field "${field}" is named and submitted`);
const excursionRoutes = [...routes.keys()].filter((r) => /^\/shore-excursions\/[^/]+\/$/.test(r));
const optionValues = [...form.matchAll(/<option value="([^"]*)"/g)].map((m) => m[1]);
const slugs = excursionRoutes.map((r) => r.split("/")[2]).sort();
check(
  JSON.stringify(optionValues.filter(Boolean).sort()) === JSON.stringify(slugs) && optionValues[0] === "",
  `/enquire/: excursion options are the general option plus all ${slugs.length} excursions`,
);
check(/<meta name="robots" content="index, follow"\/>/.test(enquire) && enquire.includes('<link rel="canonical" href="https://chaniashoreexcursions.com/enquire/"/>'), "/enquire/: canonical /enquire/, index, follow");
const chunkDir = join(OUT, "_next/static/chunks");
const js = readdirSync(chunkDir).filter((f) => f.endsWith(".js")).map((f) => readFileSync(join(chunkDir, f), "utf8")).join("\n");
check(js.includes(PROD_ENDPOINT), "client JS posts to the production enquiry endpoint");
check(!/https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)[:/]/.test(js) && !/enquiries\.test\//.test(js), "client JS contains no loopback or test endpoint");
check(/"chania"/.test(js), 'client JS sends siteId "chania"');

// excursion pages
for (const route of excursionRoutes) {
  const html = read(route.slice(1) + "index.html");
  const slug = route.split("/")[2];
  const section = html.match(/Related guides<\/h2>([\s\S]*?)<\/div><\/div>/)?.[1] ?? "";
  const links = [...section.matchAll(/class="nav-card" href="([^"]+)"/g)].map((m) => m[1]);
  check(links.length > 0 && links.every((h) => routes.has(h)), `${route}: ${links.length} related guide link(s), all to existing pages`);
  check(html.includes(`href="/enquire/?tour=${slug}"`), `${route}: enquiry link carries ?tour=${slug}`);
}
check(read("shore-excursions/ancient-aptera-excursion/index.html").includes('class="nav-card" href="/ancient-aptera/"'), "Ancient Aptera excursion links to /ancient-aptera/");

// schedule hub
const hub = read("ship-schedules/chania/index.html");
check(hub.includes('data-today-tomorrow="pending"') && !/Today&#x27;s Ships|Tomorrow&#x27;s Ships/.test(hub), "/ship-schedules/chania/: Today & Tomorrow computed in the browser, no build-day data in HTML");

// schema
const italian = [...routes].filter(([, f]) => /Italian|"areaServed":"IT"/.test(readFileSync(f, "utf8"))).map(([r]) => r);
check(italian.length === 0, `no Italian / areaServed IT in any page${italian.length ? `: ${italian.join(", ")}` : ""}`);

for (const r of results) console.log(`[${r.ok ? "PASS" : "FAIL"}] ${r.msg}`);
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
