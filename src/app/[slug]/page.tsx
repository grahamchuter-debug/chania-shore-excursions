import { notFound } from "next/navigation";
import { getGuideBySlug, getAllGuideSlugs } from "@/data/guides";
import { getComparisonBySlug, getAllComparisonSlugs } from "@/data/comparisons";
import { GuideArticle } from "@/components/GuideArticle";
import { ComparisonArticle } from "@/components/ComparisonArticle";
import { guidePageMetadata, comparisonPageMetadata } from "@/lib/seo";

const RESERVED = new Set([
  "shore-excursions", "cruise-port-guide", "cruise-planner", "ship-schedules",
  "faq", "enquire", "about", "privacy", "terms",
]);

export function generateStaticParams() {
  return [
    ...getAllGuideSlugs().map((slug) => ({ slug })),
    ...getAllComparisonSlugs().map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (RESERVED.has(slug)) return {};

  const guide = getGuideBySlug(slug);
  if (guide) return guidePageMetadata(slug, guide.seoTitle, guide.metaDescription);

  const comparison = getComparisonBySlug(slug);
  if (comparison) return comparisonPageMetadata(slug, comparison.seoTitle, comparison.metaDescription);

  return {};
}

export default async function DynamicAuthorityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();

  const guide = getGuideBySlug(slug);
  if (guide) return <GuideArticle page={guide} />;

  const comparison = getComparisonBySlug(slug);
  if (comparison) return <ComparisonArticle page={comparison} />;

  notFound();
}
