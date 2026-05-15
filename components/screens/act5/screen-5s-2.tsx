"use client";

import { useEffect, useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { RenderContext } from "@/components/screens/registry";

interface Snapshot {
  monthly_income?: number | null;
  monthly_expenses?: number | null;
  monthly_gap?: number | null;
  savings_rate?: number | null;
}

function formatUsd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function Screen5S2({ userId, brand, initialData }: RenderContext) {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("cash_flow_snapshots")
        .select("monthly_income, monthly_expenses, monthly_gap, savings_rate")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      setSnap((data as Snapshot | null) ?? null);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const monthlyIncome = snap?.monthly_income ?? 0;
  const monthlyExpenses = snap?.monthly_expenses ?? 0;
  const monthlyGap = snap?.monthly_gap ?? monthlyIncome - monthlyExpenses;
  const savingsRate = snap?.savings_rate ?? (monthlyIncome > 0 ? monthlyGap / monthlyIncome : 0);

  const goldThresholdAmount = monthlyIncome * 0.25;
  const closeBy = Math.max(0, goldThresholdAmount - Math.max(0, monthlyGap));

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["5S.2"]}
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
            Make the gap bigger.
          </h1>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Metric
                  </th>
                  <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-muted-foreground text-right">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 text-foreground">Monthly income</td>
                  <td className="px-4 py-3 text-foreground text-right font-mono">
                    {formatUsd(monthlyIncome)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 text-foreground">Monthly expenses</td>
                  <td className="px-4 py-3 text-foreground text-right font-mono">
                    {formatUsd(monthlyExpenses)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-semibold text-foreground">Current gap</td>
                  <td className="px-4 py-3 text-accent text-right font-mono font-semibold">
                    {formatUsd(monthlyGap)}/month
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground">Savings rate</td>
                  <td className="px-4 py-3 text-foreground text-right font-mono">
                    {(savingsRate * 100).toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Card className="px-6 space-y-3">
            <p className="text-lg text-foreground">
              Get your savings rate to <strong className="font-semibold">25%</strong> — that&apos;s
              the Gold threshold.
            </p>
            <p className="text-foreground">Two ways to do it:</p>
            <ol className="list-decimal pl-6 space-y-1 text-foreground">
              <li>
                <strong className="font-semibold">Increase income</strong>
              </li>
              <li>
                <strong className="font-semibold">Decrease expenses</strong>
              </li>
            </ol>
            <p className="text-foreground">
              Both work. Both are needed. But long-term, income growth wins.
            </p>
          </Card>

          <Card className="border-accent px-6 space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
              Gold threshold math
            </p>
            <p className="text-foreground">
              At your current income, 25% of {formatUsd(monthlyIncome)} ={" "}
              <strong className="font-semibold">{formatUsd(goldThresholdAmount)}/mo</strong>.
            </p>
            {loaded && closeBy > 0 ? (
              <p className="text-foreground">
                You&apos;re <strong className="font-semibold">{formatUsd(closeBy)}/month</strong>{" "}
                away from the Gold threshold.
              </p>
            ) : loaded ? (
              <p className="text-foreground">You&apos;re already at or above the Gold threshold.</p>
            ) : (
              <p className="text-muted-foreground">Loading your numbers…</p>
            )}
          </Card>
        </div>
      )}
    </ScreenShell>
  );
}
