"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";

const BRAND_LABELS: Record<string, string> = {
  cattle: "Cattle (Mikneh)",
  silver: "Silver (Kesef)",
  gold: "Gold (Zahav)",
};

export function Screen112({ userId, brand, initialData, profile, progress }: RenderContext) {
  const firstName: string = profile?.first_name ?? "friend";

  const selfId: string | undefined =
    (initialData as { self_id?: string } | null)?.self_id ??
    (progress as { self_id?: string } | null)?.self_id;

  const selfIdLabel = selfId && BRAND_LABELS[selfId] ? BRAND_LABELS[selfId] : "where you said you are";

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["1.12"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Set my legacy"
    >
      {() => (
        <div className="space-y-6">
          <h1 className="font-display text-4xl sm:text-5xl leading-tight text-foreground">
            We hear you, {firstName}.
          </h1>

          <div className="space-y-4 text-lg text-foreground">
            <p>
              You think you&apos;re <strong className="font-medium">{selfIdLabel}</strong>.
            </p>
            <p>
              We&apos;re going to confirm exactly where you stand — with real math from your real
              numbers.
            </p>
            <p>
              But before we look at where you <em>are</em>&hellip;
            </p>
            <p>
              Let&apos;s look at where God is calling you to <em>go</em>.
            </p>
          </div>

          <p className="font-display italic text-xl text-foreground border-l-2 border-accent p-4">
            You can&apos;t measure a gap if you don&apos;t know the destination.
          </p>
        </div>
      )}
    </ScreenShell>
  );
}
