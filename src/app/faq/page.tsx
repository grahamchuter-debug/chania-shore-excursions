import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQSection } from "@/components/FAQSection";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/schema";
import { siteFaqs } from "@/data/faqs";

const path = "/faq";

export const metadata = buildMetadata({
  title: "Chania Cruise FAQ",
  description:
    "Frequently asked questions about Chania shore excursions, Souda Bay cruise port, Agia Triada timing, Venetian Harbour walks and return-to-ship confidence for cruise passengers.",
  path,
  keywords: ["Chania cruise port FAQ", "Chania shore excursions FAQ", "Chania from cruise ship FAQ"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "FAQ", path },
];

export default function FAQPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), faqSchema(siteFaqs), webPageSchema({ title: "Chania Cruise FAQ", description: metadata.description as string, path })]} />
      <PageHero title="Chania Cruise FAQ" subtitle="Practical answers for cruise passengers calling at Souda Bay — port logistics, Agia Triada, Editor's Choice guidance and Old Town timing." compact />
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <Breadcrumbs items={breadcrumbs} />
          <FAQSection faqs={siteFaqs} title="Chania Cruise Planning — FAQs" />
        </div>
      </section>
    </>
  );
}
