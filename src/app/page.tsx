import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { VisitorTypeSelector } from "@/components/VisitorTypeSelector";
import { FAQSection } from "@/components/FAQSection";
import { JsonLd } from "@/components/JsonLd";
import { EditorialBadges } from "@/components/EditorialBadges";
import { breadcrumbSchema, faqSchema, travelGuideSchema } from "@/lib/schema";
import { coreSections, getHomepageFaqs } from "@/data/homepage";
import { getFeaturedExcursions, getEditorsChoiceExcursion } from "@/data/excursions";
import { siteImages, getExcursionImage, heroShowcaseImages } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { PreloadImage } from "@/components/PreloadImage";

export const metadata = buildMetadata({
  title: "Chania Shore Excursions & Cruise Port Planning",
  description:
    "The definitive Chania cruise planning authority — Agia Triada Monastery, Venetian Harbour, Cretan food and wine, Western Crete villages, ship schedules and a personalised cruise planner for Souda Bay port days.",
  path: "/",
  keywords: [
    "Chania shore excursions",
    "Chania cruise excursions",
    "Chania cruise port",
    "Agia Triada Monastery",
    "Chania Old Town",
    "Venetian Harbour Chania",
    "Western Crete shore excursions",
    "Chania cruise port guide",
  ],
});

const showcaseLabels = ["Venetian Harbour", "Lighthouse", "Old Town", "White Mountains"];

