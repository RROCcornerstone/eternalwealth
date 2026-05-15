-- ============================================================================
-- Eternal Wealth Framework — Initial Schema
-- Master Prompt v2 Section 5
-- ============================================================================

-- Enums --------------------------------------------------------------------

create type spending_category as enum (
  'tithes_offerings',
  'core_bills',
  'food',
  'health_wellness',
  'savings',
  'debt_repayment',
  'retirement_investment',
  'leisure_lifestyle',
  'skill_business_prep',
  'active_business_investment'
);

create type upload_status as enum (
  'uploaded',
  'parsing',
  'parsed',
  'categorizing',
  'complete',
  'error'
);

create type account_type as enum (
  'receiving_checking',
  'tithes_savings',
  'core_bills_checking',
  'food_checking',
  'health_wellness_checking',
  'skill_business_checking',
  'leisure_lifestyle_checking',
  'general_savings',
  'aggressive_payoff_savings'
);

-- Utility ------------------------------------------------------------------

create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Tables -------------------------------------------------------------------

create table user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  age int,
  marital_status text check (marital_status in ('single', 'married', 'divorced', 'widowed', 'other')),
  num_children int default 0,
  num_planned_grandchildren int default 0,
  annual_income_cents bigint,
  retirement_age_goal int default 65,
  retirement_income_goal_cents bigint default 8000000,
  faith_context text check (faith_context in ('practicing_christian', 'exploring', 'not_religious', 'prefer_not_to_say')),
  timezone text default 'America/New_York',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger user_profiles_set_updated_at before update on user_profiles
for each row execute function set_updated_at();

create table course_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_module_slug text not null default 'welcome',
  completed_modules text[] default '{}',
  livestock_complete boolean default false,
  silver_complete boolean default false,
  gold_complete boolean default false,
  last_active_at timestamptz default now()
);

create table module_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_slug text not null,
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, module_slug)
);

create trigger module_responses_set_updated_at before update on module_responses
for each row execute function set_updated_at();

create table category_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category spending_category not null,
  target_cents bigint not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, category)
);

create trigger category_budgets_set_updated_at before update on category_budgets
for each row execute function set_updated_at();

create table statement_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  original_filename text,
  bank_detected text,
  status upload_status not null default 'uploaded',
  statement_period_start date,
  statement_period_end date,
  error_message text,
  created_at timestamptz default now()
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  upload_id uuid references statement_uploads(id) on delete cascade,
  transaction_date date not null,
  description text not null,
  amount_cents bigint not null,
  category spending_category,
  ai_confidence numeric(3,2),
  user_confirmed boolean default false,
  user_corrected boolean default false,
  created_at timestamptz default now()
);
create index on transactions(user_id, transaction_date desc);
create index on transactions(user_id, category);

create table giving_board (
  user_id uuid primary key references auth.users(id) on delete cascade,
  daily_intention text,
  monthly_giving_goal_cents bigint,
  yearly_giving_goal_cents bigint,
  three_year_giving_goal_cents bigint,
  ten_year_giving_goal_cents bigint,
  monthly_growth_rate numeric(4,3) default 0.050,
  giving_destination text,
  updated_at timestamptz default now()
);

create trigger giving_board_set_updated_at before update on giving_board
for each row execute function set_updated_at();

create table account_setup (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_type account_type not null,
  is_set_up boolean default false,
  bank_name text,
  nickname text,
  has_debit_card boolean default false,
  notes text,
  set_up_at timestamptz,
  unique(user_id, account_type)
);

create table legacy_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  inputs jsonb not null,
  outputs jsonb not null,
  selected_plan text check (selected_plan in ('plan_a_investor', 'plan_b_earner', 'plan_c_hybrid')),
  expected_return_rate numeric(4,3) default 0.100,
  inflation_rate numeric(4,3) default 0.030,
  calculated_at timestamptz default now()
);

create table ai_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_type text not null,
  upload_id uuid references statement_uploads(id) on delete cascade,
  model text not null,
  input_tokens int,
  output_tokens int,
  cost_cents int,
  duration_ms int,
  status text not null,
  error text,
  created_at timestamptz default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table user_profiles enable row level security;
alter table course_progress enable row level security;
alter table module_responses enable row level security;
alter table category_budgets enable row level security;
alter table statement_uploads enable row level security;
alter table transactions enable row level security;
alter table giving_board enable row level security;
alter table account_setup enable row level security;
alter table legacy_plans enable row level security;
alter table ai_jobs enable row level security;

-- Policy template: owner sees / modifies their own rows --------------------

create policy "users access their own user_profiles" on user_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users access their own course_progress" on course_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users access their own module_responses" on module_responses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users access their own category_budgets" on category_budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users access their own statement_uploads" on statement_uploads
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users access their own transactions" on transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users access their own giving_board" on giving_board
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users access their own account_setup" on account_setup
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users access their own legacy_plans" on legacy_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users access their own ai_jobs" on ai_jobs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS — auto-seed course_progress on new user
-- ============================================================================

create or replace function init_user_progress() returns trigger as $$
begin
  insert into course_progress (user_id, current_module_slug)
  values (new.id, 'welcome')
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users
for each row execute function init_user_progress();
