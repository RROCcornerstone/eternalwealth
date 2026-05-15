/**
 * The 5-Act flow registry. Replaces the old MODULES list.
 *
 * Source: Eternal Wealth Framework — Web App Specification (5 Acts, 51 screens).
 *
 * Screen IDs follow the spec exactly: "1.1", "1.12", "5C.1" (Cattle path),
 * "5S.1" (Silver), "5G.1" (Gold).
 *
 * URL slugs replace `.` with `-` for path safety: "1-1", "5c-1", etc.
 */

export type ActId = 1 | 2 | 3 | 4 | 5;
export type Brand = "cattle" | "silver" | "gold";

export interface ScreenDef {
  id: string;           // "1.1" through "5G.3"
  slug: string;         // URL-safe: "1-1" through "5g-3"
  act: ActId;
  pathBrand?: Brand;    // only set for Act 5 screens
  index: number;        // 1..N within Act (or within path for Act 5)
  title: string;
  oneLiner: string;     // For sidebar / progress display
}

const screens: ScreenDef[] = [
  // ─────────────────────────── ACT 1 ───────────────────────────
  { id: "1.1",  slug: "1-1",  act: 1, index: 1,  title: "Welcome",                    oneLiner: "Before you build wealth — God's blueprint." },
  { id: "1.2",  slug: "1-2",  act: 1, index: 2,  title: "The Law of First Mention",   oneLiner: "Why Genesis sets the weight." },
  { id: "1.3",  slug: "1-3",  act: 1, index: 3,  title: "Genesis 13:2 in Hebrew",     oneLiner: "Where 'rich' first appears." },
  { id: "1.4",  slug: "1-4",  act: 1, index: 4,  title: "Rich = Heavy",               oneLiner: "Kaved — the weight of glory." },
  { id: "1.5",  slug: "1-5",  act: 1, index: 5,  title: "Cattle — Foundation",        oneLiner: "Mikneh — acquired possessions." },
  { id: "1.6",  slug: "1-6",  act: 1, index: 6,  title: "Silver — Strategic Growth",  oneLiner: "Kesef — currency of motion." },
  { id: "1.7",  slug: "1-7",  act: 1, index: 7,  title: "Gold — Multiplication",      oneLiner: "Zahav — currency of kings." },
  { id: "1.8",  slug: "1-8",  act: 1, index: 8,  title: "The Order is Everything",    oneLiner: "Cattle → Silver → Gold. Never skip." },
  { id: "1.9",  slug: "1-9",  act: 1, index: 9,  title: "Foundation",                 oneLiner: "Where's your foundation?" },
  { id: "1.10", slug: "1-10", act: 1, index: 10, title: "Margin",                     oneLiner: "What's left over each month?" },
  { id: "1.11", slug: "1-11", act: 1, index: 11, title: "Self-ID",                    oneLiner: "Where do you think you are?" },
  { id: "1.12", slug: "1-12", act: 1, index: 12, title: "Transition",                 oneLiner: "Now let's set your destination." },

  // ─────────────────────────── ACT 2 ───────────────────────────
  { id: "2.1",  slug: "2-1",  act: 2, index: 1,  title: "Your Name",                  oneLiner: "Let's build your legacy." },
  { id: "2.2",  slug: "2-2",  act: 2, index: 2,  title: "Current Age",                oneLiner: "Every calculation pivots on this." },
  { id: "2.3",  slug: "2-3",  act: 2, index: 3,  title: "Children",                   oneLiner: "How many?" },
  { id: "2.4",  slug: "2-4",  act: 2, index: 4,  title: "Grandchildren",              oneLiner: "Two generations forward." },
  { id: "2.5",  slug: "2-5",  act: 2, index: 5,  title: "Proverbs 13:22",             oneLiner: "Children's children — yanchil." },
  { id: "2.6",  slug: "2-6",  act: 2, index: 6,  title: "Retirement Lifestyle",       oneLiner: "What kind of life at 65?" },
  { id: "2.7",  slug: "2-7",  act: 2, index: 7,  title: "Gift Per Child",             oneLiner: "Annual gift × 30 years." },
  { id: "2.8",  slug: "2-8",  act: 2, index: 8,  title: "Gift Per Grandchild",        oneLiner: "Yanchil in dollars." },
  { id: "2.9",  slug: "2-9",  act: 2, index: 9,  title: "Save Your Plan",             oneLiner: "Email + phone — your number is ready." },
  { id: "2.10", slug: "2-10", act: 2, index: 10, title: "The Reveal",                 oneLiner: "Here's God's standard for your family." },
  { id: "2.11", slug: "2-11", act: 2, index: 11, title: "The Breakdown",              oneLiner: "What that number covers." },
  { id: "2.12", slug: "2-12", act: 2, index: 12, title: "The Path",                   oneLiner: "Monthly contribution + 10% rule." },
  { id: "2.13", slug: "2-13", act: 2, index: 13, title: "Transition",                 oneLiner: "Now let's see where you actually are." },

  // ─────────────────────────── ACT 3 ───────────────────────────
  { id: "3.1",  slug: "3-1",  act: 3, index: 1,  title: "Upload Instructions",        oneLiner: "Last 3 months. Every account." },
  { id: "3.2",  slug: "3-2",  act: 3, index: 2,  title: "Upload Files",               oneLiner: "Drop your statements." },
  { id: "3.3",  slug: "3-3",  act: 3, index: 3,  title: "Processing",                 oneLiner: "Reading & categorizing." },
  { id: "3.4",  slug: "3-4",  act: 3, index: 4,  title: "Categorize Review",          oneLiner: "Confirm or correct each row." },
  { id: "3.5",  slug: "3-5",  act: 3, index: 5,  title: "Income Verification",        oneLiner: "Real income vs transfers." },
  { id: "3.6",  slug: "3-6",  act: 3, index: 6,  title: "Confirm & Submit",           oneLiner: "Your real financial picture." },

  // ─────────────────────────── ACT 4 ───────────────────────────
  { id: "4.1",  slug: "4-1",  act: 4, index: 1,  title: "Pre-Reveal",                 oneLiner: "Running the math." },
  { id: "4.2",  slug: "4-2",  act: 4, index: 2,  title: "Brand Reveal",               oneLiner: "Your financial brand." },
  { id: "4.3",  slug: "4-3",  act: 4, index: 3,  title: "Self-ID Comparison",         oneLiner: "What you said vs. what the math says." },
  { id: "4.4",  slug: "4-4",  act: 4, index: 4,  title: "The Math",                   oneLiner: "Why you're in this brand." },
  { id: "4.5",  slug: "4-5",  act: 4, index: 5,  title: "Transition to Path",         oneLiner: "Let's build your roadmap." },

  // ─────────────────── ACT 5 — CATTLE PATH ───────────────────
  { id: "5C.1", slug: "5c-1", act: 5, pathBrand: "cattle", index: 1, title: "Welcome to Cattle",        oneLiner: "Foundation level. Where every legacy starts." },
  { id: "5C.2", slug: "5c-2", act: 5, pathBrand: "cattle", index: 2, title: "The Two Options",          oneLiner: "Better job, or second job." },
  { id: "5C.3", slug: "5c-3", act: 5, pathBrand: "cattle", index: 3, title: "Find Your Purpose",        oneLiner: "God-given direction first." },
  { id: "5C.4", slug: "5c-4", act: 5, pathBrand: "cattle", index: 4, title: "Volume + Quality",         oneLiner: "20 applications per week." },
  { id: "5C.5", slug: "5c-5", act: 5, pathBrand: "cattle", index: 5, title: "Daily Action Plan",        oneLiner: "Morning. Midday. Evening." },
  { id: "5C.6", slug: "5c-6", act: 5, pathBrand: "cattle", index: 6, title: "Keep Going",               oneLiner: "Until secured. Then keep going." },

  // ─────────────────── ACT 5 — SILVER PATH ───────────────────
  { id: "5S.1", slug: "5s-1", act: 5, pathBrand: "silver", index: 1, title: "Welcome to Silver",        oneLiner: "Widen the gap." },
  { id: "5S.2", slug: "5s-2", act: 5, pathBrand: "silver", index: 2, title: "The Gap Strategy",         oneLiner: "Get to 25% savings rate." },
  { id: "5S.3", slug: "5s-3", act: 5, pathBrand: "silver", index: 3, title: "Income + Discipline",      oneLiner: "Grow income. Cut leaks." },
  { id: "5S.4", slug: "5s-4", act: 5, pathBrand: "silver", index: 4, title: "Two Ways to Invest",       oneLiner: "Career + market. Both." },
  { id: "5S.5", slug: "5s-5", act: 5, pathBrand: "silver", index: 5, title: "Coinbase Setup",           oneLiner: "Start accumulating BTC + ETH." },
  { id: "5S.6", slug: "5s-6", act: 5, pathBrand: "silver", index: 6, title: "Investment Blueprint",     oneLiner: "Allocation. Auto-invest. Forget." },

  // ─────────────────── ACT 5 — GOLD PATH ───────────────────
  { id: "5G.1", slug: "5g-1", act: 5, pathBrand: "gold", index: 1, title: "Welcome to Gold",            oneLiner: "Multiplication. Custom playbook." },
  { id: "5G.2", slug: "5g-2", act: 5, pathBrand: "gold", index: 2, title: "1-on-1 Coaching",            oneLiner: "Book a strategy call." },
  { id: "5G.3", slug: "5g-3", act: 5, pathBrand: "gold", index: 3, title: "Booking Confirmation",       oneLiner: "You're booked. See you on the call." },
];

