import type { EditorialCategory } from "@/data/types";

const BADGE_STYLES: Record<EditorialCategory, string> = {
  "Editor's Choice": "pill-editors-choice",
  "Best Guided Experience": "pill bg-coastal-800 text-white",
  "Best Independent Experience": "pill bg-coastal-100 text-coastal-900",
  "Best for Families": "pill-accent",
  "Best for History": "pill bg-coastal-700 text-white",
  "Best Food & Wine Experience": "pill bg-maple-500/15 text-maple-600",
  "Best Nature Experience": "pill bg-coastal-600 text-white",
  "Best Luxury Experience": "pill bg-coastal-900 text-autumn-300",
  "Best for First-Time Visitors": "pill bg-autumn-200/60 text-coastal-900",
  "Hidden Gem": "pill bg-autumn-300/40 text-coastal-900",
  "Best Value": "pill bg-coastal-50 text-coastal-800 ring-1 ring-coastal-200",
  "Best Short Port Call": "pill bg-white text-coastal-800 ring-1 ring-coastal-300",
};

export function EditorialBadges({
  badges,
  className = "",
  size = "default",
}: {
  badges: EditorialCategory[];
  className?: string;
  size?: "default" | "compact";
}) {
  if (!badges.length) return null;
  const sizeClass = size === "compact" ? "text-[10px] px-2 py-0.5" : "";
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((badge) => (
        <span key={badge} className={`${BADGE_STYLES[badge]} ${sizeClass}`}>
          {badge}
        </span>
      ))}
    </div>
  );
}
