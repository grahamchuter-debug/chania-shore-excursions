import Link from "next/link";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { buildMetadata } from "@/lib/seo";
import { PhotoHeroBand } from "@/components/PhotoHeroBand";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlanningLinks } from "@/components/PlanningLinks";
import { EditorialBadges } from "@/components/EditorialBadges";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { excursions, getEditorsChoiceExcursion } from "@/data/excursions";
import { excursionsHubImage, getExcursionImage } from "@/lib/images";

export const metadata = buildMetadata({
  title: "Chania Shore Excursions",
  description:
    "Chania shore excursions for cruise passengers — Agia Triada & Chania (Editor's Choice), Old Town walks, food and wine, traditional villages and Ancient Aptera.",
  path: "/shore-excursions",
  image: excursionsHubImage.src,
  imageAlt: excursionsHubImage.alt,
  keywords: ["Chania cruise excursions", "Chania shore excursions", "Agia Triada Monastery tour"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Shore Excursions", path: "/shore-excursions" },
];

const AVAILABILITY_BADGES = {
  "coming-soon": { label: "Coming soon", className: "pill bg-coastal-100" },
  "register-interest": { label: "Register interest", className: "pill-accent" },
  available: { label: "Available", className: "pill bg-coastal-800 text-white" },
};

export default function ShoreExcursionsPage() {
  const editorsChoice = getEditorsChoiceExcursion();

  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), webPageSchema({ title: "Chania Shore Excursions", description: "Premium Chania shore excursions for cruise passengers.", path: "/shore-excursions" })]} />
      <PhotoHeroBand
        image={excursionsHubImage}
        eyebrow="Cruise-timed tours"
        title="Chania Shore Excursions"
        subtitle="Independent, passenger-first recommendations — Agia Triada & Chania is our Editor's Choice, but we compare every option honestly so you choose the right Western Crete port day for your window."
        compact
      />
      <section className="section-padding">
        <div className="container-wide">
          <Breadcrumbs items={breadcrumbs} />

          {editorsChoice && (
            <div className="mb-10 card-editors-choice max-w-4xl">
              <span className="pill-editors-choice">Editor&apos;s Choice</span>
              <h2 className="font-display text-xl font-bold text-gray-900 mt-3">{editorsChoice.title}</h2>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">{editorsChoice.overview.slice(0, 320)}…</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={`/shore-excursions/${editorsChoice.slug}`} className="btn-primary text-sm">View Agia Triada &amp; Chania</Link>
                <Link href="/why-agia-triada-is-our-editors-choice" className="btn-secondary text-sm">Why we recommend it</Link>
                <Link href="/independent-vs-cruise-line-excursions" className="btn-secondary text-sm">Compare with ship tours</Link>
              </div>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {excursions.map((e) => {
              const image = getExcursionImage(e.slug);
              const badge = e.availability ? AVAILABILITY_BADGES[e.availability] : AVAILABILITY_BADGES["register-interest"];
              return (
                <Link key={e.slug} href={`/shore-excursions/${e.slug}`} className="card-editorial group overflow-hidden">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <ResponsiveImage
                    image={image}
                    role="card"
                    imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                    <div className="absolute inset-0 bg-gradient-to-t from-coastal-900/55 via-transparent to-transparent" aria-hidden="true" />
                    {e.editorsChoice ? (
                      <span className="absolute left-3 top-3 pill-editors-choice">Editor&apos;s Choice</span>
                    ) : e.editorialBadges?.[0] ? (
                      <span className="absolute left-3 top-3 pill bg-white/90 text-xs max-w-[85%]">{e.editorialBadges[0]}</span>
                    ) : (
                      <span className="absolute left-3 top-3 pill bg-white/90">{e.category}</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">{e.title}</h2>
                    <p className="mt-2 text-sm text-gray-600">{e.tagline}</p>
                    {e.editorialBadges && e.editorialBadges.length > 0 && !e.editorsChoice && (
                      <EditorialBadges badges={e.editorialBadges} className="mt-3" size="compact" />
                    )}
                    <p className="mt-3 text-xs font-medium text-coastal-700">{e.duration} · {e.pace}</p>
                    <span className={`mt-2 inline-block ${badge.className}`}>{badge.label}</span>
                    <p className="mt-2 text-xs text-gray-500 line-clamp-2">Best for: {e.bestFor}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-12">
            <PlanningLinks />
          </div>
        </div>
      </section>
    </>
  );
}
