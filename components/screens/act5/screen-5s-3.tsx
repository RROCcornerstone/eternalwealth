"use client";

import { useEffect, useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { RenderContext } from "@/components/screens/registry";

interface TopCategory {
  category: string;
  amount: number;
}

function formatUsd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function humanizeCategory(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Screen5S3({ userId, brand, initialData }: RenderContext) {
  const [top, setTop] = useState<TopCategory[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("cash_flow_snapshots")
        .select("category_monthly_avg")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;

      const raw = (data as { category_monthly_avg?: Record<string, number> } | null)
        ?.category_monthly_avg;
      if (raw && typeof raw === "object") {
        const entries: TopCategory[] = Object.entries(raw)
          .map(([category, amount]) => ({ category, amount: Number(amount) || 0 }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 3);
        setTop(entries);
      }
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["5S.3"]!}
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
            Grow income. Cut leaks. Both at once.
          </h1>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-accent">Grow Income</h2>
            <p className="text-lg text-foreground">
              The fastest way to widen the gap isn&apos;t cutting expenses — it&apos;s{" "}
              <strong className="font-semibold">earning more.</strong>
            </p>
            <p className="text-foreground">Options:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>Master your current job and negotiate up</li>
              <li>Add a high-value skill (sales, marketing, coding, design)</li>
              <li>Start a side business (low capital, high upside)</li>
              <li>Switch industries (engineering, finance, tech often pay more)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-accent">Cut Leaks</h2>
            <p className="text-lg text-foreground">
              While you grow income, audit your expenses. Most people leak hundreds per month on
              subscriptions, eating out, and impulse buys.
            </p>

            <Card className="px-6 space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Your top spending categories
              </p>
              {!loaded ? (
                <p className="text-muted-foreground">Loading your numbers…</p>
              ) : top.length === 0 ? (
                <p className="text-muted-foreground">
                  No category breakdown available yet — upload statements in Act 3 to see your top
                  leaks.
                </p>
              ) : (
                <ol className="space-y-2">
                  {top.map((row, i) => (
                    <li
                      key={row.category}
                      className="flex items-center justify-between text-foreground"
                    >
                      <span>
                        <span className="font-mono text-accent mr-2">{i + 1}.</span>
                        {humanizeCategory(row.category)}
                      </span>
                      <span className="font-mono">{formatUsd(row.amount)}/mo</span>
                    </li>
                  ))}
                </ol>
              )}
            </Card>
          </section>

          <Card className="border-accent px-6">
            <p className="text-foreground">
              <strong className="font-semibold">Quick wins:</strong> Cancel unused subscriptions.
              Cap eating out. Audit your &ldquo;needs&rdquo; vs. &ldquo;wants.&rdquo;
            </p>
          </Card>
        </div>
      )}
    </ScreenShell>
  );
}
