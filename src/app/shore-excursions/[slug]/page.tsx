import Link from "next/link";
import { notFound } from "next/navigation";
import { excursionPageMetadata } from "@/lib/seo";
import { PhotoHeroBand } from "@/components/PhotoHeroBand";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQSection } from "@/components/FAQSection";
import { PlanningLinks } from "@/components/PlanningLinks";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, articleSchema } from "@/lib/schema";
import { getExcursionBySlug, getAllExcursionSlugs, excursions } from "@/data/excursions";
import { getGuideBySlug } from "@/data/guides";
import { EditorialBadges } from "@/components/EditorialBadges";
import { getExcursionImage } from "@/lib/images";

export function generateStaticParams() {
  return getAllExcursionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getExcursionBySlug(slug);
  if (!e) return {};
  return excursionPageMetadata(slug, e.seoTitle, e.metaDescription);
}

export default async function ExcursionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getExcursionBySlug(slug);
  if (!e) notFound();
  const image = getExcursionImage(slug);
  const related = e.relatedExcursionSlugs.map((s) => excursions.find((x) => x.slug === s)).filter(Boolean);
  const relatedGuides = (e.relatedGuideSlugs ?? []).map((s) => getGuideBySlug(s)).filter(Boolean);
  const isPremium = e.editorsChoice && e.whyWeRecommend;

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Shore Excursions", path: "/shore-excursions" },
    { name: e.title, path: `/shore-excursions/${slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          faqSchema(e.faqs),
          articleSchema({ title: e.seoTitle, description: e.metaDescription, path: `/shore-excursions/${slug}`, image: image.src }),
        ]}
      />
      <PhotoHeroBand image={image} eyebrow={e.editorsChoice ? "Editor's Choice" : e.category} title={e.title} subtitle={e.tagline} compact />

      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <Breadcrumbs items={breadcrumbs} />

          <div className="mb-8 flex flex-wrap gap-2">
            {e.editorsChoice && <span className="pill-editors-choice">Editor&apos;s Choice</span>}
            {e.editorialBadges && <EditorialBadges badges={e.editorialBadges.filter((b) => b !== "Editor's Choice")} />}
            <span className="pill">Duration: {e.duration}</span>
            <span className="pill">Pace: {e.pace}</span>
            <span className="pill-accent">Best for: {e.bestFor}</span>
            {e.availability === "available" && <span className="pill bg-coastal-800 text-white">Available</span>}
            {e.availability === "register-interest" && <span className="pill">Register interest</span>}
            {e.availability === "coming-soon" && <span className="pill">Coming soon</span>}
          </div>

          <p className="text-lg leading-relaxed text-gray-700">{e.overview}</p>

          <div className="prose-body">
            {e.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {isPremium && (
            <>
              <div className="mt-10 card-editors-choice">
                <h2 className="font-display text-xl font-bold text-gray-900">Why we recommend this excursion</h2>
                <p className="mt-2 text-sm text-gray-600">Our editorial team compared ship tours, DIY taxis and independent operators before naming Agia Triada &amp; Chania Editor&apos;s Choice — not marketing, but the excursion we would genuinely suggest for first-time Western Crete visitors.</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
                  {e.whyWeRecommend!.map((x) => <li key={x}>{x}</li>)}
                </ul>
                <Link href="/why-agia-triada-is-our-editors-choice" className="btn-secondary mt-4 inline-flex text-sm">Read our full editorial reasoning</Link>
              </div>

              {e.whoItSuits && (
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="card-feature">
                    <h2 className="font-display text-xl font-bold text-gray-900">Who it suits</h2>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                      {e.whoItSuits.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                  </div>
                  {e.cruisePassengerSnapshot && (
                    <div className="card-feature">
                      <h2 className="font-display text-xl font-bold text-gray-900">Cruise passenger snapshot</h2>
                      <dl className="mt-3 space-y-2">
                        {e.cruisePassengerSnapshot.map((row) => (
                          <div key={row.label} className="flex justify-between gap-4 text-sm">
                            <dt className="font-medium text-gray-900">{row.label}</dt>
                            <dd className="text-gray-600 text-right">{row.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              )}

              {e.returnToShipReassurance && (
                <div className="mt-8 card-accent">
                  <h2 className="font-display text-xl font-bold text-gray-900">Return-to-ship reassurance</h2>
                  <p className="mt-3 text-gray-700">{e.returnToShipReassurance}</p>
                </div>
              )}

              {e.whatMakesDifferent && (
                <div className="mt-8">
                  <h2 className="section-title text-2xl mb-4">What makes it different</h2>
                  <ul className="list-disc space-y-2 pl-5 text-gray-700">
                    {e.whatMakesDifferent.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
              )}

              {e.smallGroupBenefits && (
                <div className="mt-8 card-feature">
                  <h2 className="font-display text-xl font-bold text-gray-900">Small-group benefits</h2>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                    {e.smallGroupBenefits.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
              )}

              {e.practicalTimings && (
                <div className="mt-10">
                  <h2 className="section-title text-2xl mb-4">Practical timings</h2>
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-coastal-800 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Phase</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Typical time</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {e.practicalTimings.map((row) => (
                          <tr key={row.phase}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.phase}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{row.time}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{row.detail}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {e.scenicRouteHighlights && (
                <div className="mt-8">
                  <h2 className="section-title text-2xl mb-4">Scenic route highlights</h2>
                  <ul className="list-disc space-y-2 pl-5 text-gray-700">
                    {e.scenicRouteHighlights.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
              )}
            </>
          )}

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="card-feature">
              <h2 className="font-display text-xl font-bold text-gray-900">Highlights</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                {e.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </div>
            <div className="card-feature">
              <h2 className="font-display text-xl font-bold text-gray-900">What&apos;s included</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                {e.included.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </div>
          </div>

          <div className="mt-8 card-accent">
            <h2 className="font-display text-xl font-bold text-gray-900">Port logistics from Souda Bay</h2>
            <p className="mt-3 text-gray-700">{e.portLogistics}</p>
          </div>

          <div className="mt-8">
            <h2 className="section-title text-2xl mb-4">Tips for cruise passengers</h2>
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              {e.tips.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/cruise-planner" className="btn-primary">Build my cruise plan</Link>
            <Link href="/enquire" className="btn-secondary">{e.availability === "available" ? "Enquire / book" : "Register interest"}</Link>
          </div>

          {relatedGuides.length > 0 && (
            <div className="mt-12">
              <h2 className="section-title text-2xl mb-6">Related guides</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedGuides.map((g) => g && (
                  <Link key={g.slug} href={`/${g.slug}`} className="nav-card">
                    <h3 className="font-display text-base font-bold text-gray-900">{g.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{g.tagline}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="section-title text-2xl mb-6">Related excursions</h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {related.map((r) => r && (
                  <Link key={r.slug} href={`/shore-excursions/${r.slug}`} className="card-editorial group overflow-hidden">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img src={getExcursionImage(r.slug).src} alt={getExcursionImage(r.slug).alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      {r.editorsChoice && <span className="absolute left-3 top-3 pill-editors-choice text-xs">Editor&apos;s Choice</span>}
                      {!r.editorsChoice && r.editorialBadges?.[0] && (
                        <span className="absolute left-3 top-3 pill bg-white/90 text-xs">{r.editorialBadges[0]}</span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-base font-bold text-gray-900 group-hover:text-coastal-800">{r.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{r.tagline}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12">
            <FAQSection faqs={e.faqs} title={`${e.title} — FAQs`} />
          </div>

          <div className="mt-12">
            <PlanningLinks />
          </div>
        </div>
      </section>
    </>
  );
}
