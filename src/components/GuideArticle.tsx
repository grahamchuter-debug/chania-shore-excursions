import Link from "next/link";
import type { ReactNode } from "react";
import type { GuidePage, InlineLink } from "@/data/types";
import { PhotoHeroBand } from "@/components/PhotoHeroBand";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQSection } from "@/components/FAQSection";
import { PlanningLinks } from "@/components/PlanningLinks";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, articleSchema } from "@/lib/schema";
import { getGuideImage } from "@/lib/images";
import { getGuideBySlug, getAllGuideSlugs } from "@/data/guides";
import { getExcursionBySlug } from "@/data/excursions";

function withInlineLinks(text: string, links: InlineLink[], used: Set<InlineLink>): ReactNode {
  for (const link of links) {
    if (used.has(link)) continue;
    const at = text.indexOf(link.text);
    if (at === -1) continue;
    used.add(link);
    return (
      <>
        {text.slice(0, at)}
        <Link href={link.href} className="font-medium text-coastal-800 underline hover:text-coastal-900">{link.text}</Link>
        {withInlineLinks(text.slice(at + link.text.length), links, used)}
      </>
    );
  }
  return text;
}

export function GuideArticle({ page }: { page: GuidePage }) {
  const image = getGuideImage(page.slug);
  const related = page.relatedGuideSlugs.map((s) => getGuideBySlug(s)).filter(Boolean);
  const inlineLinks = page.inlineLinks ?? [];
  const usedLinks = new Set<InlineLink>();
  const paragraph = (text: string) => withInlineLinks(text, inlineLinks, usedLinks);
  const relatedExcursions = page.relatedExcursionSlugs?.slice(0, 3) ?? [];
  const primaryIndex = page.primaryExcursionSlug ? relatedExcursions.indexOf(page.primaryExcursionSlug) : -1;

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
      <PhotoHeroBand image={image} eyebrow={page.eyebrow} title={page.title} subtitle={page.tagline} compact />

      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <Breadcrumbs items={breadcrumbs} />
          <p className="text-lg leading-relaxed text-gray-700">{page.overview}</p>

          <div className="prose-body">
            {page.body.map((p, i) => <p key={i}>{paragraph(p)}</p>)}
          </div>

          {page.sections?.map((s) => (
            <div key={s.heading} className="prose-body">
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, i) => <p key={i}>{paragraph(p)}</p>)}
            </div>
          ))}

          {page.recommendations && page.recommendations.length > 0 && (
            <div className="mt-10">
              <h2 className="section-title text-2xl mb-6">Recommended options</h2>
              <div className="grid gap-4">
                {page.recommendations.map((r) => {
                  const href = r.excursionSlug
                    ? `/shore-excursions/${r.excursionSlug}`
                    : r.guideSlug
                      ? `/${r.guideSlug}`
                      : "#";
                  return (
                    <Link key={r.title} href={href} className="card-editorial group block p-6">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">{r.title}</h3>
                        {r.bestFor && <span className="pill-accent">{r.bestFor}</span>}
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{r.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {page.highlights && page.highlights.length > 0 && (
            <div className="mt-10 card-feature">
              <h2 className="font-display text-xl font-bold text-gray-900">Highlights</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                {page.highlights.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
          )}

          {page.tips && page.tips.length > 0 && (
            <div className="mt-8">
              <h2 className="section-title text-2xl mb-4">Practical tips</h2>
              <ul className="list-disc space-y-2 pl-5 text-gray-700">
                {page.tips.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          )}

          {relatedExcursions.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {relatedExcursions.map((slug, i) => {
                const e = getExcursionBySlug(slug);
                if (!e) return null;
                return (
                  <Link key={slug} href={`/shore-excursions/${slug}`} className={i === primaryIndex ? "btn-primary text-sm" : "btn-secondary text-sm"}>
                    {e.title}
                  </Link>
                );
              })}
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="section-title text-2xl mb-6">Related guides</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((r) => r && (
                  <Link key={r.slug} href={`/${r.slug}`} className="nav-card">
                    <h3 className="font-display text-base font-bold text-gray-900">{r.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{r.tagline}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/cruise-planner" className={primaryIndex === -1 ? "btn-primary" : "btn-secondary"}>Build my cruise plan</Link>
            <Link href="/enquire" className="btn-secondary">Register interest</Link>
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

export { getAllGuideSlugs };
