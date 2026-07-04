import type { ComparisonPage } from "@/data/types";
import { PhotoHeroBand } from "@/components/PhotoHeroBand";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQSection } from "@/components/FAQSection";
import { PlanningLinks } from "@/components/PlanningLinks";
import { JsonLd } from "@/components/JsonLd";
import { ComparisonTable } from "@/components/ComparisonTable";
import { breadcrumbSchema, faqSchema, articleSchema } from "@/lib/schema";
import { getComparisonImage } from "@/lib/images";
import { getComparisonBySlug, comparisons } from "@/data/comparisons";
import { getExcursionBySlug } from "@/data/excursions";
import { getGuideBySlug } from "@/data/guides";
import Link from "next/link";

export function ComparisonArticle({ page }: { page: ComparisonPage }) {
  const image = getComparisonImage(page.slug);
  const relatedGuides = page.relatedGuideSlugs.map((s) => getGuideBySlug(s)).filter(Boolean);
  const relatedComparisons = comparisons.filter((c) => c.slug !== page.slug).slice(0, 3);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: page.title, path: `/${page.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          faqSchema(page.faqs),
          articleSchema({ title: page.seoTitle, description: page.metaDescription, path: `/${page.slug}`, image: image.src }),
        ]}
      />
      <PhotoHeroBand image={image} eyebrow={page.eyebrow} title={page.title} subtitle={page.summary} compact />

      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <Breadcrumbs items={breadcrumbs} />

          <div className="prose-body">
            {page.overview.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <ComparisonTable rows={page.comparisonTable.map((r) => ({ category: r.category, portA: r.optionA, portB: r.optionB }))} portA={page.optionA} portB={page.optionB} />

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="card-feature">
              <h2 className="font-display text-xl font-bold text-gray-900">Choose {page.optionA} when…</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                {page.whenChooseA.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
            <div className="card-feature">
              <h2 className="font-display text-xl font-bold text-gray-900">Choose {page.optionB} when…</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                {page.whenChooseB.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
          </div>

          <div className="mt-10 card-accent">
            <h2 className="font-display text-xl font-bold text-gray-900">Our verdict</h2>
            <p className="mt-3 text-gray-700">{page.verdict}</p>
          </div>

          {page.relatedExcursionSlugs && page.relatedExcursionSlugs.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {page.relatedExcursionSlugs.map((slug) => {
                const e = getExcursionBySlug(slug);
                if (!e) return null;
                return (
                  <Link key={slug} href={`/shore-excursions/${slug}`} className="btn-secondary text-sm">
                    {e.editorsChoice ? "Editor's Choice: " : ""}{e.title}
                  </Link>
                );
              })}
            </div>
          )}

          {relatedGuides.length > 0 && (
            <div className="mt-12">
              <h2 className="section-title text-2xl mb-6">Related guides</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedGuides.map((r) => r && (
                  <Link key={r.slug} href={`/${r.slug}`} className="nav-card">
                    <h3 className="font-display text-base font-bold text-gray-900">{r.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{r.tagline}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {relatedComparisons.length > 0 && (
            <div className="mt-12">
              <h2 className="section-title text-2xl mb-6">More comparisons</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedComparisons.map((c) => (
                  <Link key={c.slug} href={`/${c.slug}`} className="nav-card">
                    <h3 className="font-display text-base font-bold text-gray-900">{c.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{c.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/cruise-planner" className="btn-primary">Build my cruise plan</Link>
            <Link href="/enquire" className="btn-secondary">Enquire</Link>
          </div>

          <div className="mt-12">
            <FAQSection faqs={page.faqs} title={`${page.title} — FAQs`} />
          </div>
          <div className="mt-12">
            <PlanningLinks />
          </div>
        </div>
      </section>
    </>
  );
}

export { getComparisonBySlug, getAllComparisonSlugs } from "@/data/comparisons";
