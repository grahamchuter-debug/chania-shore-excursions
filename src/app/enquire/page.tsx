import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";

const path = "/enquire";

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
            <form className="mt-6 space-y-4" action={`mailto:${SITE.email}`} method="post" encType="text/plain">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input id="name" name="name" type="text" required className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input id="email" name="email" type="email" required className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
              </div>
              <div>
                <label htmlFor="excursion" className="block text-sm font-medium text-gray-700 mb-1">Excursion interest</label>
                <select id="excursion" name="excursion" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm">
                  <option>Agia Triada &amp; Chania (Editor&apos;s Choice)</option>
                  <option>Chania Old Town Walking Tour</option>
                  <option>Food &amp; Wine Experience</option>
                  <option>Traditional Villages Tour</option>
                  <option>Ancient Aptera Excursion</option>
                  <option>Relaxed Harbour Day</option>
                  <option>Family Day in Chania</option>
                  <option>Private Western Crete Tour</option>
                  <option>Cretan Olive Oil Experience</option>
                  <option>Winery &amp; Vineyard Tour</option>
                  <option>General planning question</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea id="message" rows={5} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" placeholder="Tell us about your Chania port day, ship times and which excursion interests you..." />
              </div>
              <button type="submit" className="btn-primary">Send enquiry</button>
            </form>
            <p className="mt-4 text-xs text-gray-500">Or email us directly at {SITE.email}</p>
          </div>
        </div>
      </section>
    </>
  );
}
