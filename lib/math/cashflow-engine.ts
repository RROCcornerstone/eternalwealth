/**
 * Engine 2 — Cash Flow Math (Spec §MATH ENGINES → ENGINE 2)
 *
 * Triggered on Act 3 Screen 3.6. Computes monthly income, expenses, gap,
 * savings rate, and per-category averages from parsed transactions.
 */

export type CategoryId =
  | 1   // Tithes, Offerings, Firstfruits
  | 2   // Core Bills & Housing
  | 3   // Food
  | 4   // Health & Wellness
  | 5   // Savings
  | 6   // Debt Repayment
  | 7   // Retirement / Investments
  | 8   // Leisure & Lifestyle
  | 9   // Skill / Business Prep
  | 10; // Active Business Investment

export const CATEGORY_NAMES: Record<CategoryId, string> = {
  1: "Tithes, Offerings, Firstfruits",
  2: "Core Bills & Housing",
  3: "Food",
  4: "Health & Wellness",
  5: "Savings",
  6: "Debt Repayment",
  7: "Retirement / Investments",
  8: "Leisure & Lifestyle",
  9: "Skill / Business Prep",
  10: "Active Business Investment",
};

export type TransactionType = "income" | "expense" | "transfer";

export interface ParsedTransaction {
  id: string;
  date: string;       // ISO 8601
  description: string;
  amount: number;     // dollars (positive)
  category: CategoryId;
  type: TransactionType;
  confidence?: number;
  is_verified_income?: boolean;
}

export interface CashFlowOutputs {
  monthly_income: number;
  monthly_expenses: number;
  monthly_gap: number;
  savings_rate: number; // 0..1
  category_monthly_avg: Record<CategoryId, number>;
  category_percent: Record<CategoryId, number>;
}

export function computeCashFlow(
  transactions: ParsedTransaction[],
  months_of_data: number,
): CashFlowOutputs {
  const sumIncome = transactions
    .filter((t) => t.type === "income" && t.is_verified_income !== false)
    .reduce((s, t) => s + t.amount, 0);

  const sumExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const monthly_income = sumIncome / months_of_data;
  const monthly_expenses = sumExpenses / months_of_data;
  const monthly_gap = monthly_income - monthly_expenses;
  const savings_rate = monthly_income > 0 ? monthly_gap / monthly_income : 0;

  const cats: CategoryId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const category_monthly_avg: Record<CategoryId, number> = {} as any;
  const category_percent: Record<CategoryId, number> = {} as any;
  for (const c of cats) {
    const sum = transactions
      .filter((t) => t.type === "expense" && t.category === c)
      .reduce((s, t) => s + t.amount, 0);
    category_monthly_avg[c] = sum / months_of_data;
    category_percent[c] = monthly_expenses > 0 ? category_monthly_avg[c] / monthly_expenses : 0;
  }

  return {
    monthly_income,
    monthly_expenses,
    monthly_gap,
    savings_rate,
    category_monthly_avg,
    category_percent,
  };
}
