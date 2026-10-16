import { describe, expect, it } from "vitest";
import { addDaysToDate, dateInTimeZone, PORT_TIME_ZONE } from "@/lib/schedule-utils";
import { getTodayTomorrowEntries } from "@/data/schedules";

describe("port-local date", () => {
  it("uses Europe/Athens", () => {
    expect(PORT_TIME_ZONE).toBe("Europe/Athens");
  });

  it.each([
    ["2026-10-16T12:00:00Z", "2026-10-16"],
    ["2026-10-16T20:59:00Z", "2026-10-16"], // 23:59 in Chania (UTC+3)
    ["2026-10-16T21:30:00Z", "2026-10-17"], // 00:30 in Chania, still the 16th in London and New York
    ["2026-10-25T00:30:00Z", "2026-10-25"], // DST ends at 01:00 UTC
    ["2026-12-31T22:30:00Z", "2027-01-01"], // winter time, UTC+2
    ["2027-03-28T00:30:00Z", "2027-03-28"],
  ])("%s is %s in Chania", (instant, expected) => {
    expect(dateInTimeZone(new Date(instant))).toBe(expected);
  });

  it.each([
    ["2026-10-16", "2026-10-17"],
    ["2026-10-31", "2026-11-01"],
    ["2026-12-31", "2027-01-01"],
    ["2028-02-28", "2028-02-29"],
  ])("the day after %s is %s", (date, expected) => {
    expect(addDaysToDate(date, 1)).toBe(expected);
  });
});

describe("getTodayTomorrowEntries", () => {
  const ships = (date: string) => {
    const { today, tomorrow } = getTodayTomorrowEntries("chania", date);
    return { today: today.map((e) => e.ship), tomorrow: tomorrow.map((e) => e.ship) };
  };

  it("returns the calls for the given port-local day and the next", () => {
    expect(ships("2026-10-16")).toEqual({ today: ["Brilliance Of The Seas"], tomorrow: ["Marella Explorer 2"] });
    expect(ships("2026-09-18")).toEqual({ today: [], tomorrow: ["Marella Explorer 2"] });
  });

  it("returns nothing outside the imported schedule", () => {
    expect(ships("2030-01-01")).toEqual({ today: [], tomorrow: [] });
  });
});
