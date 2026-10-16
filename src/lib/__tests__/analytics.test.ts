import { afterEach, describe, expect, it, vi } from "vitest";
import { ANALYTICS_DOM_EVENT, AnalyticsEvents, eventForLink, trackEvent } from "@/lib/analytics";

const ORIGIN = "https://chaniashoreexcursions.com";

describe("eventForLink", () => {
  it.each([
    ["/enquire/", { event: "enquiry_cta_click" }],
    ["/enquire", { event: "enquiry_cta_click" }],
    ["/enquire/?tour=ancient-aptera-excursion", { event: "enquiry_cta_click", productRef: "ancient-aptera-excursion" }],
    [`${ORIGIN}/enquire/?tour=balos-lagoon-excursion`, { event: "enquiry_cta_click", productRef: "balos-lagoon-excursion" }],
  ])("tracks %s", (href, expected) => {
    expect(eventForLink(href, ORIGIN)).toEqual(expected);
  });

  it.each(["/", "/shore-excursions/", "/enquire-later/", "mailto:hello@chaniashoreexcursions.com", "https://example.com/enquire/"])("ignores %s", (href) => {
    expect(eventForLink(href, ORIGIN)).toBeNull();
  });

  it("maps links marked as booking CTAs to the placeholder booking event", () => {
    expect(eventForLink("/anything/", ORIGIN, true)).toEqual({ event: "booking_cta_click" });
  });
});

describe("trackEvent", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("dispatches a DOM event with only the event name, excursion and path", () => {
    const dispatched: CustomEvent[] = [];
    vi.stubGlobal("window", { dispatchEvent: (e: CustomEvent) => dispatched.push(e) });
    trackEvent(AnalyticsEvents.enquiry_submitted, { productRef: "ancient-aptera-excursion", path: "/enquire/" });
    trackEvent(AnalyticsEvents.enquiry_cta_click, {});
    expect(dispatched.map((e) => [e.type, e.detail])).toEqual([
      [ANALYTICS_DOM_EVENT, { event: "enquiry_submitted", productRef: "ancient-aptera-excursion", path: "/enquire/" }],
      [ANALYTICS_DOM_EVENT, { event: "enquiry_cta_click" }],
    ]);
  });

  it("does nothing during server rendering", () => {
    expect(() => trackEvent(AnalyticsEvents.enquiry_cta_click)).not.toThrow();
  });
});
