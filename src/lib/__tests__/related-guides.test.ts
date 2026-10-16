import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { excursions } from "@/data/excursions";
import { guides } from "@/data/guides";
import { comparisons } from "@/data/comparisons";
import { resolveRelatedGuide } from "@/lib/related-guides";

const appDir = path.resolve(__dirname, "../../app");
const dynamicSlugs = new Set([...guides, ...comparisons].map((p) => p.slug));

function isRoute(slug: string): boolean {
  return dynamicSlugs.has(slug) || existsSync(path.join(appDir, slug, "page.tsx"));
}

describe("related guides", () => {
  it.each(excursions.map((e) => [e.slug, e.relatedGuideSlugs ?? []] as const))(
    "%s lists only related guides that resolve to a page",
    (_, slugs) => {
      expect(slugs.length).toBeGreaterThan(0);
      for (const slug of slugs) {
        const link = resolveRelatedGuide(slug);
        expect(link, slug).toBeDefined();
        expect(isRoute(link!.slug), slug).toBe(true);
        expect(link!.title.length).toBeGreaterThan(0);
      }
    },
  );

  it.each([...guides, ...comparisons].map((p) => [p.slug, p.relatedGuideSlugs] as const))(
    "%s lists only existing guides",
    (_, slugs) => {
      for (const slug of slugs) expect(guides.some((g) => g.slug === slug), slug).toBe(true);
    },
  );

  it("links the Ancient Aptera excursion back to the Ancient Aptera guide", () => {
    expect(excursions.find((e) => e.slug === "ancient-aptera-excursion")?.relatedGuideSlugs).toContain("ancient-aptera");
  });

  it("ignores unknown slugs", () => {
    expect(resolveRelatedGuide("chania-old-town-guide")).toBeUndefined();
  });
});
