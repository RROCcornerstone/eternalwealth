"use client";

import { useMemo, useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IncomeKind = "income" | "transfer";

interface DepositRow {
  id: string;
  date: string;
  description: string;
  amount: number;
  source: string;
  kind: IncomeKind;
  sample: boolean;
}

const SAMPLE_DEPOSITS: DepositRow[] = [
  { id: "d1", date: "2026-02-09", description: "ACME Payroll", amount: 3050, source: "ACME Payroll", kind: "income", sample: true },
  { id: "d2", date: "2026-02-23", description: "ACME Payroll", amount: 3050, source: "ACME Payroll", kind: "income", sample: true },
  { id: "d3", date: "2026-02-15", description: "Venmo from Sarah", amount: 120, source: "Venmo from Sarah", kind: "transfer", sample: true },
  { id: "d4", date: "2026-02-19", description: "Amazon refund", amount: 47.99, source: "Amazon refund", kind: "transfer", sample: true },
  { id: "d5", date: "2026-02-26", description: "Side gig — Stripe payout", amount: 425, source: "Stripe payout", kind: "income", sample: true },
];

function fmt(n: number): string {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function Screen35({ userId, brand, initialData }: RenderContext) {
  // Pull from initialData.deposits or transactions where amount > 0; fallback to sample.
  const fromInitial = (initialData?.deposits as DepositRow[]) ?? null;
  const fromTxns = (initialData?.transactions as Array<{
    id: string; date: string; description: string; amount: number;
  }> | undefined)?.filter((t) => t.amount > 0).map<DepositRow>((t) => ({
    id: t.id,
    date: t.date,
    description: t.description,
    amount: t.amount,
    source: t.description,
    kind: "income",
    sample: false,
  }));

  const initial = fromInitial ?? (fromTxns && fromTxns.length ? fromTxns : SAMPLE_DEPOSITS);
  const usingSample = initial.every((d) => d.sample);
  const [rows, setRows] = useState<DepositRow[]>(initial);

  const sources = useMemo(() => Array.from(new Set(rows.map((r) => r.source))), [rows]);

  function setKind(id: string, kind: IncomeKind, setField: (k: string, v: unknown) => void) {
    const next = rows.map((r) => (r.id === id ? { ...r, kind } : r));
    setRows(next);
    setField("deposits", next);
  }

  function bulkSet(source: string, kind: IncomeKind, setField: (k: string, v: unknown) => void) {
    const next = rows.map((r) => (r.source === source ? { ...r, kind } : r));
    setRows(next);
    setField("deposits", next);
  }

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["3.5"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Continue"
    >
      {({ setField }) => (
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
              Let&apos;s verify your income.
            </h1>
            <p className="text-muted-foreground">
              We found these deposits. Mark which are real income vs. transfers
              or refunds.
            </p>
          </div>

          {usingSample && (
            <div className="rounded-md border border-warning/40 bg-warning/5 p-3 text-sm text-foreground">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-warning mr-2">
                Sample
              </span>
              Sample data — upload real statements to verify your own deposits.
            </div>
          )}

          {sources.length > 0 && (
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Bulk actions
              </p>
              <div className="flex flex-wrap gap-2">
                {sources.map((src) => (
                  <div
                    key={src}
                    className="flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs"
                  >
                    <span className="text-muted-foreground mr-1">{src}:</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => bulkSet(src, "income", setField)}
                    >
                      Mark all income
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => bulkSet(src, "transfer", setField)}
                    >
                      Mark all transfer
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ul className="space-y-2">
            {rows.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-4 rounded-md border border-border bg-card px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{r.description}</p>
                  <p className="text-xs text-muted-foreground tabular">
                    {r.date} · {fmt(r.amount)}
                  </p>
                </div>
                <div className="flex shrink-0 rounded-md border border-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setKind(r.id, "income", setField)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors",
                      r.kind === "income"
                        ? "bg-accent text-accent-foreground"
                        : "bg-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Real income
                  </button>
                  <button
                    type="button"
                    onClick={() => setKind(r.id, "transfer", setField)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-mono uppercase tracking-wider border-l border-border transition-colors",
                      r.kind === "transfer"
                        ? "bg-foreground text-background"
                        : "bg-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Transfer / Refund
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ScreenShell>
  );
}
