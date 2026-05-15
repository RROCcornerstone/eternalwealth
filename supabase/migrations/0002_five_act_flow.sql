-- ============================================================================
-- Eternal Wealth — Schema Migration 0002
-- Adds new fields for the 5-Act flow per the App Specification doc
-- ============================================================================

-- Augment user_profiles with new Act-1/2/3 fields
alter table user_profiles
  add column if not exists foundation_status text check (foundation_status in ('cattle', 'silver', 'gold')),
  add column if not exists margin_status text check (margin_status in ('cattle', 'silver', 'gold')),
  add column if not exists self_id text check (self_id in ('cattle', 'silver', 'gold')),
  add column if not exists phone text,
  add column if not exists first_name text;

-- Track which Act / screen the user is currently on
alter table course_progress
  add column if not exists current_act int default 1 check (current_act between 1 and 5),
  add column if not exists current_screen text default '1.1',
  add column if not exists completed_screens text[] default '{}',
  add column if not exists act1_complete boolean default false,
  add column if not exists act2_complete boolean default false,
  add column if not exists act3_complete boolean default false,
  add column if not exists act4_complete boolean default false,
  add column if not exists act5_complete boolean default false,
  add column if not exists actual_brand text check (actual_brand in ('cattle', 'silver', 'gold')),
  add column if not exists brand_comparison text check (brand_comparison in ('match', 'overestimated', 'underestimated'));

-- Legacy plan numerics
alter table legacy_plans
  add column if not exists retirement_spending_today bigint,
  add column if not exists gift_per_child_today bigint,
  add column if not exists gift_per_grandchild_today bigint,
  add column if not exists ls_retirement_cents bigint,
  add column if not exists ls_per_child_cents bigint,
  add column if not exists ls_per_grandchild_at_retirement_cents bigint,
  add column if not exists ls_all_children_cents bigint,
  add column if not exists ls_all_grandchildren_cents bigint,
  add column if not exists ls_total_today_cents bigint,
  add column if not exists ls_total_nominal_cents bigint,
  add column if not exists pmt_monthly_cents bigint,
  add column if not exists annual_income_needed_cents bigint;

-- Cash-flow snapshot (computed after Act 3)
create table if not exists cash_flow_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  monthly_income_cents bigint not null,
  monthly_expenses_cents bigint not null,
  monthly_gap_cents bigint not null,
  savings_rate numeric(5,4) not null,
  months_of_data int not null default 3,
  category_monthly_avg jsonb not null,
  category_percent jsonb not null,
  computed_at timestamptz default now()
);

alter table cash_flow_snapshots enable row level security;
drop policy if exists "users access their own cash_flow_snapshots" on cash_flow_snapshots;
create policy "users access their own cash_flow_snapshots" on cash_flow_snapshots
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Act 5 Cattle path: career purpose answers
create table if not exists career_purpose (
  user_id uuid primary key references auth.users(id) on delete cascade,
  answers jsonb not null,
  direction text,
  updated_at timestamptz default now()
);
alter table career_purpose enable row level security;
drop policy if exists "users access their own career_purpose" on career_purpose;
create policy "users access their own career_purpose" on career_purpose
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Act 5 Silver path: investment blueprint state
create table if not exists investment_blueprint (
  user_id uuid primary key references auth.users(id) on delete cascade,
  coinbase_setup boolean default false,
  invest_btc_cents bigint,
  invest_eth_cents bigint,
  invest_retirement_cents bigint,
  total_invest_cents bigint,
  committed_at timestamptz
);
alter table investment_blueprint enable row level security;
drop policy if exists "users access their own investment_blueprint" on investment_blueprint;
create policy "users access their own investment_blueprint" on investment_blueprint
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Act 5 Gold path: booking confirmation
alter table user_profiles
  add column if not exists call_booking_id text,
  add column if not exists call_scheduled_for timestamptz;

-- Income verification: extend transactions to mark verified income
alter table transactions
  add column if not exists transaction_type text default 'expense' check (transaction_type in ('income', 'expense', 'transfer')),
  add column if not exists is_verified_income boolean default false;
