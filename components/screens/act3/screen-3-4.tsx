"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { CATEGORY_NAMES, type CategoryId } from "@/lib/math/cashflow-engine";
import { cn } from "@/lib/utils";

interface ReviewTxn {
  id: string;
  date: string;
  description: string;
  amount: number; // negative = expense, positive = income (display only)
  category: CategoryId;
  confidence: "high" | "low";
  sample: boolean;
}

const SAMPLE: ReviewTxn[] = [
  { id: "s1", date: "2026-02-03", description: "Tithe — Cornerstone Church", amount: -200, category: 1, confidence: "high", sample: true },
  { id: "s2", date: "2026-02-04", description: "Rent payment", amount: -1750, category: 2, confidence: "high", sample: true },
  { id: "s3", date: "2026-02-07", description: "Whole Foods", amount: -142.18, category: 3, confidence: "high", sample: true },
  { id: "s4", date: "2026-02-09", description: "ACME Payroll", amount: 3050, category: 5, confidence: "high", sample: true },
  { id: "s5", date: "2026-02-11", description: "Planet Fitness", amount: -29.99, category: 4, confidence: "low", sample: true },
  { id: "s6", date: "2026-02-14", description: "Vanguard transfer", amount: -400, category: 7, confidence: "high", sample: true },
  { id: "s7", date: "2026-02-18", description: "Chase Credit Card", amount: -325, category: 6, confidence: "high", sample: true },
  { id: "s8", date: "2026-02-21", description: "Netflix", amount: -15.49, category: 8, confidence: "high", sample: true },
  { id: "s9", date: "2026-02-25", description: "Udemy course", amount: -49, category: 9, confidence: "low", sample: true },
  { id: "s10", date: "2026-02-28", description: "Etsy shop ad spend", amount: -75, category: 10, confidence: "high", sample: true },
];

const CATEGORY_TONES: Record<CategoryId, string> = {
  1: "bg-accent/10 text-accent border-accent/30",
  2: "bg-foreground/10 text-foreground border-foreground/30",
  3: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  4: "bg-sky-500/10 text-sky-600 border-sky-500/30 dark:text-sky-400",
  5: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30 dark:text-yellow-300",
  6: "bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400",
  7: "bg-purple-500/10 text-purple-600 border-purple-500/30 dark:text-purple-400",
  8: "bg-pink-500/10 text-pink-600 border-pink-500/30 dark:text-pink-400",
  9: "bg-orange-500/10 text-orange-600 border-orange-500/30 dark:text-orange-400",
  10: "bg-teal-500/10 text-teal-600 border-teal-500/30 dark:text-teal-400",
};

function fmtAmount(n: number): string {
  const sign = n < 0 ? "-" : "+";
  return `${sign}$${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function Screen34({ userId, brand, initialData }: RenderContext) {
  const initialTxns =
    ((initialData?.transactions as ReviewTxn[]) ?? null) ?? SAMPLE;
  const usingSample = initialTxns === SAMPLE || initialTxns.every((t) => t.sample);

  const [txns, setTxns] = useState<ReviewTxn[]>(initialTxns);

  const total = txns.length;
  const highConf = txns.filter((t) => t.confidence === "high").length;
  const flagged = txns.filter((t) => t.confidence === "low").length;

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["3.4"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Looks good, continue"
    >
      {({ setField }) => (
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
              Here&apos;s how we categorized your transactions.
            </h1>
            <p className="text-muted-foreground">
              Review and edit anything we got wrong.
            </p>
          </div>

          {usingSample && (
            <div className="rounded-md border border-warning/40 bg-warning/5 p-3 text-sm text-foreground">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-warning mr-2">
                Sample
              </span>
              Sample data — upload real statements to see your own.
            </div>
          )}

          <div className="rounded-md border border-border bg-card p-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-foreground tabular">
            <span>Total: <strong>{total}</strong></span>
            <span>High-confidence: <strong>{highConf}</strong></span>
            <span>Flagged: <strong>{flagged}</strong></span>
          </div>

          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  <th className="px-3 py-2 font-normal">Date</th>
                  <th className="px-3 py-2 font-normal">Description</th>
                  <th className="px-3 py-2 font-normal text-right">Amount</th>
                  <th className="px-3 py-2 font-normal">Category</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((t) => (
                  <tr key={t.id} className="border-t border-border">
                    <td className="px-3 py-2 text-muted-foreground tabular whitespace-nowrap">
                      {t.date}
                    </td>
                    <td className="px-3 py-2 text-foreground">{t.description}</td>
                    <td className={cn(
                      "px-3 py-2 text-right tabular whitespace-nowrap",
                      t.amount < 0 ? "text-foreground" : "text-emerald-600 dark:text-emerald-400",
                    )}>
                      {fmtAmount(t.amount)}
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={t.category}
                        onChange={(e) => {
                          const next = txns.map((x) =>
                            x.id === t.id
                              ? { ...x, category: Number(e.target.value) as CategoryId }
                              : x,
                          );
                          setTxns(next);
                          setField("transactions", next);
                        }}
                        className={cn(
                          "rounded-md border px-2 py-1 text-xs font-mono uppercase tracking-wider bg-transparent",
                          CATEGORY_TONES[t.category],
                        )}
                      >
                        {(Object.entries(CATEGORY_NAMES) as [string, string][]).map(
                          ([id, name]) => (
                            <option key={id} value={id}>
                              {name}
                            </option>
                          ),
                        )}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
