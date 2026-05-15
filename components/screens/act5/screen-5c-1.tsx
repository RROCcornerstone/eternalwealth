"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";

export function Screen5C1({ userId, brand, initialData, profile }: RenderContext) {
  const firstName: string =
    profile?.first_name ?? (profile?.full_name ? String(profile.full_name).split(" ")[0] : "friend");

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["5C.1"]}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Let's start"
    >
      {() => (
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            🐂 Cattle Path
          </p>

          <h1 className="font-display text-4xl sm:text-5xl leading-tight text-foreground">
            Welcome to the Cattle path, {firstName}.
          </h1>

          <div className="space-y-4 text-lg text-foreground">
            <p>
              You&apos;re at the foundation level. That&apos;s not failure — it&apos;s where God starts every legacy.
            </p>
            <p>
              Abraham. David. Job. Every single legacy in Scripture had a Cattle phase. The work
              here is humble, but it&apos;s holy. And if you stay faithful to this layer, the next
              ones come.
            </p>
          </div>

          <div className="border-l-2 border-accent p-4 font-serif italic text-lg text-foreground space-y-2">
            <p>&ldquo;And Abram was very rich in livestock&hellip;&rdquo; — Genesis 13:2</p>
            <p className="text-muted-foreground">Livestock came first. Always.</p>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
