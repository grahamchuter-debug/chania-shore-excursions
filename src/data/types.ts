export interface FAQ {
  question: string;
  answer: string;
}

export type Pace = "Relaxed" | "Moderate" | "Active";

export type EditorialCategory =
  | "Editor's Choice"
  | "Best Guided Experience"
  | "Best Independent Experience"
  | "Best for Families"
  | "Best for History"
  | "Best Food & Wine Experience"
  | "Best Nature Experience"
  | "Best Luxury Experience"
  | "Best for First-Time Visitors"
  | "Hidden Gem"
  | "Best Value"
  | "Best Short Port Call";

export interface TimingPhase {
  phase: string;
  time: string;
  detail: string;
}

export interface CruiseSnapshot {
  label: string;
  value: string;
}

export interface ExcursionPage {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  category: string;
  tagline: string;
  duration: string;
  pace: Pace;
  bestFor: string;
  overview: string;
  body: string[];
  highlights: string[];
  included: string[];
  portLogistics: string;
  tips: string[];
  faqs: FAQ[];
  relatedExcursionSlugs: string[];
  relatedGuideSlugs?: string[];
  featured?: boolean;
  editorsChoice?: boolean;
  editorialBadges?: EditorialCategory[];
  availability?: "coming-soon" | "register-interest" | "available";
  whyWeRecommend?: string[];
  whoItSuits?: string[];
  cruisePassengerSnapshot?: CruiseSnapshot[];
  returnToShipReassurance?: string;
  whatMakesDifferent?: string[];
  smallGroupBenefits?: string[];
  practicalTimings?: TimingPhase[];
  scenicRouteHighlights?: string[];
}

export interface ScheduleEntry {
  date: string;
  ship: string;
  cruiseLine: string;
  arrival: string;
  departure: string;
  timeInPort?: string;
  terminal?: string;
  callType?: string;
  notes?: string;
}

export interface ShipSchedulePort {
  slug: string;
  name: string;
  country: string;
  description: string;
  seoTitle: string;
  metaDescription: string;
  intro: string;
  scheduleOverview: string;
  planningTips?: string[];
  faqs?: FAQ[];
}

export interface VisitorType {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  href: string;
  cta: string;
}

export interface GuideRecommendation {
  title: string;
  description: string;
  excursionSlug?: string;
  guideSlug?: string;
  bestFor?: string;
}

export interface GuidePage {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  eyebrow: string;
  tagline: string;
  overview: string;
  body: string[];
  sections?: { heading: string; paragraphs: string[] }[];
  highlights?: string[];
  tips?: string[];
  recommendations?: GuideRecommendation[];
  faqs: FAQ[];
  relatedGuideSlugs: string[];
  relatedExcursionSlugs?: string[];
  imageKey?: string;
}

export interface ComparisonRow {
  category: string;
  optionA: string;
  optionB: string;
}

export interface ComparisonPage {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  eyebrow: string;
  optionA: string;
  optionB: string;
  summary: string;
  verdict: string;
  overview: string[];
  comparisonTable: ComparisonRow[];
  whenChooseA: string[];
  whenChooseB: string[];
  faqs: FAQ[];
  relatedGuideSlugs: string[];
  relatedExcursionSlugs?: string[];
  imageKey?: string;
}
