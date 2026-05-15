"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";

export function Screen18({ userId, brand, initialData }: RenderContext) {
  return (
    <ScreenShell
      screen={SCREENS_BY_ID["1.8"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Keep going"
    >
      {() => (
        <div className="space-y-8">
          <h1 className="font-display text-4xl sm:text-5xl leading-tight text-foreground">
            God didn&apos;t list these randomly.
          </h1>

          <div className="space-y-4 text-lg text-foreground font-display">
            <p>
              The order is the blueprint:{" "}
              <strong className="font-medium">Cattle → Silver → Gold.</strong>
            </p>
            <p>
              Most people try to jump straight to gold. They want overflow without order.
              Multiplication without structure.
            </p>
            <p>That&apos;s why they burn out, blow up, or break down.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-4">
            <div className="rounded-full border border-border bg-background px-5 py-4 text-center">
              <div className="text-3xl" aria-hidden="true">
                🐂
              </div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] mt-2 text-foreground">
                Cattle
              </div>
            </div>
            <div
              className="text-accent text-2xl text-center hidden sm:block"
              aria-hidden="true"
            >
              →
            </div>
            <div className="rounded-full border border-border bg-background px-5 py-4 text-center">
              <div className="text-3xl" aria-hidden="true">
                🪙
              </div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] mt-2 text-foreground">
                Silver
              </div>
            </div>
            <div
              className="text-accent text-2xl text-center hidden sm:block"
              aria-hidden="true"
            >
              →
            </div>
            <div className="rounded-full border border-border bg-background px-5 py-4 text-center">
              <div className="text-3xl" aria-hidden="true">
                🏆
              </div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] mt-2 text-foreground">
                Gold
              </div>
            </div>
          </div>

          <p className="font-display italic text-accent text-xl border-l-2 border-accent p-4">
            Until you honor God&apos;s order, more money won&apos;t help you — it&apos;ll expose
            you.
          </p>
        </div>
      )}
    </ScreenShell>
  );
}
