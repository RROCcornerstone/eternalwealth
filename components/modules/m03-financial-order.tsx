"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { ModuleInteractiveProps } from "./module-renderer";
import { cn } from "@/lib/utils";

const STAGES = [
  {
    key: "pre_livestock",
    label: "Before Livestock",
    body: "You don't yet have stable income covering rent, groceries, utilities. Tithes aren't set apart. Maybe payday-to-payday.",
    color: "border-destructive/40 bg-destructive/5",
  },
  {
    key: "livestock",
    label: "Livestock",
    body: "Foundation laid. Tithes go first. Bills are paid on time. There's a savings buffer building. Minimums on debt are covered.",
    color: "border-livestock/40 bg-livestock/5",
  },
  {
    key: "silver",
    label: "Silver",
    body: "Foundation steady. Now moving: aggressive debt payoff, retirement contributions, skill-building, deliberate lifestyle line.",
    color: "border-silver/40 bg-silver/5",
  },
  {
    key: "gold",
    label: "Gold",
    body: "Movement steady. Now multiplying: active trading where you have proof, business investment where you have momentum.",
    color: "border-gold/40 bg-gold/5",
  },
] as const;

export function FinancialOrderModule({ data, onChange }: ModuleInteractiveProps) {
  const current = (data.current_stage as string) ?? "";
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          <em>And Abram was very rich in livestock, in silver, and in gold.</em>
        </p>
        <p>
          Three metals. Three stages. In that order. The first time the word <em>rich</em> appears
          in Scripture, the order is named.
        </p>
        <p>
          <strong>Livestock</strong> is the layer of survival. Rent, groceries, electricity, the
          minimum on the card. The layer that keeps the household alive.
        </p>
        <p>
          <strong>Silver</strong> is the working currency. Spendable. Movable. Silver is what you
          use after livestock is fed. Aggressive debt payoff. Retirement. Skill. The layer of motion.
        </p>
        <p>
          <strong>Gold</strong> is what kings stored. Gold is the layer of overflow. Starting the
          business, buying the property, multiplying what you have already built.
        </p>
        <p className="text-muted-foreground italic">The order is divine. It cannot be skipped.</p>
      </div>

      <div className="pt-6 border-t border-border/60">
        <Label className="font-display text-lg font-medium">
          Which stage are you in right now?
        </Label>
        <p className="text-xs text-muted-foreground mt-1">
          Honest answer. The framework only works if you start where you actually are.
        </p>
        <RadioGroup
          value={current}
          onValueChange={(v) => onChange({ ...data, current_stage: v })}
          className="mt-4 space-y-3"
        >
          {STAGES.map((s) => (
            <label
              key={s.key}
              className={cn(
                "flex items-start gap-3 cursor-pointer p-4 rounded-lg border transition-colors",
                current === s.key ? s.color : "border-border/60 hover:border-border",
              )}
            >
              <RadioGroupItem value={s.key} className="mt-1" />
              <div className="space-y-1">
                <div className="font-display font-semibold">{s.label}</div>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
