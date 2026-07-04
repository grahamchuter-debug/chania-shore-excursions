#!/usr/bin/env node
/** Download Chania site images from verified Wikimedia URLs (rate-limit friendly). */
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

const OUT = "public/images";
const UA = "chania-shore-excursions/1.0 (image fetch; contact webmaster)";
const FORCE = process.argv.includes("--force");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const images = {
  "venetian-harbour.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Chania%2C_old_harbour_2019a.jpg/1920px-Chania%2C_old_harbour_2019a.jpg",
  "lighthouse.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Lighthouse_in_Chania._Crete%2C_Greece.jpg/1920px-Lighthouse_in_Chania._Crete%2C_Greece.jpg",
  "agia-triada.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Agia_Triada_Monastery%2C_Crete%2C_Greece.jpg/1920px-Agia_Triada_Monastery%2C_Crete%2C_Greece.jpg",
  "olive-grove.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Kreta_%28GR%29%2C_Asomatos%2C_Olivenhain_--_2023_--_8518.jpg/1920px-Kreta_%28GR%29%2C_Asomatos%2C_Olivenhain_--_2023_--_8518.jpg",
  "old-town.jpg": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Picturesque_alley_in_Chania.jpg",
  "market.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Market_Hall_Chania_02.JPG/1920px-Market_Hall_Chania_02.JPG",
  "cretan-food.jpg": "https://upload.wikimedia.org/wikipedia/commons/9/95/Koukouvagia.jpg",
  "cretan-wine.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Vin_ros%C3%A9_de_Cr%C3%A8te.jpg/1920px-Vin_ros%C3%A9_de_Cr%C3%A8te.jpg",
  "ancient-aptera.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Aptera_-_Akrotiri_und_Ruinen.jpg/1920px-Aptera_-_Akrotiri_und_Ruinen.jpg",
  "village.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/KrTheriso.jpg/1920px-KrTheriso.jpg",
  "beach.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/%CE%95%CE%BB%CE%B1%CF%86%CE%BF%CE%BD%CE%AE%CF%83%CE%B9_1275.jpg/1920px-%CE%95%CE%BB%CE%B1%CF%86%CE%BF%CE%BD%CE%AE%CF%83%CE%B9_1275.jpg",
  "chania.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Greece_Crete_Chania_Falasarna.jpg/1920px-Greece_Crete_Chania_Falasarna.jpg",
  "white-mountains.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/White_Mountains_-_panoramio.jpg/1920px-White_Mountains_-_panoramio.jpg",
  "family.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Chania%2C_old_harbour_with_lighthouse_2019.jpg/1920px-Chania%2C_old_harbour_with_lighthouse_2019.jpg",
  "private.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Chania_-_Kr%C3%A9ta_-_panoramio_%282%29.jpg/1920px-Chania_-_Kr%C3%A9ta_-_panoramio_%282%29.jpg",
  "history.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Firkas_Fortress_in_Chania%2C_Crete%2C_Greece.jpg/1920px-Firkas_Fortress_in_Chania%2C_Crete%2C_Greece.jpg",
  "cruise-port.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/MWR_Tour_during_Souda_Bay%2C_Greece%2C_June_6%2C_2017.jpg/1920px-MWR_Tour_during_Souda_Bay%2C_Greece%2C_June_6%2C_2017.jpg",
  "hero-home.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Old_harbour_and_lighthouse_at_sunset%2C_Chania%2C_Crete%2C_Greece_julesvernex2.jpg/1920px-Old_harbour_and_lighthouse_at_sunset%2C_Chania%2C_Crete%2C_Greece_julesvernex2.jpg",
  "og-default.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Kreta_%28GR%29%2C_Chania%2C_Hafen_--_2023_--_8532.jpg/1920px-Kreta_%28GR%29%2C_Chania%2C_Hafen_--_2023_--_8532.jpg",
};

function md5(buf) {
  return createHash("md5").update(buf).digest("hex");
}

async function download(url, retries = 4) {
  for (let i = 0; i < retries; i++) {
    await sleep(1500 + i * 2000);
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.status === 429) continue;
    if (!res.ok) return { ok: false, status: res.status };
    const buf = Buffer.from(await res.arrayBuffer());
    return { ok: true, buf };
  }
  return { ok: false, status: 429 };
}

async function main() {
  const hashes = new Map();
  let dupes = 0;
  let failed = 0;

  for (const [file, url] of Object.entries(images)) {
    const dest = join(OUT, file);
    if (!FORCE && existsSync(dest) && readFileSync(dest).length > 25000) {
      const hash = md5(readFileSync(dest));
      if (!hashes.has(hash)) hashes.set(hash, file);
      console.log(`skip ${file} (exists)`);
      continue;
    }

    const result = await download(url);
    if (!result.ok) {
      console.error(`FAIL ${file} HTTP ${result.status}`);
      failed++;
      continue;
    }
    const { buf } = result;
    if (buf.length < 10000) {
      console.error(`FAIL ${file} too small`);
      failed++;
      continue;
    }
    const hash = md5(buf);
    if (hashes.has(hash)) {
      console.error(`DUPLICATE ${file} same as ${hashes.get(hash)}`);
      dupes++;
      failed++;
      continue;
    }
    hashes.set(hash, file);
    writeFileSync(dest, buf);
    console.log(`ok ${file} (${Math.round(buf.length / 1024)}KB)`);
  }

  console.log(`\n${hashes.size} unique / ${Object.keys(images).length} targets (${dupes} duplicates, ${failed} failed)`);
  if (dupes > 0 || hashes.size < Object.keys(images).length) process.exit(1);
}

main();
