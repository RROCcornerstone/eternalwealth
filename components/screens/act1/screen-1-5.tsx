"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";

export function Screen15({ userId, brand, initialData }: RenderContext) {
  return (
    <ScreenShell
      screen={SCREENS_BY_ID["1.5"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Keep going"
    >
      {() => (
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">Cattle</p>

          <div className="flex items-start gap-4">
            <span className="text-6xl leading-none" aria-hidden="true">
              🐂
            </span>
            <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
              <span lang="he" dir="rtl" className="font-serif">
                בַּמִּקְנֶה
              </span>{" "}
              (ba-mikneh) — &ldquo;in livestock&rdquo;
            </h1>
          </div>

          <div className="space-y-4 text-lg text-foreground">
            <p>
              Root word:{" "}
              <strong className="font-medium">
                <span lang="he" dir="rtl" className="font-serif">
                  קָנָה
                </span>
              </strong>{" "}
              (qanah) — &ldquo;to acquire, to possess&rdquo;
            </p>
            <p>
              Mikneh literally means <em>acquired possessions</em> — but specifically livestock,
              because in Abram&apos;s world, livestock was the most fundamental form of acquired
              wealth.
            </p>
            <p>
              Why God listed it first: it represents{" "}
              <strong className="font-medium">stability</strong>. Food, labor, daily survival.
              Your foundation.
            </p>
          </div>

          <div className="border-l-2 border-accent p-4">
            <p className="text-base text-foreground">
              Without your cattle, nothing else matters. Without your foundation, more money will
              only multiply your chaos.
            </p>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
