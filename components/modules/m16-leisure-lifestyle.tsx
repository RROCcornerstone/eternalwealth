"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ModuleInteractiveProps } from "./module-renderer";
import { dollarsToCents } from "@/lib/utils";

const SUB_CATEGORIES = [
  { key: "subscriptions", label: "Subscriptions (Netflix, Spotify, etc.)" },
  { key: "travel", label: "Travel" },
  { key: "hobbies", label: "Hobbies" },
  { key: "social_dining", label: "Social dining / entertainment" },
  { key: "clothing", label: "Clothing (non-work)" },
  { key: "gifts", label: "Gifts" },
];

export function LeisureLifestyleModule({ data, onChange }: ModuleInteractiveProps) {
  const monthly = (data.monthly_cents as number) ?? null;
  const breakdown = (data.breakdown as Record<string, number>) ?? {};

  function setSub(k: string, text: string) {
    const next = { ...breakdown, [k]: dollarsToCents(text) };
    const subtotal = Object.values(next).reduce((s, n) => s + (n || 0), 0);
    onChange({ ...data, breakdown: next, monthly_cents: subtotal });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          Leisure & lifestyle is the line you draw on yourself. Money that goes here is money you
          chose to spend on enjoyment rather than build. That&rsquo;s not wrong &mdash; rest and joy
          are commanded too &mdash; but it has to be decided, not drift.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="m">Monthly leisure / lifestyle budget (auto-summed)</Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">$</span>
            <Input
              id="m"
              inputMode="decimal"
              value={monthly ? (monthly / 100).toLocaleString("en-US") : ""}
              onChange={(e) => onChange({ ...data, monthly_cents: dollarsToCents(e.target.value) })}
              placeholder="400"
              className="text-right tabular"
            />
          </div>
        </div>

        <div>
          <Label className="font-display text-base font-medium">Optional breakdown</Label>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            {SUB_CATEGORIES.map((s) => (
              <div key={s.key} className="space-y-1">
                <Label htmlFor={s.key} className="text-xs text-muted-foreground">{s.label}</Label>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground text-sm">$</span>
                  <Input
                    id={s.key}
                    inputMode="decimal"
                    value={breakdown[s.key] ? (breakdown[s.key]! / 100).toLocaleString("en-US") : ""}
                    onChange={(e) => setSub(s.key, e.target.value)}
                    placeholder="0"
                    className="text-right tabular"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
