import { describe, expect, it } from "vitest";
import { guides } from "@/data/guides";
import { comparisons } from "@/data/comparisons";
import { excursions } from "@/data/excursions";

const excursionHrefs = new Set(excursions.map((e) => `/shore-excursions/${e.slug}`));

describe("guide inline links", () => {
  const linked = guides.filter((g) => g.inlineLinks?.length);

  it("links the Ancient Aptera and Old Town guides to their excursions", () => {
    expect(Object.fromEntries(linked.map((g) => [g.slug, g.inlineLinks]))).toEqual({
      "chania-old-town-walking-guide": [{ text: "Chania old town walking tour", href: "/shore-excursions/chania-old-town-walking-tour" }],
      "ancient-aptera": [{ text: "Ancient Aptera excursion", href: "/shore-excursions/ancient-aptera-excursion" }],
    });
  });

  it.each(linked.map((g) => [g.slug, g] as const))("%s: each link text appears in a paragraph and points at an excursion", (_, g) => {
    const paragraphs = [...g.body, ...(g.sections?.flatMap((s) => s.paragraphs) ?? [])];
    for (const link of g.inlineLinks!) {
      expect(paragraphs.some((p) => p.includes(link.text)), link.text).toBe(true);
      expect(excursionHrefs.has(link.href), link.href).toBe(true);
    }
  });
});

describe("primary excursion call to action", () => {
  it.each([...guides, ...comparisons].filter((p) => p.primaryExcursionSlug).map((p) => [p.slug, p] as const))(
    "%s lists its primary excursion among the related excursion buttons",
    (_, p) => {
      expect(p.relatedExcursionSlugs?.slice(0, "body" in p ? 3 : undefined)).toContain(p.primaryExcursionSlug);
    },
  );

  it("is set only on the Agia Triada comparison and editor's choice pages", () => {
    expect([...guides, ...comparisons].filter((p) => p.primaryExcursionSlug).map((p) => p.slug).sort()).toEqual([
      "agia-triada-vs-chania-old-town-only",
      "monastery-vs-beach-day",
      "why-agia-triada-is-our-editors-choice",
    ]);
  });
});
