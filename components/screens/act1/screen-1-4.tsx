"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";

export function Screen14({ userId, brand, initialData }: RenderContext) {
  return (
    <ScreenShell
      screen={SCREENS_BY_ID["1.4"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Keep going"
    >
      {() => (
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            The word &ldquo;rich&rdquo; isn&apos;t what you think
          </p>

          <h1 className="font-display text-4xl sm:text-5xl leading-tight text-foreground">
            <span lang="he" dir="rtl" className="font-serif">
              כָּבֵד
            </span>{" "}
            <span className="italic">(kaved)</span> — heavy
          </h1>

          <div className="space-y-4 text-lg text-foreground">
            <p>
              The Hebrew word translated &ldquo;rich&rdquo; literally means{" "}
              <strong className="font-medium">heavy / weighty</strong>.
            </p>
            <p>
              It shares its root with{" "}
              <strong className="font-medium">
                <span lang="he" dir="rtl" className="font-serif">
                  כָּבוֹד
                </span>
              </strong>{" "}
              (kavod) — the word for <strong className="font-medium">glory</strong>.
            </p>
            <p>
              In Hebrew, to be rich is to be a person of weight. Of substance. Of glory.
            </p>
          </div>

          <div className="border-l-2 border-accent p-4">
            <p className="text-base text-foreground">
              God isn&apos;t describing Abram&apos;s bank account. He&apos;s describing the weight
              of who Abram became. Wealth in the Kingdom isn&apos;t what you have — it&apos;s what
              you carry.
            </p>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
