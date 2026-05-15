"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";

export function Screen17({ userId, brand, initialData }: RenderContext) {
  return (
    <ScreenShell
      screen={SCREENS_BY_ID["1.7"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Keep going"
    >
      {() => (
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">Gold</p>

          <div className="flex items-start gap-4">
            <span className="text-6xl leading-none" aria-hidden="true">
              🏆
            </span>
            <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
              <span lang="he" dir="rtl" className="font-serif">
                וּבַזָּהָב
              </span>{" "}
              (u-va-zahav) — &ldquo;and in gold&rdquo;
            </h1>
          </div>

          <div className="space-y-4 text-lg text-foreground">
            <p>
              Gold was the currency of kings, temples, and overflow. It wasn&apos;t traded daily —
              it was stored, honored, and multiplied.
            </p>
            <p>
              This is the layer of <strong className="font-medium">multiplication</strong>. Real
              estate, business, bold obedience, high-capital plays.
            </p>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
