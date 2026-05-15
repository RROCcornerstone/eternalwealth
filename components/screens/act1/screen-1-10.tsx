"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const OPTIONS = [
  {
    value: "cattle",
    emoji: "🐂",
    label: "Honestly, not much — I'm tight or sometimes behind",
  },
  {
    value: "silver",
    emoji: "🪙",
    label: "Some margin, maybe 10–20% of my income",
  },
  {
    value: "gold",
    emoji: "🏆",
    label: "Significant margin, 30%+ that I can deploy strategically",
  },
];

export function Screen110({ userId, brand, initialData }: RenderContext) {
  const [current, setCurrent] = useState<string>(
    (initialData?.margin_status as string) ?? "",
  );

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["1.10"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Continue"
      canContinue={Boolean(current)}
    >
      {({ setField }) => (
        <div className="space-y-8">
          <h2 className="font-display text-2xl sm:text-3xl text-foreground leading-tight">
            After your basic needs are covered each month, what&apos;s left over?
          </h2>

          <RadioGroup
            value={current}
            onValueChange={(v) => {
              setCurrent(v);
              setField("margin_status", v);
            }}
            className="gap-3"
          >
            {OPTIONS.map((opt) => {
              const selected = current === opt.value;
              return (
                <Label
                  key={opt.value}
                  htmlFor={`margin-${opt.value}`}
                  className={cn(
                    "flex items-start gap-4 cursor-pointer rounded-lg border p-4 transition-colors",
                    selected
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-foreground/30",
                  )}
                >
                  <RadioGroupItem
                    id={`margin-${opt.value}`}
                    value={opt.value}
                    className="mt-1"
                  />
                  <span className="flex items-start gap-3 text-base text-foreground font-normal leading-relaxed">
                    <span className="text-2xl" aria-hidden="true">
                      {opt.emoji}
                    </span>
                    <span>{opt.label}</span>
                  </span>
                </Label>
              );
            })}
          </RadioGroup>
        </div>
      )}
    </ScreenShell>
  );
}
