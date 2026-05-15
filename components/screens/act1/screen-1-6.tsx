"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";

export function Screen16({ userId, brand, initialData }: RenderContext) {
  return (
    <ScreenShell
      screen={SCREENS_BY_ID["1.6"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Keep going"
    >
      {() => (
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">Silver</p>

          <div className="flex items-start gap-4">
            <span className="text-6xl leading-none" aria-hidden="true">
              🪙
            </span>
            <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
              <span lang="he" dir="rtl" className="font-serif">
                בַּכֶּסֶף
              </span>{" "}
              (ba-kesef) — &ldquo;in silver&rdquo;
            </h1>
          </div>

          <div className="space-y-4 text-lg text-foreground">
            <p>
              In Hebrew, the same word <em>kesef</em> means both &ldquo;silver&rdquo; and
              &ldquo;money.&rdquo;
            </p>
            <p>
              Silver was the currency of daily trade — divisible, spendable, in motion.
            </p>
            <p>
              It represents <strong className="font-medium">strategic growth</strong>. Margin.
              Movement. The layer where you start paying down debt, investing, and building.
            </p>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
