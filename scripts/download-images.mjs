// Downloads Chania / Western Crete imagery from Wikimedia Commons into public/images.
import { writeFileSync, mkdirSync, existsSync, statSync, unlinkSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

const OUT = "public/images";
const FORCE = process.argv.includes("--force");
mkdirSync(OUT, { recursive: true });
const WIDTH = 1600;
const UA = "chania-shore-excursions/1.0 (image fetch; contact webmaster)";

/** Direct Wikimedia Commons filenames (without "File:" prefix) — tried before search terms. */
const directFiles = {
  "venetian-harbour.jpg": [
    "Chania, old harbour 2019a.jpg",
    "Chania, old harbour 2019d.jpg",
    "Panoramics on Chania Old Harbour (2).jpg",
  ],
  "lighthouse.jpg": [
    "Lighthouse in Chania. Crete, Greece.jpg",
    "Chania, old harbour with lighthouse 2019.jpg",
  ],
  "olive-grove.jpg": [
    "Kreta (GR), Asomatos, Olivenhain -- 2023 -- 8518.jpg",
    "Kreta (GR), Asomatos, Olivenhain -- 2023 -- 8519.jpg",
  ],
  "old-town.jpg": [
    "Picturesque alley in Chania.jpg",
    "Alley in Chania's old town.jpg",
    "Chania Zambeliou1.jpg",
  ],
  "market.jpg": [
    "Market Hall Chania 02.JPG",
    "Dimotiki Agora Chania.jpg",
  ],
  "village.jpg": [
    "KrTheriso.jpg",
    "Theriso house, Crete, Greece.JPG",
  ],
  "beach.jpg": [
    "Ελαφονήσι 1275.jpg",
    "Ελαφονήσι 8467.jpg",
  ],
  "family.jpg": [
    "Chania, old harbour with lighthouse 2019.jpg",
    "Chania 02.JPG",
    "Sunset Old Venetian Harbor (Chania Town, Greece).jpg",
  ],
  "private.jpg": [
    "Chania - Kréta - panoramio (2).jpg",
    "White Mountains - panoramio.jpg",
  ],
  "history.jpg": [
    "Firkas Fortress in Chania, Crete, Greece.jpg",
    "Chania - Mosque of the Janissaries.jpg",
  ],
  "hero-home.jpg": [
    "Old harbour and lighthouse at sunset, Chania, Crete, Greece julesvernex2.jpg",
    "Old harbour at sunset, Chania, Crete, Greece julesvernex2.jpg",
    "Sunset Old Venetian Harbor (Chania Town, Greece).jpg",
  ],
  "og-default.jpg": [
    "Kreta (GR), Chania, Hafen -- 2023 -- 8532.jpg",
    "Chania, old harbour 2019c.jpg",
  ],
  "chania.jpg": [
    "Greece Crete Chania Falasarna.jpg",
    "Chania - Kréta - panoramio (2).jpg",
  ],
};

/** Each target gets multiple search strategies — processed in order; first unique win. */
const targets = {
  "venetian-harbour.jpg": [
    "Chania Venetian port waterfront",
    "Old port Chania Crete colourful",
    "fileintitle:Chania Venetian harbour",
  ],
  "lighthouse.jpg": [
    "Chania lighthouse Crete",
    "Egyptian lighthouse Chania",
    "fileintitle:Chania lighthouse",
  ],
  "agia-triada.jpg": [
    "Agia Triada monastery Crete",
    "Moni Agia Triada Chania",
    "fileintitle:Agia Triada Crete",
  ],
  "olive-grove.jpg": [
    "Olive grove Crete Chania",
    "Crete olive trees Akrotiri",
    "Olive orchard Crete",
  ],
  "old-town.jpg": [
    "Chania Topanas alley Crete",
    "Chania old town narrow street",
    "fileintitle:Chania old town street",
  ],
  "market.jpg": [
    "Dimotiki Agora Chania market hall",
    "Chania municipal market interior",
    "fileintitle:Dimotiki Agora Chania",
  ],
  "cretan-food.jpg": [
    "Dakos Crete food",
    "Cretan meze olives",
    "Greek Cretan cuisine",
  ],
  "cretan-wine.jpg": [
    "Crete wine tasting",
    "Cretan wine vineyard",
    "Greek wine Crete",
  ],
  "ancient-aptera.jpg": [
    "Aptera ancient site Crete",
    "Ancient Aptera ruins",
    "fileintitle:Aptera Crete",
  ],
  "village.jpg": [
    "Therissos village Crete mountains",
    "Vamos village Crete traditional",
    "Argyroupoli Crete village",
  ],
  "beach.jpg": [
    "Elafonissi pink sand Crete",
    "Balos lagoon Gramvousa Crete aerial",
    "fileintitle:Elafonissi Crete",
  ],
  "chania.jpg": [
    "Chania Crete aerial",
    "Chania city Crete harbour",
    "fileintitle:Chania Crete",
  ],
  "white-mountains.jpg": [
    "White Mountains Crete Lefka Ori",
    "Lefka Ori Crete mountains",
    "Crete mountain panorama",
  ],
  "family.jpg": [
    "Chania harbour promenade cafes",
    "Chania old port waterfront people",
    "Crete harbour restaurant terrace",
  ],
  "private.jpg": [
    "Crete countryside road",
    "Western Crete landscape hills",
    "Crete rural road mountains",
  ],
  "history.jpg": [
    "Yiali Tzami Chania mosque harbour",
    "Firka fortress Chania Crete",
    "Chania Janissaries mosque",
  ],
  "cruise-port.jpg": [
    "Souda Bay Crete port",
    "Souda harbour Crete",
    "fileintitle:Souda bay",
  ],
  "hero-home.jpg": [
    "Chania harbour sunset Crete panorama",
    "Chania Venetian port evening",
    "Chania lighthouse harbour dusk",
  ],
  "og-default.jpg": [
    "Chania harbour aerial Crete",
    "Western Crete Chania coast",
    "Chania old port from sea",
  ],
};

const ALLOWED = new Set([...Object.keys(targets), "logo-mark.svg", "favicon.ico"]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function md5(buf) {
  return createHash("md5").update(buf).digest("hex");
}

async function fetchByFileTitle(fileTitle) {
  const normalized = "File:" + fileTitle.trim().replace(/ /g, "_");
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo" +
    `&titles=${encodeURIComponent(normalized)}` +
    `&iiprop=url|mime|size|thumburl&iiurlwidth=${WIDTH}`;
  await sleep(400);
  try {
    const res = await fetch(api, { headers: { "User-Agent": UA } });
    if (!res.ok) return [];
    const data = await res.json();
    const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
    const urls = [];
    for (const p of pages) {
      if (p.missing !== undefined) continue;
      const ii = p.imageinfo?.[0];
      if (!ii || !/jpe?g/i.test(ii.mime || "")) continue;
      urls.push(ii.thumburl || ii.url);
    }
    return urls;
  } catch {
    return [];
  }
}

async function searchThumb(term) {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo" +
    "&generator=search&gsrnamespace=6&gsrlimit=20" +
    `&gsrsearch=${encodeURIComponent(term)}` +
    `&iiprop=url|mime|size&iiurlwidth=${WIDTH}`;
  let res;
  for (let attempt = 0; attempt < 4; attempt++) {
    await sleep(600 + attempt * 800);
    try {
      res = await fetch(api, { headers: { "User-Agent": UA } });
      if (res.ok) break;
    } catch {}
    res = null;
  }
  if (!res || !res.ok) return [];
  const data = await res.json();
  const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
  pages.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
  const landscape = [];
  const other = [];
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii || !/jpe?g/i.test(ii.mime || "")) continue;
    const url = ii.thumburl || ii.url;
    if ((ii.width || 0) >= (ii.height || 0)) landscape.push(url);
    else other.push(url);
  }
  return [...landscape, ...other];
}

