#!/usr/bin/env node
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

const OUT = "public/images";
const UA = "chania-shore-excursions/1.0 (image fetch; contact webmaster)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const needed = {
  "agia-triada.jpg": ["Agia Triada Monastery Crete", "Moni Agia Triada Chania"],
  "chania.jpg": ["Greece Crete Chania Falasarna", "Chania Crete aerial"],
  "history.jpg": ["Firkas Fortress Chania Crete", "Yiali Tzami Chania"],
  "private.jpg": ["Chania Kréta panoramio", "Crete mountain road landscape"],
};

function md5(buf) {
  return createHash("md5").update(buf).digest("hex");
}

async function searchUrl(term) {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo" +
    "&generator=search&gsrnamespace=6&gsrlimit=5" +
    `&gsrsearch=${encodeURIComponent(term)}` +
    "&iiprop=url|mime|size&iiurlwidth=1600";
  await sleep(3000);
  const res = await fetch(api, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii || !/jpe?g/i.test(ii.mime || "")) continue;
    return ii.thumburl || ii.url;
  }
  return null;
}

async function download(url) {
  await sleep(4000);
  for (let i = 0; i < 5; i++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.status === 429) {
      await sleep(8000 * (i + 1));
      continue;
    }
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  }
  return null;
}

async function main() {
  const used = new Set();
  for (const f of [
    "venetian-harbour.jpg", "lighthouse.jpg", "olive-grove.jpg", "old-town.jpg",
    "market.jpg", "cretan-food.jpg", "cretan-wine.jpg", "ancient-aptera.jpg",
    "village.jpg", "beach.jpg", "white-mountains.jpg", "family.jpg",
    "cruise-port.jpg", "hero-home.jpg", "og-default.jpg",
  ]) {
    const p = join(OUT, f);
    if (existsSync(p)) used.add(md5(readFileSync(p)));
  }

  for (const [file, terms] of Object.entries(needed)) {
    const dest = join(OUT, file);
    if (existsSync(dest) && readFileSync(dest).length > 25000) {
      console.log(`skip ${file}`);
      continue;
    }
    let url = null;
    for (const term of terms) {
      url = await searchUrl(term);
      if (url) break;
    }
    if (!url) {
      console.error(`FAIL ${file} — no API result`);
      continue;
    }
    const buf = await download(url);
    if (!buf || buf.length < 15000) {
      console.error(`FAIL ${file} — download failed`);
      continue;
    }
    const hash = md5(buf);
    if (used.has(hash)) {
      console.error(`FAIL ${file} — duplicate of existing image`);
      continue;
    }
    used.add(hash);
    writeFileSync(dest, buf);
    console.log(`ok ${file} (${Math.round(buf.length / 1024)}KB)`);
  }
}

main();
