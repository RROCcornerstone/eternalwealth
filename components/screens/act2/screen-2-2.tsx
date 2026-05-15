"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Screen22({ userId, brand, initialData, profile }: RenderContext) {
  const firstName: string =
    (initialData?.first_name as string) ?? profile?.first_name ?? "friend";

  const initialAge =
    typeof initialData?.current_age === "number"
      ? (initialData.current_age as number)
      : null;
  const [age, setAge] = useState<number | null>(initialAge);

  const canContinue = age != null && age >= 18 && age <= 80;

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["2.2"]}
      userId={userId}
      brand={brand}
      initialData={initialData}
      canContinue={canContinue}
    >
      {({ setField }) => (
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            Act II · Current Age
          </p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            How old are you, {firstName}?
          </h1>
          <p className="text-lg text-muted-foreground">
            Every calculation downstream pivots on years to retirement.
          </p>
          <div className="space-y-2 max-w-xs">
            <Label
              htmlFor="current_age"
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
            >
              Your age
            </Label>
            <Input
              id="current_age"
              type="number"
              min={18}
              max={80}
              inputMode="numeric"
              value={age ?? ""}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  setAge(null);
                  setField("current_age", null);
                  return;
                }
                const parsed = parseInt(raw, 10);
                if (Number.isFinite(parsed)) {
                  setAge(parsed);
                  setField("current_age", parsed);
                }
              }}
              placeholder="35"
              autoFocus
              className="text-lg"
            />
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
