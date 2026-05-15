"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ModuleInteractiveProps } from "./module-renderer";
import { dollarsToCents, formatCurrency } from "@/lib/utils";

export function SavingsModule({ data, onChange }: ModuleInteractiveProps) {
  const monthly = (data.monthly_amount_cents as number) ?? null;
  const monthlyIncome = (data._monthly_income_cents as number) ?? null;
  const pct = monthly != null && monthlyIncome ? (monthly / monthlyIncome) * 100 : null;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          Savings during Livestock is the buffer. Not investment yet — that comes in Silver and Gold.
          Just a buffer. Three to six months of bare-minimum living costs sitting in an account that
          doesn&rsquo;t have a debit card.
        </p>
        <p>
          The target is 10–20% of gross income, every month, automatic. Below 10%, you&rsquo;re not
          really saving. Above 20%, you&rsquo;re probably under-spending on building yourself.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="m">Monthly savings amount</Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">$</span>
            <Input
              id="m"
              inputMode="decimal"
              value={monthly ? (monthly / 100).toLocaleString("en-US") : ""}
              onChange={(e) =>
                onChange({ ...data, monthly_amount_cents: dollarsToCents(e.target.value) })
              }
              placeholder="800"
            />
          </div>
        </div>

        {pct != null && (
          <div className="rounded-lg border border-border/60 p-4 bg-card">
            <p className="text-sm text-muted-foreground">
              That&rsquo;s <span className="font-medium text-foreground tabular">{pct.toFixed(1)}%</span> of your income.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {pct < 10 && "Below target. Aim for at least 10%."}
              {pct >= 10 && pct <= 20 && "On target — that's the Livestock zone."}
              {pct > 20 && "Above target. Are you underinvesting in skill or business prep?"}
            </p>
          </div>
        )}

        {!monthlyIncome && (
          <p className="text-xs text-muted-foreground">
            Tip: percentage shows up once you set your income on the Tithes module.
          </p>
        )}
      </div>
    </div>
  );
}
