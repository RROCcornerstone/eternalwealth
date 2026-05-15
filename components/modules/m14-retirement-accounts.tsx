"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { ModuleInteractiveProps } from "./module-renderer";
import { dollarsToCents } from "@/lib/utils";

const ACCOUNT_TYPES = [
  { key: "401k", label: "401(k) — employer-sponsored" },
  { key: "ira_traditional", label: "Traditional IRA" },
  { key: "ira_roth", label: "Roth IRA" },
  { key: "brokerage", label: "Brokerage / taxable" },
  { key: "hsa", label: "HSA — triple-tax-advantaged" },
  { key: "other", label: "Other" },
];

export function RetirementAccountsModule({ data, onChange }: ModuleInteractiveProps) {
  const monthly = (data.monthly_contribution_cents as number) ?? null;
  const types = (data.account_types as string[]) ?? [];

  function toggle(k: string) {
    const next = types.includes(k) ? types.filter((x) => x !== k) : [...types, k];
    onChange({ ...data, account_types: next });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          Retirement contributions are the long compound. They will not change your life this year.
          They will radically change your seventy-fifth year. The math works only because the time
          is long.
        </p>
        <p>
          If your employer offers a 401(k) match, contribute at least enough to capture it. That
          match is free money &mdash; everything above it is your strategic call.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="monthly">Monthly contribution total</Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">$</span>
            <Input
              id="monthly"
              inputMode="decimal"
              value={monthly ? (monthly / 100).toLocaleString("en-US") : ""}
              onChange={(e) =>
                onChange({ ...data, monthly_contribution_cents: dollarsToCents(e.target.value) })
              }
              placeholder="800"
            />
          </div>
        </div>

        <div>
          <Label className="font-display text-base font-medium">Which accounts do you contribute to?</Label>
          <ul className="mt-3 space-y-2">
            {ACCOUNT_TYPES.map((a) => (
              <li key={a.key}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={types.includes(a.key)}
                    onCheckedChange={() => toggle(a.key)}
                  />
                  <span className="text-sm">{a.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
