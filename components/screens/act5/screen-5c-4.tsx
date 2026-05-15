"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import { Card } from "@/components/ui/card";
import type { RenderContext } from "@/components/screens/registry";

export function Screen5C4({ userId, brand, initialData }: RenderContext) {
  return (
    <ScreenShell
      screen={SCREENS_BY_ID["5C.4"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Continue"
    >
      {() => (
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            🐂 Cattle Path
          </p>

          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            Now apply. A lot. And make every one count.
          </h1>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-accent">Volume</h2>
            <p className="text-lg text-foreground">
              Most people apply to 5 jobs and quit. That&apos;s why they stay in Cattle.
            </p>
            <p className="text-lg text-foreground">
              <strong className="font-semibold">The volume rule:</strong> Apply to{" "}
              <strong className="font-semibold">20+ jobs per week</strong> until you have an offer.
              Yes, that many.
            </p>
            <p className="text-lg text-foreground">
              Volume creates opportunities. Opportunities create options. Options create leverage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-accent">Quality</h2>
            <p className="text-lg text-foreground">
              Volume without quality is noise. Quality without volume is hope.{" "}
              <strong className="font-semibold">You need both.</strong>
            </p>
            <p className="text-lg text-foreground">For every application:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>Tailor your resume to the job (5 min)</li>
              <li>Write a cover note that shows you read the listing (3 min)</li>
              <li>Follow up within 48 hours</li>
            </ul>
          </section>

          <Card className="border-accent px-6">
            <ul className="list-disc pl-5 space-y-1 text-foreground">
              <li>Track every application in a spreadsheet</li>
              <li>Don&apos;t take rejection personally</li>
              <li>Each &ldquo;no&rdquo; gets you closer to the &ldquo;yes&rdquo;</li>
            </ul>
          </Card>
        </div>
      )}
    </ScreenShell>
  );
}
