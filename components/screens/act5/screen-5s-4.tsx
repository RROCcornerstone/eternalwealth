"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import { Card } from "@/components/ui/card";
import type { RenderContext } from "@/components/screens/registry";

export function Screen5S4({ userId, brand, initialData }: RenderContext) {
  return (
    <ScreenShell
      screen={SCREENS_BY_ID["5S.4"]}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Continue"
    >
      {() => (
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            🪙 Silver Path
          </p>

          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            There are only two ways to invest. You need both.
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="px-6 space-y-3">
              <h2 className="font-display text-xl text-accent">Your Career</h2>
              <p className="text-foreground">
                Invest in skills, mentors, certifications, courses.
              </p>
              <p className="text-foreground">Your earning power compounds.</p>
            </Card>

            <Card className="px-6 space-y-3">
              <h2 className="font-display text-xl text-accent">Actual Investments</h2>
              <p className="text-foreground">Money in the market.</p>
              <p className="text-foreground">
                Real estate. Crypto. Things that multiply without your direct labor.
              </p>
            </Card>
          </div>

          <div className="space-y-3 text-lg text-foreground">
            <p>Don&apos;t pick one. Do both.</p>
            <p>Career investment grows your income (which grows the gap).</p>
            <p>Actual investment grows the gap into multiplication.</p>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
