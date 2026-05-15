/**
 * Engine 3 — Brand Determination (Spec §MATH ENGINES → ENGINE 3)
 *
 * Maps savings_rate to a brand and compares against self-ID.
 */

export type Brand = "cattle" | "silver" | "gold";
export type Comparison = "match" | "overestimated" | "underestimated";

const BRAND_ORDER: Record<Brand, number> = { cattle: 0, silver: 1, gold: 2 };

export const CATTLE_MAX_SAVINGS_RATE = 0.10;
export const SILVER_MAX_SAVINGS_RATE = 0.25;

export function determineBrand(savings_rate: number): Brand {
  if (savings_rate < CATTLE_MAX_SAVINGS_RATE) return "cattle";
  if (savings_rate < SILVER_MAX_SAVINGS_RATE) return "silver";
  return "gold";
}

export function compareBrand(self_id: Brand, actual_brand: Brand): Comparison {
  if (BRAND_ORDER[self_id] === BRAND_ORDER[actual_brand]) return "match";
  if (BRAND_ORDER[self_id] > BRAND_ORDER[actual_brand]) return "overestimated";
  return "underestimated";
}

export const BRAND_GLYPH: Record<Brand, string> = {
  cattle: "🐂",
  silver: "🪙",
  gold: "🏆",
};

export const BRAND_LABEL: Record<Brand, string> = {
  cattle: "Cattle",
  silver: "Silver",
  gold: "Gold",
};

export const BRAND_SUBTITLE: Record<Brand, string> = {
  cattle: "Foundation",
  silver: "Strategic Growth",
  gold: "Multiplication",
};
