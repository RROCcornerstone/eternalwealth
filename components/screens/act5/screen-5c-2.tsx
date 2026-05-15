"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import { Card } from "@/components/ui/card";
import type { RenderContext } from "@/components/screens/registry";

export function Screen5C2({ userId, brand, initialData }: RenderContext) {
  return (
    <ScreenShell
      screen={SCREENS_BY_ID["5C.2"]}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Continue"
    >
      {() => (
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            🐂 Cattle Path
          </p>

          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            There are only two ways out of Cattle.
          </h1>

          <div className="space-y-4 text-lg text-foreground">
            <p>
              <strong className="font-semibold">Option 1:</strong> Get a{" "}
              <strong className="font-semibold">better job.</strong>
            </p>
            <p>
              <strong className="font-semibold">Option 2:</strong> Get a{" "}
              <strong className="font-semibold">second job.</strong>
            </p>
            <p>Preferably, get a better job.</p>
            <p>
              This isn&apos;t fancy. It&apos;s simple.{" "}
              <strong className="font-semibold">More income is the lever.</strong> You can&apos;t
              budget your way to Silver — you have to earn your way there.
            </p>
          </div>

          <Card className="px-6">
            <p className="italic text-foreground">
              &ldquo;You don&apos;t escape Cattle by spending less. You escape it by earning
              more.&rdquo;
            </p>
          </Card>
        </div>
      )}
    </ScreenShell>
  );
}
