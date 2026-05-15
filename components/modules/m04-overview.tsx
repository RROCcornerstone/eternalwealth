"use client";

import type { ModuleInteractiveProps } from "./module-renderer";

const CHECKING = [
  ["Receiving", "All income lands here. No bills draw from it."],
  ["Core Bills & Housing", "Rent/mortgage, utilities, transport, insurance."],
  ["Food", "Groceries, restaurants, coffee."],
  ["Health & Wellness", "Gym, supplements, therapy, recovery."],
  ["Skill & Business Prep", "Courses, books, conferences, side-project software."],
  ["Leisure & Lifestyle", "Travel, hobbies, gifts, social."],
];

const SAVINGS = [
  ["Tithes", "10% minimum. Set apart first, always."],
  ["General Savings", "10–20% of income. The buffer."],
  ["Aggressive Debt / Investing", "Phase 2: debt payoff. Phase 3: investing."],
];

const CATEGORIES = [
  "Tithes & Offerings",
  "Core Bills",
  "Food",
  "Health & Wellness",
  "Savings",
  "Debt Repayment",
  "Retirement / Investment",
  "Leisure & Lifestyle",
  "Skill & Business Prep",
  "Active Business",
];

export function OverviewModule({ data: _data, onChange: _onChange }: ModuleInteractiveProps) {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <p>
          The framework has two structures. Memorize them. Everything else points back here.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-xl font-semibold">The 9 Accounts</h3>
        <p className="text-sm text-muted-foreground">
          Six checking accounts (each with its own debit card). Three savings accounts (no card —
          these are for holding, not for use).
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          {CHECKING.map(([name, sub]) => (
            <div key={name} className="rounded-lg border border-border/60 p-4 bg-card">
              <div className="font-display font-medium">{name}</div>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mt-3">
          {SAVINGS.map(([name, sub]) => (
            <div key={name} className="rounded-lg border border-dashed border-accent/60 p-4 bg-accent/5">
              <div className="font-display font-medium text-accent">{name}</div>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border/60">
        <h3 className="font-display text-xl font-semibold">The 10 Categories</h3>
        <p className="text-sm text-muted-foreground">
          Every dollar you spend belongs in one of ten buckets. We use these for budgeting and for
          categorizing your real bank transactions later.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
          {CATEGORIES.map((c, i) => (
            <div
              key={c}
              className="rounded-md border border-border/60 px-3 py-3 text-center text-sm"
            >
              <span className="font-mono text-[10px] text-muted-foreground block">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-xs leading-tight">{c}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground italic pt-4 border-t border-border/60">
        Mixed money will lie to you. Separated money cannot.
      </p>
    </div>
  );
}
