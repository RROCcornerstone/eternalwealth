"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";

export function Screen5S1({ userId, brand, initialData, profile }: RenderContext) {
  const firstName: string =
    profile?.first_name ?? (profile?.full_name ? String(profile.full_name).split(" ")[0] : "friend");

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["5S.1"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Let's go"
    >
      {() => (
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            🪙 Silver Path
          </p>

          <h1 className="font-display text-4xl sm:text-5xl leading-tight text-foreground">
            Welcome to the Silver path, {firstName}.
          </h1>

          <div className="space-y-4 text-lg text-foreground">
            <p>Your foundation is set. Now we widen the gap.</p>
            <p>
              In Silver, the game is simple:{" "}
              <strong className="font-semibold">
                increase the distance between what you earn and what you spend.
              </strong>{" "}
              The bigger that gap, the faster you build wealth.
            </p>
          </div>

          <div className="border-l-2 border-accent p-4 font-serif italic text-lg text-foreground space-y-2">
            <p>&ldquo;&hellip;in silver&hellip;&rdquo; — Genesis 13:2</p>
            <p className="text-muted-foreground">
              Silver was the currency of motion. It&apos;s time to move.
            </p>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
