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
    label: "I'm still working on covering the basics each month",
  },
  {
    value: "silver",
    emoji: "🪙",
    label: "My foundation is steady — bills, food, savings, and giving are handled",
  },
  {
    value: "gold",
    emoji: "🏆",
    label: "My foundation is rock solid with significant margin to scale",
  },
];

export function Screen19({ userId, brand, initialData }: RenderContext) {
  const [current, setCurrent] = useState<string>(
    (initialData?.foundation_status as string) ?? "",
  );

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["1.9"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Continue"
      canContinue={Boolean(current)}
    >
      {({ setField }) => (
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
              Now you know the framework. Let&apos;s see where you think you&apos;re at.
            </h1>
            <h2 className="font-display text-2xl text-foreground">
              How would you describe your current financial foundation?
            </h2>
          </div>

          <RadioGroup
            value={current}
            onValueChange={(v) => {
              setCurrent(v);
              setField("foundation_status", v);
            }}
            className="gap-3"
          >
            {OPTIONS.map((opt) => {
              const selected = current === opt.value;
              return (
                <Label
                  key={opt.value}
                  htmlFor={`foundation-${opt.value}`}
                  className={cn(
                    "flex items-start gap-4 cursor-pointer rounded-lg border p-4 transition-colors",
                    selected
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-foreground/30",
                  )}
                >
                  <RadioGroupItem
                    id={`foundation-${opt.value}`}
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
