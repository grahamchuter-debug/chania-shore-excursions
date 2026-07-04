import { excursions } from "./excursions";

export interface PlannerInput {
  arrivalTime: string;
  departureTime: string;
  adults: number;
  children: number;
  interests: string[];
  mobility: "full" | "some" | "limited";
  budget: "budget" | "mid" | "premium";
  style: "guided" | "mix" | "diy";
}

export interface PlannerLink {
  label: string;
  href: string;
  why: string;
}

export interface PlannerResult {
  headline: string;
  summary: string;
  excursions: PlannerLink[];
  guides: PlannerLink[];
  logistics: PlannerLink[];
  dayPlan: { time: string; text: string }[];
  returnConfidence: "high" | "medium" | "low";
  itineraryTheme: string;
}

export const INTEREST_OPTIONS = [
  { id: "monastery", label: "Monasteries & countryside" },
  { id: "chania", label: "Historic Chania" },
  { id: "harbour", label: "Venetian Harbour" },
  { id: "food", label: "Food & markets" },
  { id: "wine", label: "Wine & vineyards" },
  { id: "olive", label: "Olive oil" },
  { id: "history", label: "History & archaeology" },
  { id: "villages", label: "Traditional villages" },
  { id: "beach", label: "Beaches" },
  { id: "family", label: "Family-friendly" },
  { id: "nature", label: "Nature & landscapes" },
];

const INTEREST_TO_EXCURSION: Record<string, string[]> = {
  monastery: ["agia-triada-monastery-and-chania", "traditional-villages-tour"],
  chania: ["agia-triada-monastery-and-chania", "chania-old-town-walking-tour", "relaxed-harbour-day"],
  harbour: ["relaxed-harbour-day", "agia-triada-monastery-and-chania", "chania-old-town-walking-tour"],
  food: ["food-and-wine-experience", "chania-old-town-walking-tour", "cretan-olive-oil-experience"],
  wine: ["winery-and-vineyard-tour", "food-and-wine-experience", "agia-triada-monastery-and-chania"],
  olive: ["cretan-olive-oil-experience", "traditional-villages-tour", "food-and-wine-experience"],
  history: ["ancient-aptera-excursion", "agia-triada-monastery-and-chania", "chania-old-town-walking-tour"],
  villages: ["traditional-villages-tour", "agia-triada-monastery-and-chania", "cretan-olive-oil-experience"],
  beach: ["elafonissi-beach-excursion", "balos-lagoon-excursion", "relaxed-harbour-day"],
  family: ["family-day-chania", "agia-triada-monastery-and-chania", "relaxed-harbour-day"],
  nature: ["traditional-villages-tour", "agia-triada-monastery-and-chania", "ancient-aptera-excursion"],
};

function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
}

function hoursAshore(arrival: string, departure: string): number {
  const diff = parseTime(departure) - parseTime(arrival);
  return Math.max(0, diff / 60);
}

function excursionLink(slug: string, why: string): PlannerLink | null {
  const e = excursions.find((x) => x.slug === slug);
  if (!e) return null;
  const prefix = e.editorsChoice ? "Editor's Choice — " : "";
  return { label: `${prefix}${e.title}`, href: `/shore-excursions/${slug}`, why };
}

function pickItineraryTheme(
  input: PlannerInput,
  hours: number,
  shortDay: boolean,
  longDay: boolean,
): string {
  const { interests, style, children } = input;
  const active = interests.length ? interests : ["monastery", "chania"];

  if (children > 0) return "Family Day";
  if (active.includes("beach") && longDay) return "Beach Day (long call only)";
  if (style === "diy" && !active.includes("monastery") && !active.includes("villages")) return "Relaxed Harbour Day";
  if (shortDay) return "Relaxed Harbour Day";
  if (active.includes("food") && (active.includes("wine") || active.includes("olive"))) return "Food & Wine Experience";
  if (active.includes("history") && active.includes("monastery")) return "Ancient Aptera & Monastery";
  if (active.includes("villages") && !active.includes("chania")) return "Traditional Villages";
  if (active.includes("history") && !active.includes("monastery")) return "Historic Chania Walking Day";
  if (active.includes("monastery") && active.includes("chania")) return "Editor's Choice: Agia Triada & Chania";
  if (active.includes("monastery")) return "Editor's Choice: Agia Triada & Chania";
  if (active.includes("harbour") || active.includes("chania")) return "Historic Chania Walking Day";
  if (active.includes("food")) return "Food & Wine Experience";
  if (active.includes("nature")) return "Traditional Villages";
  return "Editor's Choice: Agia Triada & Chania";
}

