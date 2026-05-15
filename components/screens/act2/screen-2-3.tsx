"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { Button } from "@/components/ui/button";

export function Screen23({ userId, brand, initialData }: RenderContext) {
  const initialChildren =
    typeof initialData?.num_children === "number"
      ? (initialData.num_children as number)
      : 0;
  const [num, setNum] = useState<number>(initialChildren);

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["2.3"]!}
      userId={userId}
      brand={brand}
      initialData={{ num_children: initialChildren, ...initialData }}
    >
      {({ setField }) => {
        function update(next: number) {
          const clamped = Math.max(0, Math.min(10, next));
          setNum(clamped);
          setField("num_children", clamped);
        }
        return (
          <div className="space-y-8">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
              Act II · Children
            </p>
            <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
              How many children do you have (or expect to have)?
            </h1>

            <div className="flex items-center gap-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => update(num - 1)}
                disabled={num <= 0}
                aria-label="Decrease"
                className="h-14 w-14 text-2xl"
              >
                −
              </Button>
              <div className="font-display text-6xl tabular-nums text-foreground w-24 text-center">
                {num}
              </div>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => update(num + 1)}
                disabled={num >= 10}
                aria-label="Increase"
                className="h-14 w-14 text-2xl"
              >
                +
              </Button>
            </div>
          </div>
        );
      }}
    </ScreenShell>
  );
}
