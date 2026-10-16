import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { EnquiryFormShell } from "@/components/EnquiryFormShell";
import { ExcursionSelect } from "@/components/ExcursionSelect";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";
import { ENQUIRY_SITE_ID } from "@/lib/enquiry";
import { excursions } from "@/data/excursions";

const path = "/enquire";
const enquiryProducts = excursions.map(({ slug, title }) => ({ slug, title }));

export const metadata = buildMetadata({
  title: "Enquire / Contact",
  description: "Get in touch about Chania shore excursions and cruise port planning — enquire about Agia Triada & Chania, register interest for tours and ask cruise-day questions.",
  path,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Enquire", path },
];

export default function EnquirePage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), webPageSchema({ title: "Enquire / Contact", description: "Get in touch about Chania cruise planning.", path })]} />
      <PageHero title="Enquire / Contact" subtitle="Enquire about Agia Triada & Chania, register interest for Western Crete tours, or ask about your port day." compact />
      <section className="section-padding">
        <div className="container-wide max-w-xl">
          <Breadcrumbs items={breadcrumbs} />
          <div className="card-feature">
            <p className="text-sm text-gray-700">Agia Triada &amp; Chania and other Chania shore excursions are available to enquire. Use this form to register interest, ask about ship timing or request planning advice for your port day.</p>
            <EnquiryFormShell
              siteId={ENQUIRY_SITE_ID}
              fallbackEmail={SITE.email}
              className="mt-6 space-y-4"
              submitClassName="btn-primary"
              submitLabel="Send enquiry"
              successTitle="Thank you — we've received your enquiry"
              successBody="We'll reply by email, usually within one working day."
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input id="name" name="name" type="text" required maxLength={100} autoComplete="name" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
              </div>
              <div>
                <label htmlFor="excursion" className="block text-sm font-medium text-gray-700 mb-1">Excursion interest</label>
                <ExcursionSelect products={enquiryProducts} generalLabel="General planning question" />
              </div>
              <div>
                <label htmlFor="cruise" className="block text-sm font-medium text-gray-700 mb-1">Cruise date &amp; ship (optional)</label>
                <input id="cruise" name="cruise_date_and_ship" type="text" maxLength={200} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" placeholder="e.g. 15 June 2027, Celebrity Apex" />
              </div>
              <div>
                <label htmlFor="party" className="block text-sm font-medium text-gray-700 mb-1">Party size (optional)</label>
                <input id="party" name="party_size" type="text" maxLength={100} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" placeholder="e.g. 2 adults, 1 child" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea id="message" name="message" rows={5} required maxLength={5000} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" placeholder="Tell us about your Chania port day, ship times and which excursion interests you..." />
              </div>
            </EnquiryFormShell>
            <p className="mt-4 text-xs text-gray-500">Or email us directly at {SITE.email}</p>
          </div>
        </div>
      </section>
    </>
  );
}
