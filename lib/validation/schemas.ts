import { z } from "zod";

/* =============================================================
   ONBOARDING — 10-step intake
   ============================================================= */

export const maritalStatusEnum = z.enum(["single", "married", "divorced", "widowed", "other"]);
export const faithContextEnum = z.enum([
  "practicing_christian",
  "exploring",
  "not_religious",
  "prefer_not_to_say",
]);

export const onboardingSchema = z.object({
  full_name: z.string().min(1, "Required").max(120),
  age: z.number().int().min(18, "Must be 18 or older to use Eternal Wealth").max(120),
  marital_status: maritalStatusEnum,
  num_children: z.number().int().min(0).max(15),
  num_planned_grandchildren: z.number().int().min(0).max(60),
  annual_income_cents: z.number().int().min(0),
  retirement_age_goal: z.number().int().min(40).max(99),
  retirement_income_goal_cents: z.number().int().min(0),
  faith_context: faithContextEnum,
  notes: z.string().max(2000).optional().nullable(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

/* =============================================================
   MODULE RESPONSES — per-module shapes
   ============================================================= */

export const moduleResponseBaseSchema = z.object({
  module_slug: z.string().min(1),
  data: z.record(z.string(), z.unknown()),
});

// M01 / welcome
export const welcomeSchema = z.object({
  money_relationship_sentence: z.string().min(1).max(500),
});

// M02 / pause
export const pauseSchema = z.object({
  committed_to_finish: z.literal(true),
});

// M03 / financial-order
export const financialOrderSchema = z.object({
  current_stage: z.enum(["pre_livestock", "livestock", "silver", "gold"]),
});

// M05 / receiving-account
export const receivingAccountSchema = z.object({
  bank_name: z.string().optional(),
  account_nickname: z.string().optional(),
  is_set_up: z.boolean(),
  notes: z.string().optional(),
});

// M06 / tithes
export const tithesSchema = z.object({
  monthly_tithe_cents: z.number().int().min(0),
  giving_destination: z.string().min(1).max(200),
  destination_notes: z.string().optional(),
});

// M07 / core-bills
export const coreBillsLineItem = z.object({
  label: z.string().min(1).max(80),
  amount_cents: z.number().int().min(0),
});
export const coreBillsSchema = z.object({
  items: z.array(coreBillsLineItem).max(40),
  monthly_total_cents: z.number().int().min(0),
});

// M08 / food
export const foodSchema = z.object({
  monthly_total_cents: z.number().int().min(0),
  groceries_cents: z.number().int().min(0).optional(),
  eating_out_cents: z.number().int().min(0).optional(),
});

// M09 / health-wellness
export const healthWellnessSchema = z.object({
  monthly_total_cents: z.number().int().min(0),
  commitments: z.array(z.string()).max(10),
});

// M10 / savings
export const savingsSchema = z.object({
  monthly_amount_cents: z.number().int().min(0),
});

// M11 / minimum-debt
export const debtItemSchema = z.object({
  label: z.string().min(1).max(80),
  balance_cents: z.number().int().min(0),
  min_payment_cents: z.number().int().min(0),
  apr: z.number().min(0).max(100).optional(),
});
export const minimumDebtSchema = z.object({
  items: z.array(debtItemSchema).max(40),
  monthly_minimums_cents: z.number().int().min(0),
});

// M13 / aggressive-debt-payoff
export const aggressiveDebtSchema = z.object({
  extra_payment_cents: z.number().int().min(0),
  strategy: z.enum(["snowball", "avalanche"]),
});

// M14 / retirement-accounts
export const retirementSchema = z.object({
  monthly_contribution_cents: z.number().int().min(0),
  account_types: z.array(z.enum(["401k", "ira_traditional", "ira_roth", "brokerage", "hsa", "other"])),
});

// M15 / skill-business-prep
export const skillBusinessSchema = z.object({
  monthly_cents: z.number().int().min(0),
  twelve_month_reflection: z.string().max(1000),
});

// M16 / leisure-lifestyle
export const leisureSchema = z.object({
  monthly_cents: z.number().int().min(0),
  breakdown: z.record(z.string(), z.number().int().min(0)).optional(),
});

// M18 / aggressive-trading
export const aggressiveTradingSchema = z.object({
  has_skill: z.boolean(),
  has_proof: z.boolean(),
  has_system: z.boolean(),
  has_surplus: z.boolean(),
});

// M19 / active-business-investment
export const activeBusinessSchema = z.object({
  six_month_living_costs_cents: z.number().int().min(0),
  surplus_cents: z.number().int().min(0),
  momentum_checks: z.array(z.string()).max(10),
});

// M20 / giving-board
export const givingBoardSchema = z.object({
  daily_intention: z.string().max(500).optional(),
  monthly_cents: z.number().int().min(0),
  yearly_cents: z.number().int().min(0),
  three_year_cents: z.number().int().min(0),
  ten_year_cents: z.number().int().min(0),
  giving_destination: z.string().optional(),
});

// M25 / how-much-needed
export const legacyInputsSchema = z.object({
  current_age: z.number().int().min(13).max(120),
  retirement_age: z.number().int().min(40).max(99),
  retirement_annual_need_cents: z.number().int().min(0),
  inflation_rate: z.number().min(0).max(0.2).default(0.03),
  expected_return_rate: z.number().min(0).max(0.5).default(0.1),
  num_children: z.number().int().min(0).max(15),
  num_grandchildren: z.number().int().min(0).max(60),
  inheritance_per_child_cents: z.number().int().min(0).default(50000000), // $500k
  inheritance_per_grandchild_cents: z.number().int().min(0).default(20000000), // $200k
});

// M27 / three-paths
export const threePathsSchema = z.object({
  selected: z.enum(["plan_a_investor", "plan_b_earner", "plan_c_hybrid"]),
});
