export interface SiteImage {
  src: string;
  alt: string;
  base: string;
}

const B = "/images";

function img(base: string, alt: string): SiteImage {
  return { base, src: `${B}/${base}.jpg`, alt };
}

export const siteImages = {
  hero: {
    src: `${B}/hero-home.jpg`,
    alt: "Chania Venetian Harbour with lighthouse and Old Town, Crete",
  },
  ogDefault: {
    src: `${B}/og-default.jpg`,
    alt: "Chania cruise port with Venetian Harbour and White Mountains, Western Crete",
  },
  logo: {
    src: `${B}/logo-mark.svg`,
    alt: "Chania Shore Excursions logo",
  },
  port: {
    src: `${B}/cruise-port.jpg`,
    alt: "Souda Bay cruise port and harbour, Chania, Crete",
  },
} as const;

export const subjectImages: Record<string, SiteImage> = {
  chania: { base: "chania", src: `${B}/chania.jpg`, alt: "Chania Old Town and Venetian Harbour, Western Crete" },
  harbour: { base: "venetian-harbour", src: `${B}/venetian-harbour.jpg`, alt: "Venetian Harbour Chania with colourful waterfront buildings" },
  lighthouse: { base: "lighthouse", src: `${B}/lighthouse.jpg`, alt: "Chania lighthouse at the entrance to the Venetian Harbour" },
  monastery: { base: "agia-triada", src: `${B}/agia-triada.jpg`, alt: "Agia Triada Monastery on the Akrotiri peninsula near Chania" },
  olive: { base: "olive-grove", src: `${B}/olive-grove.jpg`, alt: "Olive groves on the Akrotiri peninsula near Chania, Crete" },
  mountains: { base: "white-mountains", src: `${B}/white-mountains.jpg`, alt: "White Mountains viewed from Western Crete" },
  oldtown: { base: "old-town", src: `${B}/old-town.jpg`, alt: "Chania Old Town lanes and Venetian architecture" },
  market: { base: "market", src: `${B}/market.jpg`, alt: "Chania municipal market stalls on a cruise port day" },
  food: { base: "cretan-food", src: `${B}/cretan-food.jpg`, alt: "Traditional Cretan dakos and meze on a Chania port day" },
  wine: { base: "cretan-wine", src: `${B}/cretan-wine.jpg`, alt: "Cretan wine tasting near Chania, Western Crete" },
  aptera: { base: "ancient-aptera", src: `${B}/ancient-aptera.jpg`, alt: "Ancient Aptera archaeological site above Souda Bay" },
  villages: { base: "village", src: `${B}/village.jpg`, alt: "Traditional village in the foothills of the White Mountains, Crete" },
  beach: { base: "beach", src: `${B}/beach.jpg`, alt: "Cretan coastline near Chania, Western Crete" },
  family: { base: "family", src: `${B}/family.jpg`, alt: "Family-friendly sightseeing at Chania harbour from a cruise ship" },
  private: { base: "private", src: `${B}/private.jpg`, alt: "Private Western Crete tour vehicle on a Chania port day" },
  history: { base: "history", src: `${B}/history.jpg`, alt: "Venetian and Ottoman architecture in historic Chania Old Town" },
};

function pick(key: string): SiteImage {
  return subjectImages[key] ?? siteImages.ogDefault;
}

const excursionImageKeys: Record<string, string> = {
  "agia-triada-monastery-and-chania": "monastery",
  "chania-old-town-walking-tour": "oldtown",
  "food-and-wine-experience": "food",
  "traditional-villages-tour": "villages",
  "ancient-aptera-excursion": "aptera",
  "relaxed-harbour-day": "harbour",
  "family-day-chania": "family",
  "private-western-crete-tour": "private",
  "cretan-olive-oil-experience": "olive",
  "winery-and-vineyard-tour": "wine",
  "balos-lagoon-excursion": "beach",
  "elafonissi-beach-excursion": "beach",
};

