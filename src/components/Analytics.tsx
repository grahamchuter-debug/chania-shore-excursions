"use client";

import { useEffect } from "react";
import { eventForLink, trackEvent } from "@/lib/analytics";

/** Tracks clicks on links to /enquire/ (and future `data-analytics="booking_cta"` links) site-wide. */
export function AnalyticsClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const tracked = eventForLink(link.getAttribute("href") ?? "", window.location.origin, link.getAttribute("data-analytics") === "booking_cta");
      if (tracked) trackEvent(tracked.event, { productRef: tracked.productRef, path: window.location.pathname });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