export const SCREENS: ScreenDef[] = screens;
export const SCREENS_BY_ID: Record<string, ScreenDef> = Object.fromEntries(screens.map((s) => [s.id, s]));
export const SCREENS_BY_SLUG: Record<string, ScreenDef> = Object.fromEntries(screens.map((s) => [s.slug, s]));

export const ACT_TITLES: Record<ActId, string> = {
  1: "God's Eternal Wealth Framework",
  2: "Set Your Legacy",
  3: "Get the Real Numbers",
  4: "Your Financial Brand",
  5: "Your Path Forward",
};

export const ACT_BRAND_THEMES: Record<ActId, string> = {
  1: "framework",
  2: "legacy",
  3: "numbers",
  4: "brand",
  5: "path",
};

/**
 * Compute the next screen in the flow given the current one + branding context.
 * For non-Act-5 screens: walk linearly through all screens in that Act, then jump to Act N+1's screen 1.
 * For Act 5: stay within the assigned brand path.
 */
export function nextScreen(currentId: string, brand?: Brand | null): ScreenDef | null {
  const current = SCREENS_BY_ID[currentId];
  if (!current) return null;

  // Within Act 5 — stay in the brand path
  if (current.act === 5 && current.pathBrand) {
    const sameBrand = SCREENS.filter((s) => s.act === 5 && s.pathBrand === current.pathBrand).sort((a, b) => a.index - b.index);
    const idx = sameBrand.findIndex((s) => s.id === current.id);
    return sameBrand[idx + 1] ?? null;
  }

  // Last screen of Act 4 → first screen of Act 5 (based on brand)
  if (current.act === 4 && current.id === "4.5") {
    const brandKey: Brand = brand ?? "cattle";
    const code = brandKey === "cattle" ? "5C" : brandKey === "silver" ? "5S" : "5G";
    return SCREENS_BY_ID[`${code}.1`] ?? null;
  }

  // Otherwise walk linearly within the act, or jump to next act's screen 1
  const sameAct = SCREENS.filter((s) => s.act === current.act && !s.pathBrand).sort((a, b) => a.index - b.index);
  const idx = sameAct.findIndex((s) => s.id === current.id);
  if (idx >= 0 && idx < sameAct.length - 1) {
    return sameAct[idx + 1] ?? null;
  }

  // End of act — jump to next act
  const nextActId = (current.act + 1) as ActId;
  if (nextActId > 5) return null;
  const firstOfNext = SCREENS.find((s) => s.act === nextActId && s.index === 1 && !s.pathBrand);
  return firstOfNext ?? null;
}