export default function HomePage() {
  const faqs = getHomepageFaqs();
  const featured = getFeaturedExcursions().slice(0, 6);
  const editorsChoice = getEditorsChoiceExcursion();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          faqSchema(faqs),
          travelGuideSchema({
            title: "Chania Shore Excursions & Cruise Port Planning",
            description: "The definitive Chania cruise planning authority for Western Crete port days.",
            path: "/",
          }),
        ]}
      />

      <section className="home-hero">
        <PreloadImage base={siteImages.hero.base} role="hero" />
        <ResponsiveImage
          image={siteImages.hero}
          role="hero"
          priority
          className="absolute inset-0 block h-full w-full"
          imgClassName="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container-wide relative z-10 px-4 sm:px-6 lg:px-8">
          <p className="section-eyebrow mb-2 text-coastal-100">Western Crete cruise planning authority</p>
          <h1 className="home-hero-heading">Chania Shore Excursions &amp; Cruise Port Planning</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            Chania is Western Crete&apos;s gateway — Venetian Harbour walks, Agia Triada Monastery, olive groves, Cretan food and ancient Aptera from Souda Bay, with honest Editor&apos;s Choice guidance and return-to-ship confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shore-excursions" className="btn-accent">Find Shore Excursions</Link>
            <Link href="/cruise-planner" className="btn-secondary bg-white/10 text-white border-white/30 hover:bg-white/20">Use the Cruise Planner</Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            <span className="inline-flex items-center gap-2"><span aria-hidden="true">✓</span> Agia Triada &amp; Chania — Editor&apos;s Choice</span>
            <span className="inline-flex items-center gap-2"><span aria-hidden="true">✓</span> Venetian Harbour &amp; monastery expertise</span>
            <span className="inline-flex items-center gap-2"><span aria-hidden="true">✓</span> Return-to-ship reassurance</span>
          </div>
        </div>
      </section>

      <section className="section-padding bg-coastal-900 text-white py-10 lg:py-12">
        <div className="container-wide">
          <p className="section-eyebrow text-coastal-200">Why Chania rewards cruise passengers</p>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {heroShowcaseImages.map((img, i) => (
              <div key={img.alt} className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-white/20">
                <img src={img.src} alt={img.alt} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-coastal-900/90 to-transparent p-3">
                  <p className="text-xs font-semibold sm:text-sm">{showcaseLabels[i]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VisitorTypeSelector />

      {editorsChoice && (
        <section className="section-padding bg-gradient-to-br from-autumn-300/15 via-white to-coastal-50 border-y border-autumn-400/20">
          <div className="container-wide">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="pill-editors-choice">Editor&apos;s Choice</span>
                <h2 className="section-title mt-4">{editorsChoice.title}</h2>
                <p className="section-subtitle">{editorsChoice.overview.slice(0, 280)}…</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/shore-excursions/${editorsChoice.slug}`} className="btn-primary">View Agia Triada &amp; Chania</Link>
                  <Link href="/why-agia-triada-is-our-editors-choice" className="btn-secondary">Why we recommend it</Link>
                </div>
              </div>
              <Link href={`/shore-excursions/${editorsChoice.slug}`} className="card-editorial group overflow-hidden">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={getExcursionImage(editorsChoice.slug).src} alt={getExcursionImage(editorsChoice.slug).alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-white">
        <div className="container-wide">
          <p className="section-eyebrow">Your Chania port day</p>
          <h2 className="section-title mt-2">The definitive Chania cruise planning hub</h2>
          <p className="section-subtitle">Agia Triada Monastery, Venetian Harbour, Cretan food and wine, traditional villages and Ancient Aptera — choose the right experience for your hours ashore, interests and return-to-ship confidence.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {coreSections.map((s) => (
              <Link key={s.slug} href={s.href} className="nav-card group flex h-full flex-col">
                <span className="font-display text-2xl font-bold text-coastal-200">{s.number}</span>
                <h3 className="mt-1 font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-600">{s.description}</p>
                <span className="mt-3 text-sm font-semibold text-maple-600">{s.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-coastal-50">
        <div className="container-wide">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="section-title">Shore Excursions</h2>
              <p className="section-subtitle">Balanced recommendations — Agia Triada &amp; Chania is our Editor&apos;s Choice, but we compare every option honestly.</p>
            </div>
            <Link href="/shore-excursions" className="btn-secondary shrink-0">All Excursions</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((e) => {
              const image = getExcursionImage(e.slug);
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
                      <span className="absolute left-3 top-3 pill bg-white/90 text-xs">{e.editorialBadges[0]}</span>
                    ) : (
                      <span className="absolute left-3 top-3 pill bg-white/90">{e.category}</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">{e.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{e.tagline}</p>
                    {e.editorialBadges && e.editorialBadges.length > 1 && (
                      <EditorialBadges badges={e.editorialBadges.slice(1)} className="mt-3" size="compact" />
                    )}
                    <p className="mt-3 text-xs font-medium text-coastal-700">{e.duration} · {e.pace}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide grid gap-6 lg:grid-cols-2">
          <div className="card-feature">
            <h3 className="font-display text-xl font-bold text-gray-900">First time in Chania?</h3>
            <p className="mt-3 text-gray-700">Monastery or Old Town only? Food tour or harbour day? Our guides explain Souda Bay drive times, what fits your port window and when Agia Triada &amp; Chania earns our Editor&apos;s Choice badge.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/best-chania-excursions-for-first-time-visitors" className="btn-secondary text-sm">First-timer guide</Link>
              <Link href="/venetian-harbour-guide" className="btn-secondary text-sm">Venetian Harbour guide</Link>
            </div>
          </div>
          <div className="card-accent">
            <h3 className="font-display text-xl font-bold text-gray-900">Monastery or beach day?</h3>
            <p className="mt-3 text-gray-700">Balos and Elafonissi tempt every passenger — but Souda Bay geography makes west-coast beaches unrealistic on standard calls. Honest comparison for passengers who must choose.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/monastery-vs-beach-day" className="btn-secondary text-sm">Monastery vs beach</Link>
              <Link href="/balos-lagoon-from-chania-cruise-port" className="btn-secondary text-sm">Balos realism guide</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-coastal-900 text-white">
        <div className="container-wide max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Build your personalised Chania cruise plan</h2>
          <p className="mt-4 text-white/85">Enter your ship times, interests, mobility and budget — get tailored monastery, Old Town and food itineraries with return-to-ship confidence.</p>
          <Link href="/cruise-planner" className="btn-accent mt-8 inline-flex">Start the Cruise Planner</Link>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide max-w-4xl">
          <FAQSection faqs={faqs} title="Chania Cruise Planning FAQs" />
        </div>
      </section>
    </>
  );
}
