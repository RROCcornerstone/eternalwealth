"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { Slider } from "@/components/ui/slider";

const MIN = 20_000;
const MAX = 200_000;
const STEP = 5_000;
const DEFAULT = 40_000;

const FMT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function Screen28({ userId, brand, initialData }: RenderContext) {
  const saved =
    typeof initialData?.gift_per_grandchild_today === "number"
      ? (initialData.gift_per_grandchild_today as number)
      : DEFAULT;
  const [value, setValue] = useState<number>(saved);

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["2.8"]!}
      userId={userId}
      brand={brand}
      initialData={{ gift_per_grandchild_today: saved, ...initialData }}
    >
      {({ setField }) => (
        <div className="space-y-10">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            Act II · Gift Per Grandchild
          </p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            How much do you want to give each grandchild, each year, for 30
            years?
          </h1>
          <p className="text-lg text-muted-foreground">
            Two generations forward. Proverbs 13:22 — a good man leaves an
            inheritance to his children&apos;s children.
          </p>

          <div className="space-y-6">
            <div className="text-center">
              <p className="font-display text-5xl sm:text-6xl tabular-nums text-foreground">
                {FMT.format(value)}
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-muted-foreground mt-2">
                per year × 30 years per grandchild
              </p>
            </div>
            <Slider
              value={[value]}
              onValueChange={(values) => {
                const v = values[0];
                if (v == null) return;
                setValue(v);
                setField("gift_per_grandchild_today", v);
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
