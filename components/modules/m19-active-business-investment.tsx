"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { ModuleInteractiveProps } from "./module-renderer";
import { dollarsToCents, formatCurrency } from "@/lib/utils";

const MOMENTUM = [
  "I have a customer or audience already paying me, even if small",
  "I have a clear path to monthly revenue covering my 6-month minimum",
  "I have a partner / advisor who has done what I'm doing",
  "I am ready to commit 12 months minimum, full focus",
];

export function ActiveBusinessInvestmentModule({ data, onChange }: ModuleInteractiveProps) {
  const sixMonth = (data.six_month_living_costs_cents as number) ?? null;
  const surplus = (data.surplus_cents as number) ?? null;
  const checks = (data.momentum_checks as string[]) ?? [];
  const ready = sixMonth != null && surplus != null && surplus >= sixMonth && checks.length === MOMENTUM.length;

  function toggle(s: string) {
    const next = checks.includes(s) ? checks.filter((c) => c !== s) : [...checks, s];
    onChange({ ...data, momentum_checks: next });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          Active business investment is the highest-stakes Gold move. You&rsquo;re committing real
          capital and real time to building something that pays you. The math gate is simple: at
          minimum, you need six months of bare-minimum living costs in surplus, untouchable, before
          the day you go full-time.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="six">6-month bare-minimum living costs</Label>
            <p className="text-xs text-muted-foreground">Rent + utilities + food + minimums × 6.</p>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">$</span>
              <Input
                id="six"
                inputMode="decimal"
                value={sixMonth ? (sixMonth / 100).toLocaleString("en-US") : ""}
                onChange={(e) =>
                  onChange({ ...data, six_month_living_costs_cents: dollarsToCents(e.target.value) })
                }
                placeholder="30,000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="surplus">Current surplus available to deploy</Label>
            <p className="text-xs text-muted-foreground">Not in retirement; truly liquid.</p>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">$</span>
              <Input
                id="surplus"
                inputMode="decimal"
                value={surplus ? (surplus / 100).toLocaleString("en-US") : ""}
                onChange={(e) =>
                  onChange({ ...data, surplus_cents: dollarsToCents(e.target.value) })
                }
                placeholder="60,000"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="font-display text-base font-medium">Momentum checks</Label>
          <ul className="mt-3 space-y-2">
            {MOMENTUM.map((m) => (
              <li key={m}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={checks.includes(m)}
                    onCheckedChange={() => toggle(m)}
                    className="mt-0.5"
                  />
                  <span className="text-sm">{m}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            ready
              ? "border-success/40 bg-success/5"
              : "border-warning/40 bg-warning/5"
          }`}
        >
          {ready ? (
            <p className="text-sm">
              <strong className="text-success">Ready.</strong> Six months covered, momentum is in
              place, you have a path. Deploy with discipline.
            </p>
          ) : (
            <p className="text-sm">
              <strong className="text-warning">Build this first.</strong> Either the math gate
              isn&rsquo;t met or momentum isn&rsquo;t in place. Don&rsquo;t deploy yet.
            </p>
          )}
          {sixMonth != null && surplus != null && (
            <p className="text-xs text-muted-foreground mt-2 tabular">
              Surplus: {formatCurrency(surplus)} · Need: {formatCurrency(sixMonth)} · Gap: {formatCurrency(surplus - sixMonth)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
