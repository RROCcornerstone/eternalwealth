"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { ModuleInteractiveProps } from "./module-renderer";
import { dollarsToCents, formatCurrency } from "@/lib/utils";

export function TithesModule({ data, onChange }: ModuleInteractiveProps) {
  const monthlyIncomeCents = (data.monthly_income_cents as number) ?? null;
  const titheCents = (data.monthly_tithe_cents as number) ?? null;
  const destination = (data.giving_destination as string) ?? "";

  const [incomeText, setIncomeText] = useState(() =>
    monthlyIncomeCents != null ? (monthlyIncomeCents / 100).toLocaleString("en-US") : "",
  );
  const [titheText, setTitheText] = useState(() =>
    titheCents != null ? (titheCents / 100).toLocaleString("en-US") : "",
  );

  function updateIncome(text: string) {
    setIncomeText(text);
    const cents = dollarsToCents(text);
    const computed = Math.round(cents * 0.10);
    setTitheText((computed / 100).toLocaleString("en-US"));
    onChange({ ...data, monthly_income_cents: cents, monthly_tithe_cents: computed });
  }

  function updateTithe(text: string) {
    setTitheText(text);
    onChange({ ...data, monthly_tithe_cents: dollarsToCents(text) });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          The tithe is the firstfruits. Ten percent off the top of all income, set apart before any
          dollar goes to bills, food, rent, or savings. Not 9.5%. Not "what's left." First.
        </p>
        <p>
          This is the cornerstone of the household&rsquo;s money. Everything else in this framework
          is measured from it.
        </p>
        <p>
          The destination is your local church or the spiritual house where you are fed. Where God
          sends the firstfruits is between you and Him — but it is not optional.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="income">Average monthly income (after tax)</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">$</span>
              <Input
                id="income"
                inputMode="decimal"
                value={incomeText}
                onChange={(e) => updateIncome(e.target.value)}
                placeholder="6,000"
              />
            </div>
            {monthlyIncomeCents != null && (
              <p className="text-xs text-muted-foreground tabular">
                {formatCurrency(monthlyIncomeCents)} / month
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tithe">Monthly tithe (10% default, editable)</Label>
            <div className="flex items-center gap-2">
              <span className="text-accent font-medium">$</span>
              <Input
                id="tithe"
                inputMode="decimal"
                value={titheText}
                onChange={(e) => updateTithe(e.target.value)}
                placeholder="600"
                className="border-accent"
              />
            </div>
            {titheCents != null && monthlyIncomeCents && monthlyIncomeCents > 0 && (
              <p className="text-xs text-muted-foreground tabular">
                {((titheCents / monthlyIncomeCents) * 100).toFixed(1)}% of income
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dest">Where will it go?</Label>
          <p className="text-xs text-muted-foreground">
            Your local church, ministry, or spiritual house. One destination is enough to start.
          </p>
          <Input
            id="dest"
            value={destination}
            onChange={(e) => onChange({ ...data, giving_destination: e.target.value })}
            placeholder="e.g., Christ Fellowship — Tampa"
          />
        </div>
      </div>
    </div>
  );
}
