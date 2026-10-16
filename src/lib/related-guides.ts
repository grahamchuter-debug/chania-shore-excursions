import { getGuideBySlug } from "@/data/guides";
import { getComparisonBySlug } from "@/data/comparisons";

export interface RelatedGuideLink {
  slug: string;
  title: string;
  tagline: string;
}

/** Standalone planning pages that excursions may list as related guides. */
const PLANNING_PAGES: RelatedGuideLink[] = [
  {
    slug: "cruise-port-guide",
    title: "Chania Cruise Port Guide",
    tagline:
      "Where ships dock at Souda Bay, terminal facilities, drive times to Chania Old Town and Agia Triada and return-to-ship timing — practical advice for cruise passengers.",
  },
];

/** Resolves a related-guide slug to a guide, comparison or planning page served at `/<slug>/`. */
export function resolveRelatedGuide(slug: string): RelatedGuideLink | undefined {
  const guide = getGuideBySlug(slug);
  if (guide) return { slug: guide.slug, title: guide.title, tagline: guide.tagline };
  const comparison = getComparisonBySlug(slug);
  if (comparison) return { slug: comparison.slug, title: comparison.title, tagline: comparison.summary };
  return PLANNING_PAGES.find((p) => p.slug === slug);
}
