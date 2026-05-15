"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";

export function Screen31({ userId, brand, initialData }: RenderContext) {
  return (
    <ScreenShell
      screen={SCREENS_BY_ID["3.1"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Start upload"
    >
      {() => (
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            Act III · Real Numbers
          </p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight text-foreground">
            Now let&apos;s get your real numbers.
          </h1>

          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              Upload the{" "}
              <strong className="text-foreground">
                last 3 months of bank statements
              </strong>{" "}
              from every account that touches your money.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-base">
              <li>Checking accounts</li>
              <li>Savings accounts</li>
              <li>Credit cards</li>
              <li>Cash apps (Venmo, PayPal, Cash App)</li>
            </ul>
            <p className="font-serif italic text-foreground">
              If money flows through it, we need it.
            </p>
          </div>

          <div className="rounded-md border border-warning/40 bg-warning/5 p-4">
            <p className="text-sm text-foreground leading-relaxed">
              <span aria-hidden="true">⚠️ </span>
              Don&apos;t skip any account &ldquo;because it&apos;s messy.&rdquo;
              That&apos;s where the truth lives. We&apos;ll handle the mess.
            </p>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Your statements are processed in real time. We only keep the
            categorized transaction data — raw PDFs auto-delete after 90 days.
          </p>
        </div>
      )}
    </ScreenShell>
  );
}
