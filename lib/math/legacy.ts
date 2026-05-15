/**
 * Pure functions for legacy / retirement projections.
 *
 * All money in cents (bigint-safe integer math); all rates as decimals (0.07 = 7%).
 *
 * Math conventions (from Master Prompt v2 Section 8, M25-M28):
 *  - Future value of annual need: FV = PV * (1 + inflation)^n
 *  - Present value lump sum: PV = FV / (1 + r)^n
 *  - Future value of growing annuity: covers continuing-need retirement
 */

const MONTHS_PER_YEAR = 12;

export function compoundFutureValue(presentCents: number, annualRate: number, years: number): number {
  return Math.round(presentCents * Math.pow(1 + annualRate, years));
}

export function presentValueLumpSum(futureCents: number, annualRate: number, years: number): number {
  return Math.round(futureCents / Math.pow(1 + annualRate, years));
}

/**
 * FV of an annual need (annuity-due, paid at start of year).
 * Used to size the retirement nest egg required to fund a constant
 * real-dollar income through retirement years.
 */
export function nestEggRequired(args: {
  annualNeedTodayCents: number;
  yearsToRetirement: number;
  yearsInRetirement: number;
  inflationRate: number;
  withdrawalReturnRate: number;
}): number {
  const { annualNeedTodayCents, yearsToRetirement, yearsInRetirement, inflationRate, withdrawalReturnRate } = args;
  const futureAnnualNeed = compoundFutureValue(annualNeedTodayCents, inflationRate, yearsToRetirement);
  // PV of a 25-year (default) growing annuity at retirement
  // Real rate = (1 + withdrawalReturnRate) / (1 + inflationRate) - 1
  const realRate = (1 + withdrawalReturnRate) / (1 + inflationRate) - 1;
  if (Math.abs(realRate) < 1e-9) {
    return Math.round(futureAnnualNeed * yearsInRetirement);
  }
  // FV at retirement of annuity that pays futureAnnualNeed (in nominal terms, growing with inflation)
  // Equivalent to PV of growing annuity discounted at real rate
  const pvFactor = (1 - Math.pow(1 + realRate, -yearsInRetirement)) / realRate;
  return Math.round(futureAnnualNeed * pvFactor);
}

/**
 * Monthly contribution required to reach a target nest egg, given current savings.
 *  FV = PMT * (((1 + r)^n - 1) / r) * (1 + r)   [annuity-due, monthly]
 * Solve for PMT.
 */
export function monthlyContributionRequired(args: {
  targetCents: number;
  currentSavedCents: number;
  yearsToRetirement: number;
  annualReturnRate: number;
}): number {
  const { targetCents, currentSavedCents, yearsToRetirement, annualReturnRate } = args;
  const months = yearsToRetirement * MONTHS_PER_YEAR;
  const monthlyRate = annualReturnRate / MONTHS_PER_YEAR;
  const currentGrown = currentSavedCents * Math.pow(1 + monthlyRate, months);
  const needed = targetCents - currentGrown;
  if (needed <= 0) return 0;
  if (Math.abs(monthlyRate) < 1e-9) return Math.round(needed / months);
  const annuityFactor = ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  return Math.round(needed / annuityFactor);
}

/**
 * Full legacy projection — series of nest-egg balances year-by-year,
 * with annual contribution + compound growth.
 */
export interface LegacyProjectionInput {
  currentAge: number;
  retirementAge: number;
  yearsInRetirement: number;
  currentSavedCents: number;
  annualContributionCents: number;
  expectedReturnRate: number;
}

export interface LegacyProjectionPoint {
  year: number;
  age: number;
  balanceCents: number;
  contributionsToDateCents: number;
  growthToDateCents: number;
}

export function projectLegacy(input: LegacyProjectionInput): LegacyProjectionPoint[] {
  const { currentAge, retirementAge, currentSavedCents, annualContributionCents, expectedReturnRate } = input;
  const horizon = Math.max(0, retirementAge - currentAge);
  const points: LegacyProjectionPoint[] = [];
  let balance = currentSavedCents;
  let totalContrib = 0;
  for (let y = 0; y <= horizon; y++) {
    if (y > 0) {
      balance = Math.round(balance * (1 + expectedReturnRate)) + annualContributionCents;
      totalContrib += annualContributionCents;
    }
    points.push({
      year: y,
      age: currentAge + y,
      balanceCents: balance,
      contributionsToDateCents: totalContrib,
      growthToDateCents: balance - currentSavedCents - totalContrib,
    });
  }
  return points;
}

/**
 * Inflation-adjusted purchasing power of $X today, in N years.
 *  PP = todayCents / (1 + inflation)^n
 */
export function purchasingPower(todayCents: number, inflationRate: number, years: number): number {
  return Math.round(todayCents / Math.pow(1 + inflationRate, years));
}

/**
 * Giving board projection — daily intention scaling up monthly by growth rate.
 */
export function givingProjection(args: {
  monthlyStartCents: number;
  monthlyGrowthRate: number;
  months: number;
}): number[] {
  const { monthlyStartCents, monthlyGrowthRate, months } = args;
  const series: number[] = [];
  let amt = monthlyStartCents;
  for (let m = 0; m < months; m++) {
    series.push(Math.round(amt));
    amt *= 1 + monthlyGrowthRate;
  }
  return series;
}

/**
 * Debt payoff projection — snowball (smallest balance first) or avalanche (highest APR first).
 */
export interface DebtItem {
  label: string;
  balance_cents: number;
  min_payment_cents: number;
  apr: number;
}

export interface DebtPayoffPoint {
  month: number;
  totalRemainingCents: number;
  totalPaidCents: number;
}

export function projectDebtPayoff(args: {
  debts: DebtItem[];
  monthlyExtraCents: number;
  strategy: "snowball" | "avalanche";
}): { months: DebtPayoffPoint[]; totalInterestPaidCents: number; payoffMonth: number } {
  const { debts, monthlyExtraCents, strategy } = args;
  const items = debts.map((d) => ({ ...d }));
  const months: DebtPayoffPoint[] = [];
  let totalInterest = 0;
  let totalPaid = 0;
  let m = 0;
  const maxMonths = 600; // hard stop at 50yr

  while (items.some((d) => d.balance_cents > 0) && m < maxMonths) {
    m++;
    let extra = monthlyExtraCents;
    // Accrue interest monthly
    items.forEach((d) => {
      if (d.balance_cents > 0) {
        const interest = Math.round((d.balance_cents * d.apr) / 12);
        d.balance_cents += interest;
        totalInterest += interest;
      }
    });
    // Pay minimums
    items.forEach((d) => {
      if (d.balance_cents > 0) {
        const pay = Math.min(d.balance_cents, d.min_payment_cents);
        d.balance_cents -= pay;
        totalPaid += pay;
      }
    });
    // Apply extra to target
    const sorted = items
      .filter((d) => d.balance_cents > 0)
      .sort((a, b) =>
        strategy === "snowball" ? a.balance_cents - b.balance_cents : b.apr - a.apr,
      );
    const target = sorted[0];
    if (target && extra > 0) {
      const pay = Math.min(target.balance_cents, extra);
      target.balance_cents -= pay;
      totalPaid += pay;
      extra -= pay;
    }
    const remaining = items.reduce((s, d) => s + d.balance_cents, 0);
    months.push({ month: m, totalRemainingCents: remaining, totalPaidCents: totalPaid });
  }

  return { months, totalInterestPaidCents: totalInterest, payoffMonth: m };
}
