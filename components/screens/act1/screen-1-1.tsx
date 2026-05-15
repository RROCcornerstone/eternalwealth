"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";

export function Screen11({ userId, brand, initialData }: RenderContext) {
  return (
    <ScreenShell
      screen={SCREENS_BY_ID["1.1"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Show me"
      hideBack
    >
      {() => (
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            Act I · Welcome
          </p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight text-foreground">
            Before you build wealth, you have to understand God&apos;s blueprint for it.
          </h1>
          <p className="text-lg text-muted-foreground">
            He gave it to us in the very first verse where the word &ldquo;rich&rdquo; appears in the Bible.
          </p>
        </div>
      )}
    </ScreenShell>
  );
}
