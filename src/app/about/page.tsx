import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";

const path = "/about";

export const metadata = buildMetadata({
  title: "About Chania Shore Excursions",
  description: "About Chania Shore Excursions — an independent Western Crete cruise planning authority for passengers calling at Souda Bay.",
  path,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "About", path },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), webPageSchema({ title: "About Chania Shore Excursions", description: "About Chania Shore Excursions.", path })]} />
      <PageHero title="About Chania Shore Excursions" subtitle="An independent planning authority for cruise passengers discovering Western Crete's harbour-and-monastery gateway." compact />
      <section className="section-padding">
        <div className="container-wide max-w-3xl">
          <Breadcrumbs items={breadcrumbs} />
          <div className="prose-body">
            <p>
              {SITE.name} is an independent planning resource for cruise passengers calling at Chania, Crete. Ships berth at Souda Bay east of the city, and our goal is to help you choose the right experience — Agia Triada Monastery, Venetian Harbour, Cretan food and wine, traditional villages, Ancient Aptera or a relaxed harbour day — based on your interests, previous visits and port window.
            </p>
            <p>
              We aim to be the definitive Chania cruise planning authority, not simply another excursion catalogue. We compare options honestly: when Agia Triada &amp; Chania earns our Editor&apos;s Choice badge, we explain why — and we also tell you when a DIY Old Town walk, a food tour or a private Western Crete tour might suit you better.
            </p>
            <p>
              Our guides are written for real cruise timings, not generic Crete tourism. We highlight realistic Souda Bay drive times, Balos and Elafonissi honesty, monastery access, return-to-ship buffers and advice on when a guided tour beats going it alone. Agia Triada &amp; Chania is our flagship excursion recommendation for first-time visitors.
            </p>
            <p>
              We are not affiliated with any cruise line or Souda Bay port authority. Ship schedules and travel times are indicative — always confirm all-aboard times with your cruise line.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
