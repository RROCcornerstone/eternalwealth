"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";

export function Screen13({ userId, brand, initialData }: RenderContext) {
  return (
    <ScreenShell
      screen={SCREENS_BY_ID["1.3"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Break it down for me"
    >
      {() => (
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            Genesis 13:2
          </p>

          <div className="space-y-6">
            <p
              lang="he"
              dir="rtl"
              className="font-serif text-4xl text-foreground leading-relaxed"
            >
              וְאַבְרָם כָּבֵד מְאֹד בַּמִּקְנֶה בַּכֶּסֶף וּבַזָּהָב
            </p>

            <p className="italic text-xl text-muted-foreground">
              v&apos;Avram kaved me&apos;od ba-mikneh ba-kesef u-va-zahav
            </p>

            <p className="font-display italic text-2xl text-foreground">
              And Abram was very rich in livestock, in silver, and in gold.
            </p>

            <p className="font-mono uppercase text-xs tracking-wider text-accent">
              — Genesis 13:2
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            This is the first time the word &ldquo;rich&rdquo; appears in the Bible. Every word here
            is loaded.
          </p>
        </div>
      )}
    </ScreenShell>
  );
}
