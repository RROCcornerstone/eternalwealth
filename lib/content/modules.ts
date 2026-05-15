/**
 * Registry of all 28 course modules. Source of truth for routing, sidebar,
 * progression, and stage gating.
 *
 * Master Prompt v2 Section 8.
 */

export type ModuleStage = "welcome" | "livestock" | "silver" | "gold" | "legacy";

export interface ModuleDefinition {
  slug: string;
  number: number; // 1-28
  stage: ModuleStage;
  title: string;
  oneLiner: string;
  scripture?: { text: string; reference: string; translation?: string };
}

export const MODULES: ModuleDefinition[] = [
  // Stage 1: Welcome + Foundation
  {
    slug: "welcome",
    number: 1,
    stage: "welcome",
    title: "The Eternal Wealth Framework",
    oneLiner: "Genesis 13:2 anchor. Where are you with money right now?",
    scripture: { text: "And Abram was very rich in livestock, in silver, and in gold.", reference: "Genesis 13:2", translation: "NKJV" },
  },
  {
    slug: "pause",
    number: 2,
    stage: "welcome",
    title: "Don't Build Yet — Just Learn",
    oneLiner: "Expectation-setting. Commit to finish.",
  },
  {
    slug: "financial-order",
    number: 3,
    stage: "welcome",
    title: "Livestock → Silver → Gold",
    oneLiner: "The divine order of wealth. Which stage are you in?",
  },
  {
    slug: "overview",
    number: 4,
    stage: "welcome",
    title: "Overview of the Structure",
    oneLiner: "The 9 accounts. The 10 categories. The full map.",
  },

  // Stage 2: Livestock
  {
    slug: "receiving-account",
    number: 5,
    stage: "livestock",
    title: "The Receiving Account",
    oneLiner: "Where every dollar lands. A clean place. Manual transfer only.",
  },
  {
    slug: "tithes",
    number: 6,
    stage: "livestock",
    title: "Tithes & Firstfruits",
    oneLiner: "The first 10%. Set apart before anything else.",
    scripture: { text: "Bring all the tithes into the storehouse, that there may be food in My house, and try Me now in this, says the Lord of hosts.", reference: "Malachi 3:10", translation: "NKJV" },
  },
  {
    slug: "core-bills",
    number: 7,
    stage: "livestock",
    title: "Core Bills & Housing",
    oneLiner: "The non-negotiables. Housing, utilities, transportation, insurance.",
  },
  {
    slug: "food",
    number: 8,
    stage: "livestock",
    title: "Food",
    oneLiner: "Groceries, restaurants, coffee — every dollar that goes to feeding you.",
  },
  {
    slug: "health-wellness",
    number: 9,
    stage: "livestock",
    title: "Health & Wellness",
    oneLiner: "Stewarding the body. Gym, supplements, therapy, recovery.",
  },
  {
    slug: "savings",
    number: 10,
    stage: "livestock",
    title: "Savings",
    oneLiner: "10–20% of income. Building the buffer before the build.",
  },
  {
    slug: "minimum-debt",
    number: 11,
    stage: "livestock",
    title: "Minimum Debt Payments",
    oneLiner: "Stay in right standing while the foundation is built.",
  },
  {
    slug: "livestock-complete",
    number: 12,
    stage: "livestock",
    title: "Livestock Complete",
    oneLiner: "The foundation is poured. Now we move.",
  },

  // Stage 3: Silver
  {
    slug: "aggressive-debt-payoff",
    number: 13,
    stage: "silver",
    title: "Aggressive Debt Payoff",
    oneLiner: "Snowball or avalanche. Pick one. Project the payoff date.",
  },
  {
    slug: "retirement-accounts",
    number: 14,
    stage: "silver",
    title: "Retirement Accounts",
    oneLiner: "401(k), IRA, brokerage. The long compound.",
  },
  {
    slug: "skill-business-prep",
    number: 15,
    stage: "silver",
    title: "Skill & Business Preparation",
    oneLiner: "Investing in your earning capacity. Courses, conferences, side-project tools.",
  },
  {
    slug: "leisure-lifestyle",
    number: 16,
    stage: "silver",
    title: "Leisure & Lifestyle",
    oneLiner: "Hobbies, travel, gifts. The line you draw on yourself.",
  },
  {
    slug: "silver-complete",
    number: 17,
    stage: "silver",
    title: "Silver Complete",
    oneLiner: "The movement is built. Now multiplication.",
  },

  // Stage 4: Gold
  {
    slug: "aggressive-trading",
    number: 18,
    stage: "gold",
    title: "Aggressive Trading",
    oneLiner: "Readiness check. Skill, proof, system, surplus. All four required.",
  },
  {
    slug: "active-business-investment",
    number: 19,
    stage: "gold",
    title: "Active Business Investment",
    oneLiner: "6-month liability calculator. Are you ready to deploy, or do you build more first?",
  },

  // Stage 5: Goals + Numbers + Flow
  {
    slug: "giving-board",
    number: 20,
    stage: "gold",
    title: "Build Your Giving Board",
    oneLiner: "Daily, monthly, yearly, 3-year, 10-year. Decide what you give before what you receive.",
  },
  {
    slug: "get-real-numbers",
    number: 21,
    stage: "gold",
    title: "Get The Real Numbers",
    oneLiner: "Upload your bank statements. AI extracts every transaction.",
  },
  {
    slug: "categorize-spending",
    number: 22,
    stage: "gold",
    title: "Categorize Your Spending",
    oneLiner: "Every transaction in one of the 10 buckets. AI suggests; you confirm.",
  },
  {
    slug: "money-flow",
    number: 23,
    stage: "gold",
    title: "Build The Flow",
    oneLiner: "9 accounts. 6 checking + 3 savings. Take this sheet to your bank.",
  },

  // Stage 6: Legacy
  {
    slug: "inheritance-foundation",
    number: 24,
    stage: "legacy",
    title: "The Foundation of Inheritance",
    oneLiner: "A good man leaves an inheritance to his children's children.",
    scripture: { text: "A good man leaves an inheritance to his children's children, but the wealth of the sinner is stored up for the righteous.", reference: "Proverbs 13:22", translation: "NKJV" },
  },
  {
    slug: "how-much-needed",
    number: 25,
    stage: "legacy",
    title: "How Much Is Needed",
    oneLiner: "The math of legacy. Today's dollars. Future need. The number.",
  },
  {
    slug: "how-math-works",
    number: 26,
    stage: "legacy",
    title: "How The Math Works",
    oneLiner: "Inflation, compounding, purchasing power — explained.",
  },
  {
    slug: "three-paths",
    number: 27,
    stage: "legacy",
    title: "Three Paths Forward",
    oneLiner: "Investor / Earner / Hybrid. Pick yours.",
  },
  {
    slug: "personal-legacy-plan",
    number: 28,
    stage: "legacy",
    title: "Your Personal Legacy Plan",
    oneLiner: "30-year projection. The full picture. Yours.",
  },
];

export const MODULES_BY_SLUG: Record<string, ModuleDefinition> = Object.fromEntries(
  MODULES.map((m) => [m.slug, m]),
);

export function moduleIndex(slug: string): number {
  return MODULES.findIndex((m) => m.slug === slug);
}

export function nextModule(slug: string): ModuleDefinition | null {
  const i = moduleIndex(slug);
  if (i < 0 || i >= MODULES.length - 1) return null;
  return MODULES[i + 1] ?? null;
}

export function prevModule(slug: string): ModuleDefinition | null {
  const i = moduleIndex(slug);
  if (i <= 0) return null;
  return MODULES[i - 1] ?? null;
}

export function modulesByStage(stage: ModuleStage): ModuleDefinition[] {
  return MODULES.filter((m) => m.stage === stage);
}

export const STAGE_LABELS: Record<ModuleStage, string> = {
  welcome: "Welcome",
  livestock: "Livestock",
  silver: "Silver",
  gold: "Gold",
  legacy: "Legacy",
};
