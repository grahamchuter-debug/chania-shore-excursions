import type { FAQ, VisitorType } from "./types";

export const visitorTypes: VisitorType[] = [
  {
    id: "monastery",
    label: "Monastery & countryside",
    shortLabel: "Monastery",
    description:
      "Agia Triada, olive groves and Akrotiri peninsula — we help you choose between our Editor's Choice tour and independent Old Town days.",
    href: "/why-agia-triada-is-our-editors-choice",
    cta: "Editor's Choice",
  },
  {
    id: "harbour",
    label: "Venetian Harbour lover",
    shortLabel: "Harbour",
    description:
      "Lighthouse walks, harbour cafés and Ottoman-Venetian lanes — compare harbour days, Old Town walks and Agia Triada combos.",
    href: "/venetian-harbour-guide",
    cta: "Harbour guide",
  },
  {
    id: "food",
    label: "Food and wine",
    shortLabel: "Food",
    description:
      "Dakos, olive oil, raki and Cretan wine — the tastiest way to spend a Chania port day without overloading your schedule.",
    href: "/chania-food-guide",
    cta: "Food guides",
  },
  {
    id: "first-time",
    label: "First time in Western Crete",
    shortLabel: "First visit",
    description:
      "Monastery, Old Town or Aptera — we help first-time Chania cruise passengers pick the right shore excursion for their port window.",
    href: "/best-chania-excursions-for-first-time-visitors",
    cta: "See first-timer picks",
  },
];

export interface HomeSection {
  slug: string;
  number: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export const coreSections: HomeSection[] = [
  {
    slug: "shore-excursions",
    number: "01",
    title: "Shore Excursions",
    description:
      "Agia Triada & Chania, Old Town walks, food and wine, traditional villages, Ancient Aptera and private Western Crete tours — with honest Editor's Choice guidance.",
    href: "/shore-excursions",
    cta: "Browse excursions",
  },
  {
    slug: "cruise-port-guide",
    number: "02",
    title: "Chania Cruise Port Guide",
    description:
      "Souda Bay terminal, taxi and shuttle tips, drive times to Chania Old Town and return-to-ship timing for Western Crete.",
    href: "/cruise-port-guide",
    cta: "Read the guide",
  },
  {
    slug: "monastery",
    number: "03",
    title: "Agia Triada Monastery",
    description:
      "Akrotiri olive country, monastery visits and why Agia Triada & Chania is our Editor's Choice for first-time Western Crete visitors.",
    href: "/why-agia-triada-is-our-editors-choice",
    cta: "Editor's Choice",
  },
  {
    slug: "planner",
    number: "04",
    title: "Chania Cruise Planner",
    description:
      "Enter ship times, interests and mobility — get tailored Western Crete itineraries with return-to-ship confidence.",
    href: "/cruise-planner",
    cta: "Start planning",
  },
  {
    slug: "one-day",
    number: "05",
    title: "One Day in Chania",
    description:
      "Monastery mornings, Old Town afternoons, food experiences and harbour strolls matched to your port window.",
    href: "/one-day-in-chania-from-a-cruise-ship",
    cta: "See day plans",
  },
  {
    slug: "schedules",
    number: "06",
    title: "Cruise Ship Schedules",
    description:
      "Year and month schedule views for Souda Bay — see which ships share your Mediterranean port day.",
    href: "/ship-schedules",
    cta: "Check schedules",
  },
  {
    slug: "guides",
    number: "07",
    title: "Chania Authority Guides",
    description:
      "Venetian Harbour, Cretan food, olive oil, wine, beaches and independent vs ship excursions — practical cruise passenger advice.",
    href: "/best-things-to-do-in-chania-from-a-cruise-ship",
    cta: "Read guides",
  },
  {
    slug: "faq",
    number: "08",
    title: "FAQ",
    description:
      "Common Chania cruise questions — Souda Bay logistics, Agia Triada timing, Balos realism and return buffers.",
    href: "/faq",
    cta: "View FAQ",
  },
];

export function getHomepageFaqs(): FAQ[] {
  return [
    {
      question: "Where do cruise ships dock near Chania, Crete?",
      answer:
        "Most ships berth at Souda Bay (Souda cruise port), roughly 20–25 minutes by road from Chania Old Town and the Venetian Harbour. Agia Triada Monastery lies about 25–35 minutes from the terminal on the Akrotiri peninsula. See our Chania Cruise Port Guide for terminal details and taxi tips.",
    },
    {
      question: "What is the best thing to do in Chania on a cruise port day?",
      answer:
        "For most first-timers it is Agia Triada Monastery combined with free time in Chania Old Town — our Editor's Choice small-group excursion. Food lovers may prefer a market and harbour day; history enthusiasts Ancient Aptera. Our Cruise Planner tailors this to your hours ashore.",
    },
    {
      question: "What is Agia Triada & Chania and why is it your Editor's Choice?",
      answer:
        "Agia Triada & Chania is our flagship small-group shore excursion linking the Akrotiri monastery and olive countryside with unhurried time in Chania Old Town. We recommend it after comparing ship tours, DIY taxis and independent operators — not marketing, but the experience we would genuinely suggest for first-time Western Crete visitors from Souda Bay.",
    },
    {
      question: "Can I visit Balos or Elafonissi on a Chania port day?",
      answer:
        "Only on very long calls with 9+ usable hours ashore — both beaches sit 1.5–2 hours each way from Souda Bay. Standard 8–10 hour port days are better spent on Chania Old Town, Agia Triada or Aptera. See our Balos and Elafonissi guides for honest timing.",
    },
    {
      question: "How much return-to-ship buffer should I allow in Chania?",
      answer:
        "Allow 45–60 minutes for Old Town-only days (including taxi back to Souda Bay). Agia Triada and countryside tours need 60–75 minutes. West-coast beach trips need 75–90 minutes. Always confirm your ship's all-aboard time in the cruise line app before booking independently.",
    },
  ];
}
