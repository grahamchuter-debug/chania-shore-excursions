import type { FAQ } from "./types";

export interface Terminal {
  name: string;
  quay: string;
  usedBy: string;
  cityAccess: string;
}

export const terminals: Terminal[] = [
  {
    name: "Souda Bay — Cruise Terminal",
    quay: "Souda port cruise berths on the deep-water bay east of Chania",
    usedBy: "Meditanean, Greek Isles and repositioning cruise ships calling at Chania, Crete",
    cityAccess: "20–25 min by road to Chania Old Town; 25–35 min to Agia Triada Monastery on Akrotiri",
  },
  {
    name: "Alternative berths",
    quay: "Commercial quays within Souda Bay when cruise berths are occupied",
    usedBy: "Occasional assignments on busy multi-ship days",
    cityAccess: "Similar road access — confirm your berth with the ship before booking excursions",
  },
  {
    name: "Tender operations",
    quay: "Anchorage in Souda Bay roadstead",
    usedBy: "Rare — when berths are full or for specific vessel types",
    cityAccess: "Tender to the port — add 30–45 min each way versus a direct berth",
  },
];

export interface PortGuideSection {
  heading: string;
  paragraphs: string[];
}

export const portGuideSections: PortGuideSection[] = [
  {
    heading: "Why Chania is Western Crete's cruise gateway",
    paragraphs: [
      "Chania is Crete's most characterful port city and the anchor for Western Crete cruise calls. Unlike Heraklion's commercial scale, Chania rewards passengers with a walkable Old Town, one of the Mediterranean's finest Venetian Harbours and quick access to Akrotiri monasteries, olive groves and the Aptera archaeological site — all within a standard port window from Souda Bay.",
      "Cruise ships do not dock in the Old Town itself. They berth at Souda Bay, a deep natural harbour roughly 7 km east of Chania centre. That geography shapes every port day: you need a taxi, shuttle or organised tour to reach the Venetian walls, harbour lighthouse and Agia Triada Monastery. The upside is honest countryside routing — olive country, White Mountain views and monastery visits fit comfortably alongside Old Town free time when your operator plans Souda Bay returns properly.",
    ],
  },
  {
    heading: "Cruise terminal and passenger facilities",
    paragraphs: [
      "The Souda Bay cruise terminal offers functional passenger services: immigration halls, toilets, taxi ranks and shore-excursion meeting points near the gangway. Signage is improving but Greek dominates — have your ship's berth name saved on your phone and know whether your cruise line runs a shuttle to Chania Old Town.",
      "On busy multi-ship days, allow an extra 15–25 minutes for immigration and terminal exit before your excursion departure. ATMs dispensing euros sit near the port exit; carry small notes for market purchases and harbour cafés. Wi‑Fi is limited inside the terminal — download offline maps of Chania Old Town before disembarking.",
    ],
  },
  {
    heading: "Getting around from Souda Bay",
    paragraphs: [
      "Chania Old Town and the Venetian Harbour lie 20–25 minutes by road from Souda Bay — not walkable. Official taxis queue outside the port; agree fares or insist on the meter before departing. Many cruise lines operate shuttle buses to a drop point near the harbour; confirm times for the return journey. Reputable shore excursions use air-conditioned vehicles with licensed guides who understand Akrotiri peninsula routing and afternoon traffic back to the terminal.",
      "Agia Triada Monastery sits 25–35 minutes from Souda Bay on the Akrotiri peninsula through olive groves and monastery country. Ancient Aptera lies roughly 20–25 minutes inland above Souda Bay with dramatic views over the bay and White Mountains. Balos Lagoon and Elafonissi Beach are 1.5–2 hours west — unrealistic on standard port calls. Traditional mountain villages in the foothills sit 40–60 minutes south depending on routing.",
    ],
  },
  {
    heading: "Return-to-ship timing from Chania",
    paragraphs: [
      "Confirm your all-aboard time — usually 30–60 minutes before departure — and work backwards from Souda Bay, not from Chania Old Town. Old Town-only days need 45–60 minutes return buffer including taxi or shuttle time. Agia Triada and combined monastery–Chania tours need 60–75 minutes because Akrotiri roads and harbour parking can slow afternoon returns. West-coast beach excursions need 75–90 minutes and are only appropriate on very long calls.",
      "Ship-run excursions guarantee the vessel waits if you are delayed on an official tour. Independent and small-group passengers must respect all-aboard times themselves. Reputable local operators track your ship's published departure from Souda Bay; DIY taxi passengers should book return timing with buffer built in.",
    ],
  },
];

export const portGuideFaqs: FAQ[] = [
  {
    question: "How far is Chania Old Town from the Souda Bay cruise port?",
    answer: "Approximately 20–25 minutes by road — not walkable. Budget vehicle time in both directions plus 45–60 minutes return buffer before all-aboard for city-only days.",
  },
  {
    question: "Can I walk from the cruise ship to the Venetian Harbour?",
    answer: "No — ships dock at Souda Bay, 7 km from Chania centre. Take a taxi, cruise-line shuttle or organised tour to reach the harbour and Old Town.",
  },
  {
    question: "How long does it take to reach Agia Triada Monastery from Souda Bay?",
    answer: "Approximately 25–35 minutes by road through Akrotiri olive country. Our Editor's Choice excursion combines monastery time with free time in Chania Old Town on standard 8–10 hour port calls.",
  },
  {
    question: "Is there a shuttle from Souda Bay to Chania?",
    answer: "Many cruise lines operate shuttles to a harbour drop point — confirm schedule and return times with your ship. Independent passengers use taxis or pre-booked tours.",
  },
];
