"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";

export function Screen5G1({ userId, brand, initialData, profile }: RenderContext) {
  const firstName: string =
    profile?.first_name ?? (profile?.full_name ? String(profile.full_name).split(" ")[0] : "friend");

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["5G.1"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Continue"
    >
      {() => (
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            🏆 Gold Path
          </p>

          <h1 className="font-display text-4xl sm:text-5xl leading-tight text-foreground">
            Welcome to Gold, {firstName}.
          </h1>

          <div className="space-y-4 text-lg text-foreground">
            <p>
              You&apos;re in multiplication territory. Your foundation is rock solid. Your margin is
              significant. Now you scale.
            </p>
            <p>This phase is different from the others. It&apos;s not a step-by-step program.</p>
            <p>It&apos;s a direct relationship.</p>
            <p>You&apos;re ready to work with me 1-on-1.</p>
          </div>

          <div className="border-l-2 border-accent p-4 font-serif italic text-lg text-foreground space-y-2">
            <p>&ldquo;&hellip;and in gold.&rdquo; — Genesis 13:2</p>
            <p className="text-muted-foreground">
              Gold was the currency of kings. This is where wealth becomes legacy.
            </p>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
