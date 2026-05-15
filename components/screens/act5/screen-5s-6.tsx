"use client";

import { useEffect, useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import { createClient } from "@/lib/supabase/client";
import type { RenderContext } from "@/components/screens/registry";

function formatUsd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function Screen5S6({ userId, brand, initialData }: RenderContext) {
  const [monthlyGap, setMonthlyGap] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("cash_flow_snapshots")
        .select("monthly_gap, monthly_income, monthly_expenses")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      const snap = data as
        | {
            monthly_gap?: number | null;
            monthly_income?: number | null;
            monthly_expenses?: number | null;
          }
        | null;
      const gap =
        snap?.monthly_gap ??
        Math.max(0, (snap?.monthly_income ?? 0) - (snap?.monthly_expenses ?? 0));
      setMonthlyGap(Math.max(0, gap));
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const investTotal = monthlyGap * 0.5;
  const investBtc = investTotal * 0.4;
  const investEth = investTotal * 0.3;
  const investRetirement = investTotal * 0.3;

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["5S.6"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="I'm committing to the blueprint"
      onAdvance={async (data) => {
        const supabase = createClient();
        await supabase.from("investment_blueprint").upsert(
          {
            user_id: userId,
            coinbase_setup: data.coinbase_setup ?? false,
            invest_btc_cents: Math.round(investBtc * 100),
            invest_eth_cents: Math.round(investEth * 100),
            invest_retirement_cents: Math.round(investRetirement * 100),
            total_invest_cents: Math.round(investTotal * 100),
            committed_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );
        await supabase
          .from("course_progress")
          .upsert({ user_id: userId, act5_complete: true }, { onConflict: "user_id" });
      }}
    >
      {() => (
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            🪙 Silver Path
          </p>

          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            Your investment blueprint.
          </h1>

          <div className="space-y-3 text-lg text-foreground">
            <p>Strategy:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong className="font-semibold">Auto-invest</strong> a fixed amount into BTC and
                ETH every month (DCA — dollar-cost averaging)
              </li>
              <li>
                <strong className="font-semibold">Allocation:</strong> 60% BTC, 40% ETH (or 50/50
                if you want simpler)
              </li>
              <li>
                <strong className="font-semibold">Set it and forget it.</strong> Don&apos;t try to
                time the market.
              </li>
              <li>
                <strong className="font-semibold">Increase contributions</strong> as your income
                grows.
              </li>
            </ol>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Asset
                  </th>
                  <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-muted-foreground text-right">
                    Monthly amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 text-foreground">Bitcoin (BTC)</td>
                  <td className="px-4 py-3 text-foreground text-right font-mono">
                    {loaded ? formatUsd(investBtc) : "—"}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 text-foreground">Ethereum (ETH)</td>
                  <td className="px-4 py-3 text-foreground text-right font-mono">
                    {loaded ? formatUsd(investEth) : "—"}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 text-foreground">
                    Retirement (Roth IRA, 401k)
                  </td>
                  <td className="px-4 py-3 text-foreground text-right font-mono">
                    {loaded ? formatUsd(investRetirement) : "—"}
                  </td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-4 py-3 font-semibold text-foreground">
                    Total monthly investment
                  </td>
                  <td className="px-4 py-3 text-accent text-right font-mono font-semibold">
                    {loaded ? formatUsd(investTotal) : "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground">
            (Adjustable later based on user preference. These are starter defaults.)
          </p>

          <p className="font-display italic text-xl text-accent border-l-2 border-accent p-4">
            Stewardship compounds. Faith multiplies. You&apos;re building.
          </p>
        </div>
      )}
    </ScreenShell>
  );
}
