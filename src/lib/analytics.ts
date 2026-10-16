export const AnalyticsEvents = {
  enquiry_cta_click: "enquiry_cta_click",
  enquiry_submitted: "enquiry_submitted",
  /** Placeholder for a future booking button; nothing on the site emits it yet. */
  booking_cta_click: "booking_cta_click",
} as const;

export type AnalyticsEvent = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

/** Only non-personal context: the excursion slug and the page path it happened on. */
export interface AnalyticsProps {
  productRef?: string;
  path?: string;
}

export const ANALYTICS_DOM_EVENT = "wowatour:analytics";

/** Cloudflare Web Analytics site token; the beacon is only rendered when this is set at build time. */
export const CF_WEB_ANALYTICS_TOKEN = process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN ?? "";

/**
 * Records a custom event. Cloudflare Web Analytics has no custom events, so this only dispatches a
 * `wowatour:analytics` DOM event for a future first-party collector; it sends nothing over the network.
 */
export function trackEvent(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (typeof window === "undefined") return;
  const detail: AnalyticsProps & { event: AnalyticsEvent } = { event };
  if (props.productRef) detail.productRef = props.productRef;
  if (props.path) detail.path = props.path;
  window.dispatchEvent(new CustomEvent(ANALYTICS_DOM_EVENT, { detail }));
}

/** The event (and excursion) for a click on a link to `href`, or null when the link isn't tracked. */
export function eventForLink(href: string, origin: string, bookingCta = false): { event: AnalyticsEvent; productRef?: string } | null {
  if (bookingCta) return { event: AnalyticsEvents.booking_cta_click };
  let url: URL;
  try {
    url = new URL(href, origin);
  } catch {
    return null;
  }
  if (url.origin !== origin || url.pathname.replace(/\/$/, "") !== "/enquire") return null;
  const productRef = url.searchParams.get("tour") ?? undefined;
  return productRef ? { event: AnalyticsEvents.enquiry_cta_click, productRef } : { event: AnalyticsEvents.enquiry_cta_click };
}
