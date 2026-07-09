import type { ScheduleEntry, ShipSchedulePort } from "./types";
import {
  filterEntriesByMonth,
  filterEntriesByYear,
  getMonthsWithEntries,
  type ScheduleYear,
} from "@/lib/schedule-utils";
import chaniaSchedule from "./imported-schedules/chania.json";

const SCHEDULE_FAQS = [
  {
    question: "How accurate are the Chania cruise ship schedules?",
    answer:
      "Schedules are compiled from published cruise timetables and updated periodically. Times, terminals and dates can change, so always confirm your arrival and departure with your cruise line before booking shore excursions.",
  },
  {
    question: "Where do cruise ships dock near Chania, Crete?",
    answer:
      "Most ships berth at Souda Bay cruise port, roughly 20–25 minutes by road from Chania Old Town. Agia Triada Monastery lies about 25–35 minutes from the terminal. Your cruise documents confirm the exact berth.",
  },
  {
    question: "Why check ship schedules before booking Chania excursions?",
    answer:
      "Multi-ship days increase queues at Chania harbour cafés and Akrotiri monastery car parks. Knowing how many vessels share your port day helps you choose between a guided Agia Triada & Chania tour, an early DIY start or a focused Old Town walk.",
  },
];

const SCHEDULE_TIPS = [
  "Check how many ships are in port before booking Agia Triada visits",
  "Confirm your berth at Souda Bay cruise terminal",
  "Avoid west-coast beach excursions unless your call exceeds 9 hours ashore",
  "Compare your time in port before choosing combined monastery and Old Town tours",
];

export const schedulePorts: ShipSchedulePort[] = [
  {
    slug: "chania",
    name: "Chania (Souda Bay)",
    country: "Crete, Greece",
    seoTitle: "Chania Cruise Ship Schedule Overview",
    metaDescription: "Chania cruise ship schedule hub. See which ships are in port at Souda Bay and plan Agia Triada visits, Old Town walks and Western Crete excursions around…",
    intro:
      "Chania (Souda Bay) is a major Eastern Mediterranean and Greek Isles cruise port with seasonal traffic on island-hopping and Grand Voyage itineraries. Check which ships are scheduled before you book monastery tours, Old Town excursions or food experiences.",
    description:
      "Western Crete's cruise gateway — Agia Triada Monastery, Chania Old Town and Venetian Harbour from Souda Bay.",
    scheduleOverview:
      "Souda Bay sees peak cruise traffic from April through October, with winter calls from repositioning and transatlantic itineraries.",
    planningTips: SCHEDULE_TIPS,
    faqs: SCHEDULE_FAQS,
  },
];

const scheduleData: Record<string, ScheduleEntry[]> = {
  chania: chaniaSchedule as ScheduleEntry[],
};

export function getSchedulePortBySlug(slug: string): ShipSchedulePort | undefined {
  return schedulePorts.find((p) => p.slug === slug);
}

export function getAllSchedulePortSlugs(): string[] {
  return schedulePorts.map((p) => p.slug);
}

export function getScheduleEntries(slug: string): ScheduleEntry[] {
  return scheduleData[slug] ?? [];
}

export function getScheduleEntryCount(slug: string): number {
  return getScheduleEntries(slug).length;
}

export function getScheduleEntriesForYear(slug: string, year: ScheduleYear): ScheduleEntry[] {
  return filterEntriesByYear(getScheduleEntries(slug), year);
}

export function getScheduleEntriesForMonth(slug: string, monthKey: string): ScheduleEntry[] {
  return filterEntriesByMonth(getScheduleEntries(slug), monthKey);
}

export function getVerifiedMonthKeys(slug: string): string[] {
  return getMonthsWithEntries(getScheduleEntries(slug));
}

export function searchSchedulesByShip(query: string): { portSlug: string; entries: ScheduleEntry[] }[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const results: { portSlug: string; entries: ScheduleEntry[] }[] = [];
  for (const port of schedulePorts) {
    const matches = getScheduleEntries(port.slug).filter(
      (e) => e.ship.toLowerCase().includes(q) || e.cruiseLine.toLowerCase().includes(q),
    );
    if (matches.length) results.push({ portSlug: port.slug, entries: matches });
  }
  return results;
}

export function getTodayTomorrowEntries(slug: string): { today: ScheduleEntry[]; tomorrow: ScheduleEntry[] } {
  const entries = getScheduleEntries(slug);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return {
    today: entries.filter((e) => e.date === fmt(today)),
    tomorrow: entries.filter((e) => e.date === fmt(tomorrow)),
  };
}