function purgeLegacyImages() {
  for (const name of readdirSync(OUT)) {
    if (!ALLOWED.has(name)) {
      unlinkSync(join(OUT, name));
      console.log(`removed legacy ${name}`);
    }
  }
}

function readFileSyncSafe(p) {
  try {
    return readFileSync(p);
  } catch {
    return null;
  }
}

async function main() {
  purgeLegacyImages();
  const usedUrls = new Set();
  const usedHashes = new Set();

  for (const [file, terms] of Object.entries(targets)) {
    const dest = join(OUT, file);
    if (!FORCE && existsSync(dest) && statSync(dest).size > 25000) {
      const existing = readFileSyncSafe(dest);
      if (existing) usedHashes.add(md5(existing));
      console.log(`skip ${file} (exists)`);
      continue;
    }

    let candidates = [];
    for (const fileTitle of directFiles[file] ?? []) {
      candidates.push(...(await fetchByFileTitle(fileTitle)));
    }
    for (const term of terms) {
      candidates.push(...(await searchThumb(term)));
    }
    candidates = [...new Set(candidates)];

    let got = null;
    for (const url of candidates) {
      if (usedUrls.has(url)) continue;
      try {
        const res = await fetch(url, { headers: { "User-Agent": UA } });
        if (!res.ok) continue;
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 15000) continue;
        const hash = md5(buf);
        if (usedHashes.has(hash)) continue;
        got = { buf, url, hash };
        usedUrls.add(url);
        usedHashes.add(hash);
        break;
      } catch {}
    }

    if (got) {
      writeFileSync(dest, got.buf);
      console.log(`ok ${file} (${Math.round(got.buf.length / 1024)}KB) <- ${got.url.slice(0, 85)}…`);
    } else {
      if (existsSync(dest)) unlinkSync(dest);
      console.warn(`FAIL ${file} — no unique candidate found`);
    }
  }

  const hashes = new Map();
  let dupes = 0;
  for (const name of Object.keys(targets)) {
    const p = join(OUT, name);
    if (!existsSync(p)) {
      console.warn(`MISSING ${name}`);
      continue;
    }
    const h = md5(readFileSyncSafe(p));
    if (hashes.has(h)) {
      console.warn(`DUPLICATE: ${name} same as ${hashes.get(h)}`);
      dupes++;
    } else {
      hashes.set(h, name);
    }
  }
  console.log(`\n${hashes.size} unique images / ${Object.keys(targets).length} targets (${dupes} duplicates)`);
  if (dupes > 0 || hashes.size < Object.keys(targets).length) process.exit(1);
}

main();