export function generateChaniaPlan(input: PlannerInput): PlannerResult {
  const { arrivalTime, departureTime, adults, children, interests, mobility, budget, style } = input;
  const party = adults + children;
  const hasKids = children > 0;
  const hours = hoursAshore(arrivalTime, departureTime);
  const shortDay = hours < 6;
  const standardDay = hours >= 6 && hours < 9;
  const longDay = hours >= 9;

  const excSlugs: string[] = [];
  const pushSlug = (s: string) => {
    if (s && !excSlugs.includes(s)) excSlugs.push(s);
  };

  const activeInterests = interests.length ? interests : ["monastery", "chania"];
  for (const interest of activeInterests) {
    for (const s of INTEREST_TO_EXCURSION[interest] ?? []) pushSlug(s);
  }

  if (hasKids) pushSlug("family-day-chania");
  if (mobility === "limited") pushSlug("private-western-crete-tour");
  if (style === "diy") pushSlug("chania-old-town-walking-tour");

  if (shortDay) {
    pushSlug("relaxed-harbour-day");
    pushSlug("chania-old-town-walking-tour");
    ["agia-triada-monastery-and-chania", "balos-lagoon-excursion", "elafonissi-beach-excursion", "traditional-villages-tour"].forEach((s) => {
      const idx = excSlugs.indexOf(s);
      if (idx >= 0) excSlugs.splice(idx, 1);
    });
  } else if (standardDay) {
    if (activeInterests.includes("monastery") || activeInterests.includes("chania")) pushSlug("agia-triada-monastery-and-chania");
    if (activeInterests.includes("food")) pushSlug("food-and-wine-experience");
    if (activeInterests.includes("wine")) pushSlug("winery-and-vineyard-tour");
    if (activeInterests.includes("history")) pushSlug("ancient-aptera-excursion");
    if (activeInterests.includes("villages")) pushSlug("traditional-villages-tour");
  } else if (longDay) {
    if (activeInterests.includes("beach")) pushSlug("elafonissi-beach-excursion");
    if (activeInterests.includes("villages")) pushSlug("traditional-villages-tour");
    if (budget === "premium") pushSlug("private-western-crete-tour");
  }

  if (style === "guided" && party >= 2) pushSlug("agia-triada-monastery-and-chania");
  if (budget === "premium") pushSlug("private-western-crete-tour");
  if (budget === "budget" && style === "diy") pushSlug("chania-old-town-walking-tour");

  if ((activeInterests.includes("monastery") || activeInterests.includes("chania")) && !shortDay) {
    const idx = excSlugs.indexOf("agia-triada-monastery-and-chania");
    if (idx > 0) {
      excSlugs.splice(idx, 1);
      excSlugs.unshift("agia-triada-monastery-and-chania");
    }
  }

  const reasonMap: Record<string, string> = {
    "agia-triada-monastery-and-chania": "Editor's Choice — Akrotiri monastery, olive countryside and free time in Chania Old Town.",
    "chania-old-town-walking-tour": "Best Independent Experience — Venetian lanes, harbour and market on foot from Souda Bay.",
    "food-and-wine-experience": "Cretan meze, market tastings and harbour lunch within a realistic port window.",
    "traditional-villages-tour": "White Mountains foothills, olive groves and village life beyond the cruise port.",
    "ancient-aptera-excursion": "Greek-Roman ruins above Souda Bay — history without a full-island day trip.",
    "relaxed-harbour-day": "Best Short Port Call — lighthouse, harbour cafés and Old Town at an easy pace.",
    "family-day-chania": "Kid-friendly harbour time, short countryside stops and flexible return timing.",
    "private-western-crete-tour": mobility === "limited" ? "Flexible vehicle and pacing for your group." : "Custom Western Crete routing on longer port days.",
    "cretan-olive-oil-experience": "Register interest — mill visits and tastings in Akrotiri olive country.",
    "winery-and-vineyard-tour": "Register interest — Cretan wine tastings near Chania.",
    "balos-lagoon-excursion": "Coming soon — only realistic on very long calls; see our Balos guide first.",
    "elafonissi-beach-excursion": "Coming soon — 2+ hours each way from Souda Bay; long calls only.",
  };

  const excursionLinks = excSlugs
    .slice(0, 5)
    .map((s) => excursionLink(s, reasonMap[s] ?? "A strong match for your interests."))
    .filter((x): x is PlannerLink => x !== null);

  const itineraryTheme = pickItineraryTheme(input, hours, shortDay, longDay);

  const guides: PlannerLink[] = [
    { label: "Chania Cruise Port Guide", href: "/cruise-port-guide", why: "Souda Bay terminal, taxi tips and return timing." },
    { label: "One Day in Chania", href: "/one-day-in-chania-from-a-cruise-ship", why: "Itineraries matched to your hours ashore." },
    { label: "Best Things to Do", href: "/best-things-to-do-in-chania-from-a-cruise-ship", why: "Compare monastery, Old Town, food and beach options." },
  ];
  if (activeInterests.includes("monastery") || activeInterests.includes("chania")) {
    guides.push({ label: "Why Agia Triada is Editor's Choice", href: "/why-agia-triada-is-our-editors-choice", why: "Our editorial reasoning after comparing all Chania options." });
  }
  if (activeInterests.includes("monastery")) guides.push({ label: "Agia Triada & Chania excursion", href: "/shore-excursions/agia-triada-monastery-and-chania", why: "Flagship small-group experience details and timings." });
  if (activeInterests.includes("harbour")) guides.push({ label: "Venetian Harbour Guide", href: "/venetian-harbour-guide", why: "Harbour walks, lighthouse and café stops." });
  if (style === "diy") guides.push({ label: "Chania Old Town Walking Guide", href: "/chania-old-town-walking-guide", why: "Self-guided route — our pick for confident DIY travellers." });
  if (activeInterests.includes("food")) guides.push({ label: "Chania Food Guide", href: "/chania-food-guide", why: "Where to eat on a port day near the agora and harbour." });
  if (activeInterests.includes("wine")) guides.push({ label: "Cretan Wine Guide", href: "/cretan-wine-guide", why: "Local varieties and when a winery add-on makes sense." });
  if (activeInterests.includes("beach")) guides.push({ label: "Balos from Chania Port", href: "/balos-lagoon-from-chania-cruise-port", why: "Honest timing — is Balos realistic from Souda Bay?" });
  if (hasKids) guides.push({ label: "Best for Families", href: "/best-chania-excursions-for-families", why: "Family-paced Chania and countryside options." });

  const logistics: PlannerLink[] = [
    { label: "Ship Schedules", href: "/ship-schedules", why: "See if other ships share your port day." },
    { label: "Independent vs Ship Excursions", href: "/independent-vs-cruise-line-excursions", why: "Compare flexibility and return-to-ship guarantees." },
    { label: "Agia Triada vs Old Town Only", href: "/agia-triada-vs-chania-old-town-only", why: "Choose monastery countryside or city-only if time is tight." },
    { label: "FAQ", href: "/faq", why: "Common Chania cruise passenger questions." },
  ];

  const dayPlan: { time: string; text: string }[] = [];
  const topExc = excursionLinks[0]?.label ?? "your chosen experience";

  dayPlan.push({ time: "On arrival", text: "Disembark at Souda Bay cruise terminal. Allow 25–40 minutes for immigration, shuttle or taxi to Chania Old Town (20–25 min drive)." });

  if (itineraryTheme === "Relaxed Harbour Day" || (shortDay && style === "diy")) {
    dayPlan.push({ time: "Morning", text: style === "diy" ? "Self-guided Old Town — Venetian Harbour, lighthouse and agora market." : `Relaxed harbour focus: ${topExc}.` });
    dayPlan.push({ time: "Midday", text: activeInterests.includes("food") ? "Dakos, kalitsounia and harbour lunch overlooking the Venetian walls." : "Harbour café stop before afternoon sights." });
    dayPlan.push({ time: "Return", text: "Head back 45–60 minutes before all-aboard. Short port days cannot fit Agia Triada and a full Old Town day honestly." });
  } else if (itineraryTheme === "Beach Day (long call only)") {
    dayPlan.push({ time: "Early start", text: `West-coast beach: ${topExc} — allow 2+ hours each way from Souda Bay.` });
    dayPlan.push({ time: "Midday", text: "Beach time at Elafonissi or Balos viewpoint — only on 9+ hour calls with early departure." });
    dayPlan.push({ time: "Return buffer", text: "Allow 75–90 minutes before all-aboard — west-coast roads are slow and winding." });
  } else if (itineraryTheme === "Food & Wine Experience") {
    dayPlan.push({ time: "Morning", text: `Markets and tastings: ${topExc} — agora and harbour while energy is high.` });
    dayPlan.push({ time: "Midday", text: activeInterests.includes("wine") ? "Cretan winery or raki tasting near Chania." : "Cretan lunch — lamb, horta and local cheese." });
    dayPlan.push({ time: "Afternoon", text: "Venetian Harbour stroll or olive mill visit if time allows before return." });
    dayPlan.push({ time: "Return buffer", text: "Allow 45–60 minutes — countryside routes need extra margin." });
  } else if (itineraryTheme === "Family Day") {
    dayPlan.push({ time: "Morning", text: `Family Day: ${topExc} — harbour playgrounds, short monastery stop or Old Town at kid-friendly pace.` });
    dayPlan.push({ time: "Afternoon", text: "Harbour gelato and lighthouse walk before vehicle return to Souda Bay." });
    dayPlan.push({ time: "Return buffer", text: "Allow 60–75 minutes — families benefit from vehicle-assisted routing." });
  } else if (itineraryTheme === "Traditional Villages") {
    dayPlan.push({ time: "Morning", text: `Village focus: ${topExc} — foothill lanes, olive groves and mountain views.` });
    dayPlan.push({ time: "Afternoon", text: "Optional Chania Old Town stop if port hours allow before return to Souda Bay." });
    dayPlan.push({ time: "Return buffer", text: "Allow 60–75 minutes — mountain roads reward early returns." });
  } else if (itineraryTheme === "Ancient Aptera & Monastery") {
    dayPlan.push({ time: "Morning", text: `History route: ${topExc} — Aptera ruins and Agia Triada monastery with guide context.` });
    dayPlan.push({ time: "Afternoon", text: "Free time in Chania Old Town — harbour and Venetian lanes." });
    dayPlan.push({ time: "Return buffer", text: "Allow 60–75 minutes before all-aboard." });
  } else if (itineraryTheme === "Historic Chania Walking Day") {
    dayPlan.push({ time: "Morning", text: `Old Town walk: ${topExc} — Topanas, harbour and agora market.` });
    dayPlan.push({ time: "Afternoon", text: "Lighthouse, maritime museum or relaxed harbour lunch." });
    dayPlan.push({ time: "Return buffer", text: "Allow 45–60 minutes for taxi or shuttle back to Souda Bay." });
  } else {
    dayPlan.push({ time: "Morning", text: `Agia Triada & Chania: ${topExc} — Akrotiri monastery and olive countryside.` });
    dayPlan.push({ time: "Afternoon", text: activeInterests.includes("food") ? "Harbour lunch and market browsing in Chania Old Town." : "Free time in Venetian Harbour and Old Town lanes." });
    dayPlan.push({ time: "Return buffer", text: "Allow 60–75 minutes — Souda Bay berth is 20–25 minutes from Chania centre." });
  }

  let returnConfidence: PlannerResult["returnConfidence"] = "high";
  if (excSlugs.includes("balos-lagoon-excursion") || excSlugs.includes("elafonissi-beach-excursion")) {
    returnConfidence = longDay ? "medium" : "low";
  } else if (excSlugs.includes("agia-triada-monastery-and-chania") && shortDay) returnConfidence = "low";
  else if (excSlugs.includes("agia-triada-monastery-and-chania")) returnConfidence = "medium";
  else if (shortDay) returnConfidence = "medium";

  const interestLabels = activeInterests.map((i) => INTEREST_OPTIONS.find((o) => o.id === i)?.label ?? i).join(", ");

  return {
    headline: `${itineraryTheme} (${hours.toFixed(1)} hours ashore)`,
    summary: `A ${shortDay ? "short" : standardDay ? "standard" : "long"} port day for ${party} guest${party === 1 ? "" : "s"} focused on ${interestLabels.toLowerCase()}. ${style === "guided" ? "Guided tours recommended for Akrotiri routing, monastery access and Souda Bay return timing." : style === "diy" ? "DIY works for Old Town walkers — follow our city guide and respect taxi timing back to Souda Bay." : "A mix of guided countryside time and independent Chania stops suits most Western Crete calls."}`,
    excursions: excursionLinks,
    guides,
    logistics,
    dayPlan,
    returnConfidence,
    itineraryTheme,
  };
}
