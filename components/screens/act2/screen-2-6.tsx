"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { Slider } from "@/components/ui/slider";

const MIN = 40_000;
const MAX = 300_000;
const STEP = 5_000;
const DEFAULT = 80_000;

const FMT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function Screen26({ userId, brand, initialData }: RenderContext) {
  const saved =
    typeof initialData?.retirement_spending_today === "number"
      ? (initialData.retirement_spending_today as number)
      : DEFAULT;
  const [value, setValue] = useState<number>(saved);

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["2.6"]}
      userId={userId}
      brand={brand}
      initialData={{ retirement_spending_today: saved, ...initialData }}
    >
      {({ setField }) => (
        <div className="space-y-10">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            Act II · Retirement Lifestyle
          </p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            When you retire, what kind of life do you want to live?
          </h1>
          <p className="text-lg text-muted-foreground">
            We&apos;ll adjust for inflation later. Just tell us what your life
            would cost today.
          </p>

          <div className="space-y-6">
            <div className="text-center">
              <p className="font-display text-5xl sm:text-6xl tabular-nums text-foreground">
                {FMT.format(value)}
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-muted-foreground mt-2">
                per year in today&apos;s dollars
              </p>
            </div>
            <Slider
              value={[value]}
              onValueChange={([v]) => {
                setValue(v);
                setField("retirement_spending_today", v);
              }}
              min={MIN}
              max={MAX}
              step={STEP}
            />
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span>{FMT.format(MIN)}</span>
              <span>{FMT.format(MAX)}</span>
            </div>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
