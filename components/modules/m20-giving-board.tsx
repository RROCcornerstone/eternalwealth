"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ModuleInteractiveProps } from "./module-renderer";
import { dollarsToCents, formatCurrency } from "@/lib/utils";
import { givingProjection } from "@/lib/math/legacy";

const HORIZONS = [
  { key: "monthly_cents", label: "Monthly tithe", hint: "Set apart first." },
  { key: "yearly_cents", label: "Yearly target", hint: "Stretch goal beyond tithe." },
  { key: "three_year_cents", label: "Three-year target", hint: "Annual giving you're growing toward." },
  { key: "ten_year_cents", label: "Ten-year target", hint: "The giver you're willing to become." },
] as const;

export function GivingBoardModule({ data, onChange }: ModuleInteractiveProps) {
  const intention = (data.daily_intention as string) ?? "";
  const dailyCents = (data.daily_cents as number) ?? 0;
  const series = givingProjection({
    monthlyStartCents: (data.monthly_cents as number) ?? 0,
    monthlyGrowthRate: 0.05,
    months: 120,
  });

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          Before you decide what to receive, decide what to give. Not what you can afford — what you
          will give. The Father gave first. He gave a Son. The shape of a son is the shape of a giver.
        </p>
        <p>
          Five horizons. Today. This month. This year. Three years. Ten years. Write what you will
          give at each.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="intention">Daily giving intention</Label>
          <p className="text-xs text-muted-foreground">
            Time, talent, or treasure — something every day.
          </p>
          <Textarea
            id="intention"
            value={intention}
            onChange={(e) => onChange({ ...data, daily_intention: e.target.value })}
            rows={2}
            placeholder="Today I will…"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {HORIZONS.map((h) => {
            const v = data[h.key] as number | undefined;
            return (
              <div key={h.key} className="space-y-2">
                <Label htmlFor={h.key}>{h.label}</Label>
                <p className="text-xs text-muted-foreground">{h.hint}</p>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">$</span>
                  <Input
                    id={h.key}
                    inputMode="decimal"
                    value={v ? (v / 100).toLocaleString("en-US") : ""}
                    onChange={(e) =>
                      onChange({ ...data, [h.key]: dollarsToCents(e.target.value) })
                    }
                    placeholder="0"
                    className="text-right tabular"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {series[0] && series[0] > 0 && (
          <div className="pt-4 border-t border-border/60 space-y-2">
            <Label className="font-display text-base">10-year stretch projection</Label>
            <p className="text-xs text-muted-foreground">
              At 5% monthly compounding growth in giving capacity.
            </p>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[12, 36, 60, 120].map((m) => (
                <div key={m} className="text-center p-3 rounded-md border border-border/60">
                  <p className="font-mono text-[10px] uppercase text-muted-foreground">{m / 12}yr</p>
                  <p className="font-display text-sm font-semibold tabular mt-1">
                    {series[m - 1] != null ? formatCurrency(series[m - 1]!) : "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
