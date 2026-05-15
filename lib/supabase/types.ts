/**
 * Hand-rolled Supabase types matching `supabase/migrations/0001_initial_schema.sql`.
 *
 * In production, regenerate from the live DB with:
 *   supabase gen types typescript --linked > lib/supabase/types.ts
 *
 * Until a live Supabase project exists (see ACTION_REQUIRED.md), these hand-rolled
 * types let TS compile correctly against the documented schema.
 */

export type SpendingCategory =
  | "tithes_offerings"
  | "core_bills"
  | "food"
  | "health_wellness"
  | "savings"
  | "debt_repayment"
  | "retirement_investment"
  | "leisure_lifestyle"
  | "skill_business_prep"
  | "active_business_investment";

export type UploadStatus =
  | "uploaded"
  | "parsing"
  | "parsed"
  | "categorizing"
  | "complete"
  | "error";

export type AccountType =
  | "receiving_checking"
  | "tithes_savings"
  | "core_bills_checking"
  | "food_checking"
  | "health_wellness_checking"
  | "skill_business_checking"
  | "leisure_lifestyle_checking"
  | "general_savings"
  | "aggressive_payoff_savings";

export type MaritalStatus = "single" | "married" | "divorced" | "widowed" | "other";
export type FaithContext = "practicing_christian" | "exploring" | "not_religious" | "prefer_not_to_say";
export type LegacyPlan = "plan_a_investor" | "plan_b_earner" | "plan_c_hybrid";

export interface UserProfile {
  user_id: string;
  full_name: string | null;
  age: number | null;
  marital_status: MaritalStatus | null;
  num_children: number;
  num_planned_grandchildren: number;
  annual_income_cents: number | null;
  retirement_age_goal: number;
  retirement_income_goal_cents: number;
  faith_context: FaithContext | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface CourseProgress {
  user_id: string;
  current_module_slug: string;
  completed_modules: string[];
  livestock_complete: boolean;
  silver_complete: boolean;
  gold_complete: boolean;
  last_active_at: string;
}

export interface ModuleResponse {
  id: string;
  user_id: string;
  module_slug: string;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CategoryBudget {
  id: string;
  user_id: string;
  category: SpendingCategory;
  target_cents: number;
  created_at: string;
  updated_at: string;
}

export interface StatementUpload {
  id: string;
  user_id: string;
  storage_path: string;
  original_filename: string | null;
  bank_detected: string | null;
  status: UploadStatus;
  statement_period_start: string | null;
  statement_period_end: string | null;
  error_message: string | null;
  created_at: string;
}

export interface TransactionRow {
  id: string;
  user_id: string;
  upload_id: string | null;
  transaction_date: string;
  description: string;
  amount_cents: number;
  category: SpendingCategory | null;
  ai_confidence: number | null;
  user_confirmed: boolean;
  user_corrected: boolean;
  created_at: string;
}

export interface GivingBoard {
  user_id: string;
  daily_intention: string | null;
  monthly_giving_goal_cents: number | null;
  yearly_giving_goal_cents: number | null;
  three_year_giving_goal_cents: number | null;
  ten_year_giving_goal_cents: number | null;
  monthly_growth_rate: number;
  giving_destination: string | null;
  updated_at: string;
}

export interface AccountSetupRow {
  id: string;
  user_id: string;
  account_type: AccountType;
  is_set_up: boolean;
  bank_name: string | null;
  nickname: string | null;
  has_debit_card: boolean;
  notes: string | null;
  set_up_at: string | null;
}

export interface LegacyPlanRow {
  user_id: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  selected_plan: LegacyPlan | null;
  expected_return_rate: number;
  inflation_rate: number;
  calculated_at: string;
}

export interface AIJob {
  id: string;
  user_id: string;
  job_type: string;
  upload_id: string | null;
  model: string;
  input_tokens: number | null;
  output_tokens: number | null;
  cost_cents: number | null;
  duration_ms: number | null;
  status: string;
  error: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      user_profiles: { Row: UserProfile; Insert: Partial<UserProfile> & Pick<UserProfile, "user_id">; Update: Partial<UserProfile> };
      course_progress: { Row: CourseProgress; Insert: Partial<CourseProgress> & Pick<CourseProgress, "user_id">; Update: Partial<CourseProgress> };
      module_responses: { Row: ModuleResponse; Insert: Omit<ModuleResponse, "id" | "created_at" | "updated_at"> & Partial<Pick<ModuleResponse, "id">>; Update: Partial<ModuleResponse> };
      category_budgets: { Row: CategoryBudget; Insert: Omit<CategoryBudget, "id" | "created_at" | "updated_at"> & Partial<Pick<CategoryBudget, "id">>; Update: Partial<CategoryBudget> };
      statement_uploads: { Row: StatementUpload; Insert: Omit<StatementUpload, "id" | "created_at"> & Partial<Pick<StatementUpload, "id">>; Update: Partial<StatementUpload> };
      transactions: { Row: TransactionRow; Insert: Omit<TransactionRow, "id" | "created_at"> & Partial<Pick<TransactionRow, "id">>; Update: Partial<TransactionRow> };
      giving_board: { Row: GivingBoard; Insert: Partial<GivingBoard> & Pick<GivingBoard, "user_id">; Update: Partial<GivingBoard> };
      account_setup: { Row: AccountSetupRow; Insert: Omit<AccountSetupRow, "id"> & Partial<Pick<AccountSetupRow, "id">>; Update: Partial<AccountSetupRow> };
      legacy_plans: { Row: LegacyPlanRow; Insert: Partial<LegacyPlanRow> & Pick<LegacyPlanRow, "user_id" | "inputs" | "outputs">; Update: Partial<LegacyPlanRow> };
      ai_jobs: { Row: AIJob; Insert: Omit<AIJob, "id" | "created_at"> & Partial<Pick<AIJob, "id">>; Update: Partial<AIJob> };
    };
    Enums: {
      spending_category: SpendingCategory;
      upload_status: UploadStatus;
      account_type: AccountType;
    };
  };
}