const excursionImageAlts: Record<string, string> = {
  "agia-triada-monastery-and-chania":
    "Agia Triada Monastery & Chania shore excursion — Akrotiri monastery and Old Town from Souda Bay",
  "chania-old-town-walking-tour":
    "Chania Old Town walking tour — Venetian lanes, harbour and market from the cruise port",
  "food-and-wine-experience":
    "Food & wine experience — Cretan meze, market tastings and harbour lunch for cruise passengers",
  "traditional-villages-tour":
    "Traditional villages tour — White Mountains foothills and olive country from Chania",
  "ancient-aptera-excursion":
    "Ancient Aptera excursion — Greek-Roman ruins above Souda Bay on a Chania port day",
  "relaxed-harbour-day":
    "Relaxed harbour day — Venetian Harbour, lighthouse and Old Town at an easy pace",
  "family-day-chania":
    "Family day in Chania — kid-friendly harbour time and countryside stops",
  "private-western-crete-tour":
    "Private Western Crete tour — custom Chania and countryside routing with flexible pacing",
  "cretan-olive-oil-experience":
    "Cretan olive oil experience — mill visits and tastings in Akrotiri olive country",
  "winery-and-vineyard-tour":
    "Winery & vineyard tour — Cretan wine tastings near Chania",
  "balos-lagoon-excursion":
    "Balos Lagoon excursion — west-coast lagoon from Chania cruise port (long calls only)",
  "elafonissi-beach-excursion":
    "Elafonissi Beach excursion — pink-sand beach from Souda Bay (long calls only)",
};

export function getExcursionImage(slug: string): SiteImage {
  const key = excursionImageKeys[slug] ?? "chania";
  const base = pick(key);
  return excursionImageAlts[slug] ? { ...base, alt: excursionImageAlts[slug] } : base;
}

export const excursionsHubImage: SiteImage = {
  src: `${B}/agia-triada.jpg`,
  alt: "Chania shore excursions hub — Agia Triada Monastery, Venetian Harbour and Western Crete cruise port days",
};

const guideImageKeys: Record<string, string> = {
  "why-agia-triada-is-our-editors-choice": "monastery",
  "chania-old-town-walking-guide": "oldtown",
  "venetian-harbour-guide": "harbour",
  "lighthouse-guide": "lighthouse",
  "ancient-aptera": "aptera",
  "venizelos-tombs": "history",
  "chania-food-guide": "food",
  "cretan-wine-guide": "wine",
  "cretan-olive-oil-experiences": "olive",
  "traditional-villages-of-western-crete": "villages",
  "best-things-to-do-in-chania-from-a-cruise-ship": "chania",
  "one-day-in-chania-from-a-cruise-ship": "harbour",
  "balos-lagoon-from-chania-cruise-port": "beach",
  "elafonissi-beach-from-chania-cruise-port": "beach",
  "samaria-gorge-from-a-cruise-ship": "mountains",
  "independent-vs-cruise-line-excursions": "chania",
  "best-chania-excursions-for-couples": "harbour",
  "best-chania-excursions-for-families": "family",
  "best-chania-excursions-for-first-time-visitors": "monastery",
  "best-chania-excursions-for-history-lovers": "history",
  "best-chania-excursions-for-nature-lovers": "mountains",
  "best-chania-excursions-for-food-lovers": "market",
};

