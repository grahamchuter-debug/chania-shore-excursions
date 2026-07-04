const planningLinks = [
  { href: "/cruise-port-guide", label: "Cruise Port Guide" },
  { href: "/cruise-planner", label: "Cruise Planner" },
  { href: "/ship-schedules", label: "Ship Schedules" },
  { href: "/one-day-in-chania-from-a-cruise-ship", label: "One Day in Chania" },
  { href: "/why-agia-triada-is-our-editors-choice", label: "Editor's Choice" },
  { href: "/venetian-harbour-guide", label: "Venetian Harbour" },
  { href: "/faq", label: "FAQ" },
];

export function PlanningLinks({ heading = "Keep planning your Chania cruise" }: { heading?: string }) {
  return (
    <section className="mt-12 rounded-xl border border-coastal-100 bg-coastal-50/50 p-6">
      <h2 className="font-display text-lg font-bold text-gray-900">{heading}</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {planningLinks.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="pill bg-white text-coastal-800 ring-1 ring-coastal-200 hover:bg-coastal-100 transition-colors">{l.label}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
