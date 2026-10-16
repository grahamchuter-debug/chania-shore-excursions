export const ENQUIRY_SITE_ID = "chania";

export const ENQUIRY_ENDPOINT =
  process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT ?? "https://wowatour-enquiries.dark-violet-8d91.workers.dev/v1/enquiries";

/** Query parameter excursion pages use to pre-select their product: `/enquire/?tour=<slug>`. */
export const ENQUIRY_PRODUCT_PARAM = "tour";

export const ENQUIRY_CORE_FIELDS = new Set(["name", "email", "phone", "message", "travelDate", "ship", "guests", "productRef", "website"]);

export interface EnquiryProduct {
  slug: string;
  title: string;
}

export function enquiryHref(slug: string): string {
  return `/enquire?${ENQUIRY_PRODUCT_PARAM}=${encodeURIComponent(slug)}`;
}

/** Matches a `?tour=` value against the known products; anything else is ignored. */
export function findEnquiryProduct(products: readonly EnquiryProduct[], ref: string | null | undefined): EnquiryProduct | undefined {
  if (!ref) return undefined;
  return products.find((p) => p.slug === ref);
}

export interface EnquiryPayloadInput {
  siteId: string;
  idempotencyKey: string;
  entries: Iterable<[string, unknown]>;
  sourceUrl: string;
  elapsedMs: number;
}

/**
 * Builds the JSON body for the shared Wow A Tour enquiry service. Fields named after the service's
 * core fields are sent as-is; any other non-empty field is sent in `extra`.
 */
export function buildEnquiryPayload({ siteId, idempotencyKey, entries, sourceUrl, elapsedMs }: EnquiryPayloadInput) {
  const core: Record<string, string> = {};
  const extra: Record<string, string> = {};
  for (const [key, raw] of entries) {
    const value = String(raw).trim();
    if (ENQUIRY_CORE_FIELDS.has(key)) core[key] = value;
    else if (value) extra[key] = value;
  }
  return {
    siteId,
    idempotencyKey,
    name: core.name ?? "",
    email: core.email ?? "",
    phone: core.phone || null,
    message: core.message ?? "",
    travelDate: core.travelDate || null,
    ship: core.ship || null,
    guests: core.guests || null,
    productRef: core.productRef || null,
    extra: Object.keys(extra).length ? extra : null,
    sourceUrl,
    website: core.website ?? "",
    elapsedMs,
  };
}

export type EnquiryPayload = ReturnType<typeof buildEnquiryPayload>;

export type EnquiryResult =
  | { kind: "success"; reference: string }
  | { kind: "error"; message: string; errors: Record<string, string> };

/** POSTs the payload to the enquiry service and maps the response to a result for the form. */
export async function sendEnquiry(payload: EnquiryPayload, fetchImpl: typeof fetch = fetch, endpoint = ENQUIRY_ENDPOINT): Promise<EnquiryResult> {
  try {
    const res = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; reference?: string; message?: string; errors?: Record<string, string> } | null;
    if (res.ok && data?.ok && data.reference) return { kind: "success", reference: data.reference };
    return {
      kind: "error",
      message: data?.message ?? "We couldn't send your enquiry just now. Please try again.",
      errors: data?.errors ?? {},
    };
  } catch {
    return { kind: "error", message: "We couldn't reach our server. Please check your connection and try again.", errors: {} };
  }
}
