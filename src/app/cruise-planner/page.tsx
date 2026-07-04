import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ChaniaCruisePlanner } from "@/components/ChaniaCruisePlanner";
import { PlanningLinks } from "@/components/PlanningLinks";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { siteImages } from "@/lib/images";

const path = "/cruise-planner";

export const metadata = buildMetadata({
  title: "Chania Cruise Planner",
  description:
    "Build a personalised Chania cruise plan. Enter arrival and departure times, interests, mobility, party size and budget — get tailored Agia Triada, Old Town and food excursion ideas with return-to-ship confidence.",
  path,
  keywords: ["Chania cruise planner", "Chania cruise day plan", "Chania from cruise ship planning"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Cruise Planner", path },
];

export default function CruisePlannerPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), webPageSchema({ title: "Chania Cruise Planner", description: "Build a personalised Chania cruise plan.", path })]} />
      <PageHero
        title="Chania Cruise Planner"
        subtitle="Enter your ship times, party size, interests, mobility and budget — get tailored shore excursion ideas for your Chania port day, with realistic timing and return-to-ship confidence."
        imageSrc={siteImages.hero.src}
        imageAlt={siteImages.hero.alt}
        compact
      />
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <Breadcrumbs items={breadcrumbs} />
          <ChaniaCruisePlanner />
          <div className="mt-12">
            <PlanningLinks />
          </div>
        </div>
      </section>
    </>
  );
}
