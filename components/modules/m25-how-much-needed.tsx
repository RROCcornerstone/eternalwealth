"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { ModuleInteractiveProps } from "./module-renderer";
import { dollarsToCents, formatCurrency } from "@/lib/utils";
import {
  nestEggRequired,
  monthlyContributionRequired,
  purchasingPower,
} from "@/lib/math/legacy";

export function HowMuchNeededModule({ data, onChange }: ModuleInteractiveProps) {
  const currentAge = (data.current_age as number) ?? 35;
  const retirementAge = (data.retirement_age as number) ?? 65;
  const annualNeed = (data.retirement_annual_need_cents as number) ?? 8000000;
  const numChildren = (data.num_children as number) ?? 0;
  const numGrandchildren = (data.num_grandchildren as number) ?? 0;
  const inheritancePerChild = (data.inheritance_per_child_cents as number) ?? 50000000;
  const inheritancePerGrandchild = (data.inheritance_per_grandchild_cents as number) ?? 20000000;
  const inflationRate = (data.inflation_rate as number) ?? 0.03;
  const expectedReturn = (data.expected_return_rate as number) ?? 0.1;

  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const yearsInRetirement = 25;
  const nestEgg = nestEggRequired({
    annualNeedTodayCents: annualNeed,
    yearsToRetirement,
    yearsInRetirement,
    inflationRate,
    withdrawalReturnRate: expectedReturn * 0.6,
  });
  const monthly = monthlyContributionRequired({
    targetCents: nestEgg,
    currentSavedCents: 0,
    yearsToRetirement,
    annualReturnRate: expectedReturn,
  });
  const futureNeed = purchasingPower(annualNeed, -inflationRate, yearsToRetirement);
  const inheritanceTotal =
    numChildren * inheritancePerChild + numGrandchildren * inheritancePerGrandchild;

  function setNum(k: string, v: number) {
    onChange({ ...data, [k]: v });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          This is the calculator. Names a number. Tells you what it takes monthly to get there.
          Edit any input. Everything updates live.
        </p>
        <p className="text-xs text-muted-foreground italic">
          Educational projection. Real returns will vary. Talk to a CFP before making large moves.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60 grid sm:grid-cols-2 gap-4">
        <NumberField label="Current age" value={currentAge} onChange={(v) => setNum("current_age", v)} />
        <NumberField label="Retirement age" value={retirementAge} onChange={(v) => setNum("retirement_age", v)} />
        <CurrencyField
          label="Desired annual retirement income (today's $)"
          cents={annualNeed}
          onChange={(c) => setNum("retirement_annual_need_cents", c)}
        />
        <NumberField
          label="Inflation rate (%)"
          value={inflationRate * 100}
          onChange={(v) => setNum("inflation_rate", v / 100)}
          step={0.1}
        />
        <NumberField
          label="Expected return (%)"
          value={expectedReturn * 100}
          onChange={(v) => setNum("expected_return_rate", v / 100)}
          step={0.5}
        />
        <NumberField label="Children" value={numChildren} onChange={(v) => setNum("num_children", v)} />
        <NumberField
          label="Grandchildren (anticipated)"
          value={numGrandchildren}
          onChange={(v) => setNum("num_grandchildren", v)}
        />
        <CurrencyField
          label="Inheritance per child (today's $)"
          cents={inheritancePerChild}
          onChange={(c) => setNum("inheritance_per_child_cents", c)}
        />
      </div>

      <div className="pt-6 border-t border-border/60">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">The number</p>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <Card className="border-accent/40 bg-accent/5">
            <CardContent className="pt-6">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Nest egg required
              </p>
              <p className="font-display text-3xl font-semibold tabular mt-2">
                {formatCurrency(nestEgg)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                At retirement age {retirementAge}.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="pt-6">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Monthly contribution
              </p>
              <p className="font-display text-3xl font-semibold tabular mt-2">
                {formatCurrency(monthly)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">For the next {yearsToRetirement} years.</p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="pt-6">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Inheritance (today's $)
              </p>
              <p className="font-display text-3xl font-semibold tabular mt-2">
                {formatCurrency(inheritanceTotal)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {numChildren} children · {numGrandchildren} grandchildren
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function CurrencyField({
  label,
  cents,
  onChange,
}: {
  label: string;
  cents: number;
  onChange: (c: number) => void;
}) {
  const [text, setText] = useState(() => (cents / 100).toLocaleString("en-US"));
  useEffect(() => {
    setText((cents / 100).toLocaleString("en-US"));
  }, [cents]);
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">$</span>
        <Input
          inputMode="decimal"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onChange(dollarsToCents(e.target.value));
          }}
        />
      </div>
    </div>
  );
}
