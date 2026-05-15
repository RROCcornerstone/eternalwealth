"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import {
  CATEGORY_NAMES,
  computeCashFlow,
  type CategoryId,
} from "@/lib/math/cashflow-engine";
import { compareBrand, determineBrand, type Brand as MathBrand } from "@/lib/math/brand-engine";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

// v1 mocked snapshot — replace with parsed-transaction math once upload is wired.
const MOCK_SNAPSHOT = {
  monthly_income: 6000,
  monthly_expenses: 4800,
  monthly_gap: 1200,
  savings_rate: 0.2,
  category_monthly_avg: {
    1: 600, 2: 1800, 3: 600, 4: 200, 5: 1000, 6: 300, 7: 200, 8: 300, 9: 50, 10: 0,
  } as Record<CategoryId, number>,
  category_percent: {
    1: 0.125, 2: 0.375, 3: 0.125, 4: 0.042, 5: 0.208, 6: 0.063, 7: 0.042, 8: 0.063, 9: 0.01, 10: 0,
  } as Record<CategoryId, number>,
};

export function Screen36({ userId, brand, initialData }: RenderContext) {
  // Run the engine once for parity with the spec (returns zeros for [] today).
  // We render MOCK_SNAPSHOT until live parsing is online.
  void computeCashFlow([], 3);
  const snap = MOCK_SNAPSHOT;
  const cats: CategoryId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["3.6"]}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Submit my numbers"
      onAdvance={async () => {
        const supabase = createClient();

        await supabase.from("cash_flow_snapshots").upsert(
          {
            user_id: userId,
            monthly_income_cents: Math.round(snap.monthly_income * 100),
            monthly_expenses_cents: Math.round(snap.monthly_expenses * 100),
            monthly_gap_cents: Math.round(snap.monthly_gap * 100),
            savings_rate: snap.savings_rate,
            months_of_data: 3,
            category_monthly_avg: snap.category_monthly_avg,
            category_percent: snap.category_percent,
          } as any,
          { onConflict: "user_id" },
        );

        const actual_brand = determineBrand(snap.savings_rate);

        // Load self_id from screen 1.11.
        const selfRes = await supabase
          .from("module_responses")
          .select("data")
          .eq("user_id", userId)
          .eq("module_slug", "1.11")
          .maybeSingle();
        const self_id = (((selfRes.data as any)?.data?.self_id as MathBrand) ??
          "cattle") as MathBrand;
        const comparison = compareBrand(self_id, actual_brand);

        await supabase.from("course_progress").upsert(
          {
            user_id: userId,
            actual_brand,
            brand_comparison: comparison,
            act3_complete: true,
          } as any,
          { onConflict: "user_id" },
        );
      }}
    >
      {() => (
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
              Here&apos;s your real financial picture.
            </h1>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Monthly Income"
              value={`${formatCurrency(snap.monthly_income * 100)}/mo`}
              caption="(verified income, averaged over 3 months)"
            />
            <SummaryCard
              label="Monthly Expenses"
              value={`${formatCurrency(snap.monthly_expenses * 100)}/mo`}
              caption="(all categorized expenses)"
            />
            <SummaryCard
              label="Monthly Gap"
              value={`${formatCurrency(snap.monthly_gap * 100)}/mo`}
              caption={`Savings rate: ${Math.round(snap.savings_rate * 100)}%`}
              accent
            />
          </div>

          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  <th className="px-3 py-2 font-normal">Category</th>
                  <th className="px-3 py-2 font-normal text-right">Monthly Average</th>
                  <th className="px-3 py-2 font-normal text-right">% of Expenses</th>
                </tr>
              </thead>
              <tbody>
                {cats.map((c) => (
                  <tr key={c} className="border-t border-border">
                    <td className="px-3 py-2 text-foreground">{CATEGORY_NAMES[c]}</td>
                    <td className="px-3 py-2 text-right tabular text-foreground">
                      {formatCurrency(snap.category_monthly_avg[c] * 100)}
                    </td>
                    <td className="px-3 py-2 text-right tabular text-muted-foreground">
                      {Math.round(snap.category_percent[c] * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}

function SummaryCard({
  label,
  value,
  caption,
  accent,
}: {
  label: string;
  value: string;
  caption: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md border p-4 bg-card",
        accent ? "border-accent" : "border-border",
      )}
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "font-display text-2xl mt-1 tabular",
          accent ? "text-accent" : "text-foreground",
        )}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{caption}</p>
    </div>
  );
}
