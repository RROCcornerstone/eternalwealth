"use client";

import { useState, type ReactNode } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  emoji: string;
  label: ReactNode;
}

const OPTIONS: Option[] = [
  {
    value: "cattle",
    emoji: "🐂",
    label: (
      <>
        <strong className="font-medium">Cattle (Mikneh)</strong> — I&apos;m still building my
        foundation
      </>
    ),
  },
  {
    value: "silver",
    emoji: "🪙",
    label: (
      <>
        <strong className="font-medium">Silver (Kesef)</strong> — My foundation is set,
        I&apos;m ready to grow
      </>
    ),
  },
  {
    value: "gold",
    emoji: "🏆",
    label: (
      <>
        <strong className="font-medium">Gold (Zahav)</strong> — I&apos;m in multiplication mode
      </>
    ),
  },
];

export function Screen111({ userId, brand, initialData }: RenderContext) {
  const [current, setCurrent] = useState<string>(
    (initialData?.self_id as string) ?? "",
  );

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["1.11"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Continue"
      canContinue={Boolean(current)}
    >
      {({ setField }) => (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
              Last question
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-foreground leading-tight">
              Looking at God&apos;s framework — where do you think He has you right now?
            </h2>
          </div>

          <RadioGroup
            value={current}
            onValueChange={(v) => {
              setCurrent(v);
              setField("self_id", v);
            }}
            className="gap-3"
          >
            {OPTIONS.map((opt) => {
              const selected = current === opt.value;
              return (
                <Label
                  key={opt.value}
                  htmlFor={`self-id-${opt.value}`}
                  className={cn(
                    "flex items-start gap-4 cursor-pointer rounded-lg border p-4 transition-colors",
                    selected
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-foreground/30",
                  )}
                >
                  <RadioGroupItem
                    id={`self-id-${opt.value}`}
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
