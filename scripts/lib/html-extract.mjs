/**
 * Regex-based extraction of the SEO-relevant parts of a static-export page, shared by
 * scripts/ranking-check.mjs and scripts/compare-out.mjs. Built for this site's own markup only.
 */
import { createHash } from "node:crypto";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ENTITIES = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#x27;": "'", "&#39;": "'", "&nbsp;": " " };

export function decode(s) {
  return s.replace(/&(amp|lt|gt|quot|#x27|#39|nbsp);/g, (m) => ENTITIES[m]);
}

export function sha256(s) {
  return createHash("sha256").update(s).digest("hex");
}

export function visibleText(html) {
  const body = html.replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, " ").replace(/<!--[\s\S]*?-->/g, "");
  return decode(body.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function first(html, re) {
  return html.match(re)?.[1] ?? null;
}

export function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    let type = "unparseable";
    try {
      type = JSON.parse(m[1])["@type"] ?? "untyped";
    } catch {}
    return { type, raw: m[1] };
  });
}

export function extractPage(html) {
  return {
    title: first(html, /<title[^>]*>([\s\S]*?)<\/title>/),
    metaDescription: first(html, /<meta name="description" content="([^"]*)"/),
    canonical: first(html, /<link rel="canonical" href="([^"]*)"/),
    robots: first(html, /<meta name="robots" content="([^"]*)"/),
    h1: [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1]),
    lead: first(html, /<p class="text-lg leading-relaxed text-gray-700">([\s\S]*?)<\/p>/),
    faqSection: first(html, /(<section><h2 class="section-title text-2xl sm:text-3xl mb-8">[\s\S]*?<\/section>)/),
    jsonLd: jsonLdBlocks(html),
    text: visibleText(html),
  };
}

/** Route ("/foo/") for every index.html / *.html under an export directory. */
export function htmlRoutes(outDir) {
  const routes = new Map();
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) {
        if (name !== "_next") walk(p);
      } else if (name.endsWith(".html")) {
        const rel = "/" + relative(outDir, p).replace(/\\/g, "/");
        const route = rel.endsWith("/index.html") ? rel.slice(0, -"index.html".length) : rel;
        routes.set(route, p);
      }
    }
  };
  walk(outDir);
  return routes;
}

export function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
}

/** Word-level differences between two texts as [removed, added] snippets. */
export function textDiff(a, b, maxRegions = 12) {
  const wa = a.split(" ");
  const wb = b.split(" ");
  let start = 0;
  while (start < wa.length && start < wb.length && wa[start] === wb[start]) start++;
  let endA = wa.length;
  let endB = wb.length;
  while (endA > start && endB > start && wa[endA - 1] === wb[endB - 1]) {
    endA--;
    endB--;
  }
  const midA = wa.slice(start, endA);
  const midB = wb.slice(start, endB);
  if (!midA.length && !midB.length) return [];
  if (midA.length * midB.length > 4_000_000) return [[midA.join(" "), midB.join(" ")]];
  const n = midA.length;
  const m = midB.length;
  const lcs = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = midA[i] === midB[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const regions = [];
  let i = 0;
  let j = 0;
  let removed = [];
  let added = [];
  const flush = () => {
    if (removed.length || added.length) regions.push([removed.join(" "), added.join(" ")]);
    removed = [];
    added = [];
  };
  while (i < n || j < m) {
    if (i < n && j < m && midA[i] === midB[j]) {
      flush();
      i++;
      j++;
    } else if (j < m && (i === n || lcs[i][j + 1] >= lcs[i + 1][j])) {
      added.push(midB[j++]);
    } else {
      removed.push(midA[i++]);
    }
  }
  flush();
  return regions.slice(0, maxRegions);
}
