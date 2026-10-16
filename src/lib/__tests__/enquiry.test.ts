import { describe, expect, it, vi } from "vitest";
import { excursions } from "@/data/excursions";
import {
  ENQUIRY_ENDPOINT,
  ENQUIRY_SITE_ID,
  buildEnquiryPayload,
  enquiryHref,
  findEnquiryProduct,
  sendEnquiry,
} from "@/lib/enquiry";

const products = excursions.map(({ slug, title }) => ({ slug, title }));

/** Form fields in the order the /enquire/ form submits them (the honeypot comes last). */
const entries: [string, string][] = [
  ["name", " Ana "],
  ["email", "ana@example.com"],
  ["productRef", "ancient-aptera-excursion"],
  ["cruise_date_and_ship", "15 June 2027, Celebrity Apex"],
  ["party_size", "2 adults"],
  ["message", "Can we fit Aptera and the old town into a 7-hour call?"],
  ["website", ""],
];

const base = {
  siteId: ENQUIRY_SITE_ID,
  idempotencyKey: "0b9f3c1e-5d1a-4c55-9a43-1f7a2b6c8d90",
  entries,
  sourceUrl: "https://chaniashoreexcursions.com/enquire/?tour=ancient-aptera-excursion",
  elapsedMs: 4200,
};

describe("enquiry configuration", () => {
  it("posts to the shared Wow A Tour enquiry service as siteId chania", () => {
    expect(ENQUIRY_SITE_ID).toBe("chania");
    expect(ENQUIRY_ENDPOINT).toBe("https://wowatour-enquiries.dark-violet-8d91.workers.dev/v1/enquiries");
  });

  it("offers all twelve excursions, including Balos and Elafonissi", () => {
    expect(products).toHaveLength(12);
    expect(products.map((p) => p.slug)).toEqual(expect.arrayContaining(["balos-lagoon-excursion", "elafonissi-beach-excursion"]));
  });

  it("only offers slugs the enquiry service will accept as productRef", () => {
    for (const p of products) expect(p.slug).toMatch(/^[a-z0-9][a-z0-9-]{0,99}$/);
  });

  it("builds excursion enquiry links with the tour parameter", () => {
    expect(enquiryHref("ancient-aptera-excursion")).toBe("/enquire?tour=ancient-aptera-excursion");
  });
});

describe("findEnquiryProduct", () => {
  it("matches a known excursion slug", () => {
    expect(findEnquiryProduct(products, "ancient-aptera-excursion")).toEqual({ slug: "ancient-aptera-excursion", title: "Ancient Aptera Excursion" });
  });

  it.each([null, undefined, "", "bogus", "ANCIENT-APTERA-EXCURSION", "../etc", "ancient-aptera-excursion/", "<script>"])("ignores %j", (ref) => {
    expect(findEnquiryProduct(products, ref)).toBeUndefined();
  });
});

describe("buildEnquiryPayload", () => {
  it("sends the message, the selected excursion as productRef and the optional fields in extra", () => {
    expect(JSON.stringify(buildEnquiryPayload(base))).toBe(
      JSON.stringify({
        siteId: "chania",
        idempotencyKey: "0b9f3c1e-5d1a-4c55-9a43-1f7a2b6c8d90",
        name: "Ana",
        email: "ana@example.com",
        phone: null,
        message: "Can we fit Aptera and the old town into a 7-hour call?",
        travelDate: null,
        ship: null,
        guests: null,
        productRef: "ancient-aptera-excursion",
        extra: { cruise_date_and_ship: "15 June 2027, Celebrity Apex", party_size: "2 adults" },
        sourceUrl: "https://chaniashoreexcursions.com/enquire/?tour=ancient-aptera-excursion",
        website: "",
        elapsedMs: 4200,
      }),
    );
  });

  it("sends productRef as null for the general planning option and drops empty optional fields", () => {
    const payload = buildEnquiryPayload({
      ...base,
      entries: [["name", "Ana"], ["email", "ana@example.com"], ["productRef", ""], ["cruise_date_and_ship", "  "], ["party_size", ""], ["message", "Hello"], ["website", ""]],
    });
    expect(payload.productRef).toBeNull();
    expect(payload.extra).toBeNull();
    expect(payload.message).toBe("Hello");
  });
});

describe("sendEnquiry", () => {
  const payload = buildEnquiryPayload(base);
  const respond = (status: number, body: unknown) =>
    vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));

  it("POSTs the JSON payload to the endpoint and returns the reference", async () => {
    const fetchMock = respond(201, { ok: true, reference: "ENQ-CHQ-ABC234" });
    await expect(sendEnquiry(payload, fetchMock, "https://enquiries.test/v1/enquiries")).resolves.toEqual({ kind: "success", reference: "ENQ-CHQ-ABC234" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://enquiries.test/v1/enquiries");
    expect(init?.method).toBe("POST");
    expect(init?.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(String(init?.body))).toEqual(payload);
  });

  it("passes on validation messages", async () => {
    const fetchMock = respond(400, { ok: false, code: "VALIDATION", message: "Please check the highlighted fields.", errors: { email: "Please enter a valid email address." } });
    await expect(sendEnquiry(payload, fetchMock)).resolves.toEqual({
      kind: "error",
      message: "Please check the highlighted fields.",
      errors: { email: "Please enter a valid email address." },
    });
  });

  it("reports an unregistered origin (403 with no message) as a generic failure", async () => {
    const fetchMock = respond(403, { ok: false, code: "ORIGIN_NOT_ALLOWED" });
    await expect(sendEnquiry(payload, fetchMock)).resolves.toEqual({
      kind: "error",
      message: "We couldn't send your enquiry just now. Please try again.",
      errors: {},
    });
  });

  it("reports network failures", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(sendEnquiry(payload, fetchMock)).resolves.toMatchObject({ kind: "error", message: expect.stringContaining("couldn't reach our server") });
  });
});