const guideImageAlts: Record<string, string> = {
  "why-agia-triada-is-our-editors-choice":
    "Why Agia Triada & Chania is our Editor's Choice — monastery and Old Town on a Western Crete cruise port day",
  "chania-old-town-walking-guide":
    "Chania Old Town walking guide — Venetian lanes for cruise passengers",
  "venetian-harbour-guide":
    "Venetian Harbour guide — harbour walks and lighthouse planning from Souda Bay",
  "lighthouse-guide":
    "Chania lighthouse guide — harbour entrance landmark for cruise passengers",
  "ancient-aptera":
    "Ancient Aptera guide — archaeological site above Souda Bay",
  "venizelos-tombs":
    "Venizelos Tombs guide — panoramic viewpoint near Chania",
  "chania-food-guide":
    "Chania food guide for cruise passengers — dakos, meze and market eating",
  "cretan-wine-guide":
    "Cretan wine guide — local varieties and winery add-ons near Chania",
  "cretan-olive-oil-experiences":
    "Cretan olive oil experiences — Akrotiri mills and tastings",
  "traditional-villages-of-western-crete":
    "Traditional villages of Western Crete — foothill lanes from Chania cruise port",
  "best-things-to-do-in-chania-from-a-cruise-ship":
    "Best things to do in Chania from a cruise ship — monastery, Old Town and food options",
  "one-day-in-chania-from-a-cruise-ship":
    "One day in Chania from a cruise ship — hour-by-hour port day itineraries",
  "balos-lagoon-from-chania-cruise-port":
    "Balos Lagoon from Chania cruise port — is it realistic from Souda Bay?",
  "elafonissi-beach-from-chania-cruise-port":
    "Elafonissi Beach from Chania cruise port — is it worth it on a port day?",
  "samaria-gorge-from-a-cruise-ship":
    "Samaria Gorge from a cruise ship — can you really do it from Souda Bay?",
  "independent-vs-cruise-line-excursions":
    "Independent vs cruise-line excursions in Chania — return-to-ship trade-offs",
  "best-chania-excursions-for-couples":
    "Best Chania excursions for couples — harbour and monastery options",
  "best-chania-excursions-for-families":
    "Best Chania excursions for families — kid-friendly harbour and countryside days",
  "best-chania-excursions-for-first-time-visitors":
    "Best Chania excursions for first-time visitors — Editor's Choice and alternatives",
  "best-chania-excursions-for-history-lovers":
    "Best Chania excursions for history lovers — Aptera, Old Town and monastery heritage",
  "best-chania-excursions-for-nature-lovers":
    "Best Chania excursions for nature lovers — olive groves, mountains and villages",
  "best-chania-excursions-for-food-lovers":
    "Best Chania excursions for food lovers — markets, meze and olive oil tastings",
};

export function getGuideImage(slug: string): SiteImage {
  const key = guideImageKeys[slug] ?? "chania";
  const base = pick(key);
  return guideImageAlts[slug] ? { ...base, alt: guideImageAlts[slug] } : base;
}

const comparisonImageKeys: Record<string, string> = {
  "agia-triada-vs-chania-old-town-only": "monastery",
  "small-group-vs-coach-tour": "monastery",
  "diy-vs-guided": "oldtown",
  "chania-vs-heraklion": "chania",
  "chania-vs-agios-nikolaos": "harbour",
  "beaches-vs-historic-chania": "beach",
  "monastery-vs-beach-day": "monastery",
};

const comparisonImageAlts: Record<string, string> = {
  "agia-triada-vs-chania-old-town-only": "Agia Triada vs Chania Old Town only — choosing the right Souda Bay port day",
  "small-group-vs-coach-tour": "Small group vs coach tour — group size on a Chania port day",
  "diy-vs-guided": "DIY vs guided — self-guided and tour planning from Souda Bay",
  "chania-vs-heraklion": "Chania vs Heraklion — Western vs eastern Crete from a cruise ship",
  "chania-vs-agios-nikolaos": "Chania vs Agios Nikolaos — comparing Cretan cruise ports",
  "beaches-vs-historic-chania": "Beaches vs historic Chania — west-coast sand or Old Town culture",
  "monastery-vs-beach-day": "Monastery vs beach day — Agia Triada or Elafonissi from Souda Bay",
};

export function getComparisonImage(slug: string): SiteImage {
  const key = comparisonImageKeys[slug] ?? "chania";
  const base = pick(key);
  return comparisonImageAlts[slug] ? { ...base, alt: comparisonImageAlts[slug] } : base;
}

export function getComparisonOgImage(slug: string): SiteImage {
  return getComparisonImage(slug);
}

export const heroShowcaseImages = [
  { base: "venetian-harbour", src: `${B}/venetian-harbour.jpg`, alt: "Venetian Harbour — Chania's iconic waterfront on a cruise port day" },
  { base: "lighthouse", src: `${B}/lighthouse.jpg`, alt: "Chania lighthouse at the harbour entrance" },
  { base: "old-town", src: `${B}/old-town.jpg`, alt: "Chania Old Town — Venetian lanes and Ottoman architecture" },
  { base: "white-mountains", src: `${B}/white-mountains.jpg`, alt: "White Mountains — Western Crete landscapes from Chania" },
] as const;
