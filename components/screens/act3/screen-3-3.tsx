"use client";

import { useEffect, useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";

const STATUS_MESSAGES = [
  "Reading your statements...",
  "Extracting transactions...",
  "Categorizing into the 10 categories...",
  "Calculating your numbers...",
];

export function Screen33({ userId, brand, initialData }: RenderContext) {
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 1600);
    return () => clearInterval(t);
  }, []);

  // Pull approximate stats from any uploaded files in initialData.
  const uploaded = (initialData?.uploaded_files as Array<unknown>) ?? [];
  const accountsDetected = uploaded.length;
  const transactionsFound = accountsDetected * 87; // placeholder estimate
  const now = new Date();
  const start = new Date(now);
  start.setMonth(start.getMonth() - 3);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["3.3"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      skipSave
      continueLabel="Continue"
    >
      {() => (
        <div className="space-y-10 py-8">
          <div className="space-y-6 text-center">
            <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
              Reading your statements…
            </h1>

            <div className="flex items-center justify-center gap-2 py-6" aria-hidden="true">
              <span className="size-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: "0ms" }} />
              <span className="size-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: "200ms" }} />
              <span className="size-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: "400ms" }} />
            </div>

            <p
              key={statusIdx}
              className="font-serif italic text-lg text-muted-foreground transition-opacity"
            >
              {STATUS_MESSAGES[statusIdx]}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-center">
            <div className="rounded-md border border-border bg-card p-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Transactions
              </p>
              <p className="font-display text-2xl text-foreground tabular mt-1">
                {transactionsFound}
              </p>
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Accounts
              </p>
              <p className="font-display text-2xl text-foreground tabular mt-1">
                {accountsDetected}
              </p>
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Date range
              </p>
              <p className="font-display text-base text-foreground tabular mt-1">
                {fmt(start)} → {fmt(now)}
              </p>
            </div>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
