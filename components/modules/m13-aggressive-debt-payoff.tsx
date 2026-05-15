"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ModuleInteractiveProps } from "./module-renderer";
import { dollarsToCents, formatCurrency } from "@/lib/utils";

export function AggressiveDebtPayoffModule({ data, onChange }: ModuleInteractiveProps) {
  const extra = (data.extra_payment_cents as number) ?? null;
  const strategy = (data.strategy as string) ?? "";

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          Silver opens with the same line every time: <em>pay it off aggressively.</em> Not at
          minimums. Not in some far-off plan. Now, methodically, with a strategy.
        </p>
        <p>
          Two strategies work. Pick one. The wrong one is no strategy.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            <strong>Snowball:</strong> smallest balance first. You feel wins quickly. Builds momentum.
          </li>
          <li>
            <strong>Avalanche:</strong> highest APR first. You save the most interest. Builds wealth.
          </li>
        </ul>
      </div>

      <div className="pt-6 border-t border-border/60 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="extra">Extra payment per month, on top of minimums</Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">$</span>
            <Input
              id="extra"
              inputMode="decimal"
              value={extra ? (extra / 100).toLocaleString("en-US") : ""}
              onChange={(e) => onChange({ ...data, extra_payment_cents: dollarsToCents(e.target.value) })}
              placeholder="500"
            />
          </div>
          {extra != null && extra > 0 && (
            <p className="text-xs text-muted-foreground">{formatCurrency(extra)} extra / month above minimums.</p>
          )}
        </div>

        <div>
          <Label>Strategy</Label>
          <RadioGroup
            value={strategy}
            onValueChange={(v) => onChange({ ...data, strategy: v })}
            className="mt-3 space-y-2"
          >
            <label className="flex items-start gap-3 p-3 rounded-lg border border-border/60 cursor-pointer hover:border-accent/60 transition-colors">
              <RadioGroupItem value="snowball" className="mt-1" />
              <div>
                <div className="font-medium">Snowball</div>
                <p className="text-xs text-muted-foreground">Smallest balance first. Momentum-driven.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 rounded-lg border border-border/60 cursor-pointer hover:border-accent/60 transition-colors">
              <RadioGroupItem value="avalanche" className="mt-1" />
              <div>
                <div className="font-medium">Avalanche</div>
                <p className="text-xs text-muted-foreground">Highest APR first. Interest-optimal.</p>
              </div>
            </label>
          </RadioGroup>
        </div>

        <p className="text-xs text-muted-foreground italic">
          A live payoff projection chart will appear here once we wire it to your debt list from Module 11.
          {/* DRAFT: Alex to review — projection chart pending Phase 5 polish */}
        </p>
      </div>
    </div>
  );
}
