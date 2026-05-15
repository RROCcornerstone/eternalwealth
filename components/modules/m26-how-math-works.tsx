"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ModuleInteractiveProps } from "./module-renderer";
import { formatCurrency, dollarsToCents } from "@/lib/utils";
import { compoundFutureValue } from "@/lib/math/legacy";

export function HowMathWorksModule({ data: _d, onChange: _o }: ModuleInteractiveProps) {
  const [todayCents, setTodayCents] = useState(10000000); // $100,000
  const [years, setYears] = useState(30);
  const inflation = compoundFutureValue(todayCents, 0.03, years);
  const compoundReturn = compoundFutureValue(todayCents, 0.10, years);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          The math you need to understand is compounding. Specifically: the same percentage growth
          applied many times in a row produces results that look nothing like a single year.
        </p>
        <p>
          And the math that quietly eats wealth is inflation. The same dollar buys less each year.
          At 3% inflation, in 30 years, today&rsquo;s $100 buys what $41 buys today.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">Amount today</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">$</span>
              <Input
                inputMode="decimal"
                value={(todayCents / 100).toLocaleString("en-US")}
                onChange={(e) => setTodayCents(dollarsToCents(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Years</Label>
            <Input type="number" min={1} max={60} value={years} onChange={(e) => setYears(Number(e.target.value))} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 border border-warning/40 bg-warning/5 rounded-lg">
            <p className="font-mono text-[10px] uppercase tracking-wider text-warning">Inflation cost (3%)</p>
            <p className="font-display text-3xl font-semibold tabular mt-2">{formatCurrency(inflation)}</p>
            <p className="text-xs text-muted-foreground mt-2">
              That&rsquo;s what {formatCurrency(todayCents)} of stuff costs in {years} years.
            </p>
          </div>
          <div className="p-5 border border-success/40 bg-success/5 rounded-lg">
            <p className="font-mono text-[10px] uppercase tracking-wider text-success">Compound growth (10%)</p>
            <p className="font-display text-3xl font-semibold tabular mt-2">{formatCurrency(compoundReturn)}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Same {formatCurrency(todayCents)} invested at 10% for {years} years.
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground italic">
          The gap between the two is the wealth. Compound returns must outrun inflation, and the
          longer the horizon, the more dramatic the gap becomes.
        </p>
      </div>
    </div>
  );
}
