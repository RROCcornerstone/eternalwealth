"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ModuleInteractiveProps } from "./module-renderer";
import { dollarsToCents, formatCurrency } from "@/lib/utils";

export function FoodModule({ data, onChange }: ModuleInteractiveProps) {
  const total = (data.monthly_total_cents as number) ?? null;
  const groc = (data.groceries_cents as number) ?? null;
  const out = (data.eating_out_cents as number) ?? null;
  const split = groc != null && out != null ? groc + out : null;

  function set(k: string, text: string) {
    const cents = dollarsToCents(text);
    onChange({ ...data, [k]: cents });
    if (k === "groceries_cents" || k === "eating_out_cents") {
      const nextGroc = k === "groceries_cents" ? cents : (groc ?? 0);
      const nextOut = k === "eating_out_cents" ? cents : (out ?? 0);
      onChange({ ...data, [k]: cents, monthly_total_cents: nextGroc + nextOut });
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          Food is the second-largest variable cost for most households. It is also the easiest place
          to lie to yourself about a number. "We don&rsquo;t eat out that much" almost always means
          you eat out twice as much as you think.
        </p>
        <p>
          The goal here isn&rsquo;t to cut food. The goal is to know it.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="total">Monthly food total (all groceries + eating out)</Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">$</span>
            <Input
              id="total"
              inputMode="decimal"
              value={total ? (total / 100).toLocaleString("en-US") : ""}
              onChange={(e) => onChange({ ...data, monthly_total_cents: dollarsToCents(e.target.value) })}
              placeholder="800"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border/60">
          <Label className="font-display text-base font-medium">Optional split</Label>
          <p className="text-xs text-muted-foreground mt-1">
            If you want a finer breakdown, fill these. Otherwise leave them blank.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="groc">Groceries</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <Input
                  id="groc"
                  inputMode="decimal"
                  value={groc ? (groc / 100).toLocaleString("en-US") : ""}
                  onChange={(e) => set("groceries_cents", e.target.value)}
                  placeholder="500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="out">Eating out / coffee / delivery</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <Input
                  id="out"
                  inputMode="decimal"
                  value={out ? (out / 100).toLocaleString("en-US") : ""}
                  onChange={(e) => set("eating_out_cents", e.target.value)}
                  placeholder="300"
                />
              </div>
            </div>
          </div>
          {split != null && total != null && split !== total && (
            <p className="mt-3 text-xs text-warning">
              Split adds to {formatCurrency(split)} but total says {formatCurrency(total)}. Reconcile.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