export function prevScreen(currentId: string): ScreenDef | null {
  const current = SCREENS_BY_ID[currentId];
  if (!current) return null;

  // Act 5: walk back within brand path
  if (current.act === 5 && current.pathBrand) {
    const sameBrand = SCREENS.filter((s) => s.act === 5 && s.pathBrand === current.pathBrand).sort((a, b) => a.index - b.index);
    const idx = sameBrand.findIndex((s) => s.id === current.id);
    if (idx > 0) return sameBrand[idx - 1] ?? null;
    return SCREENS_BY_ID["4.5"] ?? null;
  }

  const sameAct = SCREENS.filter((s) => s.act === current.act && !s.pathBrand).sort((a, b) => a.index - b.index);
  const idx = sameAct.findIndex((s) => s.id === current.id);
  if (idx > 0) return sameAct[idx - 1] ?? null;

  // First of act → last of previous act
  const prevActId = (current.act - 1) as ActId;
  if (prevActId < 1) return null;
  const prevActScreens = SCREENS.filter((s) => s.act === prevActId && !s.pathBrand).sort((a, b) => b.index - a.index);
  return prevActScreens[0] ?? null;
}

export function screenProgressPercent(screenId: string, brand?: Brand | null): number {
  const s = SCREENS_BY_ID[screenId];
  if (!s) return 0;
  // Build the linear "user journey" given their brand
  const journey: ScreenDef[] = [];
  for (const act of [1, 2, 3, 4] as ActId[]) {
    SCREENS.filter((x) => x.act === act && !x.pathBrand).sort((a, b) => a.index - b.index).forEach((x) => journey.push(x));
  }
  const pathBrand: Brand = brand ?? "cattle";
  SCREENS.filter((x) => x.act === 5 && x.pathBrand === pathBrand).sort((a, b) => a.index - b.index).forEach((x) => journey.push(x));

  const idx = journey.findIndex((x) => x.id === s.id);
  if (idx < 0) return 0;
  return Math.round(((idx + 1) / journey.length) * 100);
}
