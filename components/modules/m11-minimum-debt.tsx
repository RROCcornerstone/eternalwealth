"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ModuleInteractiveProps } from "./module-renderer";
import { dollarsToCents, formatCurrency } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

interface DebtItem {
  label: string;
  balance_cents: number;
  min_payment_cents: number;
  apr?: number;
}

export function MinimumDebtModule({ data, onChange }: ModuleInteractiveProps) {
  const items: DebtItem[] = (data.items as DebtItem[]) ?? [];
  const monthlyTotal = items.reduce((s, i) => s + (i.min_payment_cents || 0), 0);
  const balanceTotal = items.reduce((s, i) => s + (i.balance_cents || 0), 0);

  function update(idx: number, partial: Partial<DebtItem>) {
    const next = items.map((it, i) => (i === idx ? { ...it, ...partial } : it));
    onChange({
      ...data,
      items: next,
      monthly_minimums_cents: next.reduce((s, i) => s + (i.min_payment_cents || 0), 0),
    });
  }

  function add() {
    const next = [...items, { label: "", balance_cents: 0, min_payment_cents: 0 }];
    onChange({ ...data, items: next, monthly_minimums_cents: monthlyTotal });
  }

  function remove(idx: number) {
    const next = items.filter((_, i) => i !== idx);
    onChange({
      ...data,
      items: next,
      monthly_minimums_cents: next.reduce((s, i) => s + (i.min_payment_cents || 0), 0),
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          In Livestock, debt has one job: stay current. Pay the minimums. Don&rsquo;t fall behind.
          Don&rsquo;t accumulate late fees. Don&rsquo;t hurt your credit. Just hold the line.
        </p>
        <p>
          Aggressive payoff is a <strong>Silver</strong> activity, not Livestock. We&rsquo;ll get
          there. For now, list every debt and the minimum monthly payment that keeps it in good
          standing.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60 space-y-4">
        <Label className="font-display text-lg font-medium">Your debts</Label>
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            No debts yet — click Add line to enter your first.
          </p>
        )}
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-[1fr_120px_120px_60px_40px] gap-2 items-center">
              <Input
                value={it.label}
                onChange={(e) => update(i, { label: e.target.value })}
                placeholder="e.g., Chase card"
              />
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground text-sm">$</span>
                <Input
                  inputMode="decimal"
                  value={it.balance_cents ? (it.balance_cents / 100).toLocaleString("en-US") : ""}
                  onChange={(e) => update(i, { balance_cents: dollarsToCents(e.target.value) })}
                  placeholder="Balance"
                  className="text-right tabular"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground text-sm">$</span>
                <Input
                  inputMode="decimal"
                  value={it.min_payment_cents ? (it.min_payment_cents / 100).toLocaleString("en-US") : ""}
                  onChange={(e) => update(i, { min_payment_cents: dollarsToCents(e.target.value) })}
                  placeholder="Min"
                  className="text-right tabular"
                />
              </div>
              <Input
                inputMode="decimal"
                value={it.apr ?? ""}
                onChange={(e) => update(i, { apr: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="APR%"
                className="text-right tabular"
              />
              <Button variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove" className="h-9 w-9">
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={add}>
          <Plus className="h-4 w-4 mr-1" /> Add debt
        </Button>

        {items.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border/60">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Total balance</p>
              <p className="font-display text-2xl font-semibold tabular">{formatCurrency(balanceTotal)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Monthly minimums</p>
              <p className="font-display text-2xl font-semibold tabular text-accent">
                {formatCurrency(monthlyTotal)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
