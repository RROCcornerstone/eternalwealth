/**
 * Engine 1 — Legacy Math (Spec §MATH ENGINES → ENGINE 1)
 *
 * Triggered on Act 2 Screen 2.9. Computes the lump sum needed at retirement
 * to fund the user, their children, and their grandchildren — and the monthly
 * contribution required to get there.
 */

export const NOMINAL_RETURN = 0.10;
export const INFLATION = 0.03;
export const REAL_RETURN = (1 + NOMINAL_RETURN) / (1 + INFLATION) - 1; // ≈ 0.0680
export const RETIREMENT_AGE = 65;
export const RETIREMENT_DURATION = 30; // years
export const HEIR_DURATION = 30; // years

export function annuityFactor(r: number, n: number): number {
  if (Math.abs(r) < 1e-9) return n;
  return (1 - Math.pow(1 + r, -n)) / r;
}

export interface LegacyInputs {
  current_age: number;
  num_children: number;
  num_grandchildren: number;
  retirement_spending_today: number;   // dollars
  gift_per_child_today: number;        // dollars
  gift_per_grandchild_today: number;   // dollars
}

export interface LegacyOutputs {
  years_to_retirement: number;
  LS_retirement: number;
  LS_per_child: number;
  LS_all_children: number;
  LS_per_grandchild_at_retirement: number;
  LS_all_grandchildren: number;
  LS_total_today: number;
  LS_total_nominal: number;
  pmt_monthly: number;
  annual_income_needed: number;
}

export function computeLegacy(input: LegacyInputs): LegacyOutputs {
  const years_to_retirement = Math.max(0, RETIREMENT_AGE - input.current_age);

  const af = annuityFactor(REAL_RETURN, 30); // ≈ 12.665

  const LS_retirement     = input.retirement_spending_today * af;
  const LS_per_child      = input.gift_per_child_today * af;
  const LS_per_grandchild = input.gift_per_grandchild_today * af;

  // Discount grandchildren back to retirement (their gifts begin 30 yrs after retirement)
  const LS_per_grandchild_at_retirement = LS_per_grandchild / Math.pow(1 + REAL_RETURN, 30);

  const LS_all_children = LS_per_child * input.num_children;
  const LS_all_grandchildren = LS_per_grandchild_at_retirement * input.num_grandchildren;

  const LS_total_today = LS_retirement + LS_all_children + LS_all_grandchildren;
  const LS_total_nominal = LS_total_today * Math.pow(1 + INFLATION, years_to_retirement);

  // Monthly contribution to reach LS_total_nominal at retirement, compounding monthly at nominal_return
  const monthly_rate = NOMINAL_RETURN / 12;
  const total_months = 12 * years_to_retirement;
  const pmt_monthly = total_months > 0
    ? LS_total_nominal * monthly_rate / (Math.pow(1 + monthly_rate, total_months) - 1)
    : 0;

  // 10% rule — invest 10% of annual income
  const annual_income_needed = (pmt_monthly * 12) / 0.10;

  return {
    years_to_retirement,
    LS_retirement,
    LS_per_child,
    LS_all_children,
    LS_per_grandchild_at_retirement,
    LS_all_grandchildren,
    LS_total_today,
    LS_total_nominal,
    pmt_monthly,
    annual_income_needed,
  };
}

/**
 * Compound growth chart series for Screen 2.12.
 * Returns an array of {age, balance} from current_age → retirement_age,
 * assuming pmt_monthly invested monthly at NOMINAL_RETURN.
 */
export function compoundGrowthSeries(
  current_age: number,
  pmt_monthly: number,
): { age: number; balance: number }[] {
  const series: { age: number; balance: number }[] = [];
  let balance = 0;
  const monthly_rate = NOMINAL_RETURN / 12;
  for (let age = current_age; age <= RETIREMENT_AGE; age++) {
    series.push({ age, balance });
    // 12 months of compounding + contributions
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthly_rate) + pmt_monthly;
    }
  }
  return series;
}
