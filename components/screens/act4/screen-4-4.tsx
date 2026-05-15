"use client";

import { useEffect, useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { createClient } from "@/lib/supabase/client";
import {
  BRAND_GLYPH,
  BRAND_LABEL,
  type Brand as MathBrand,
} from "@/lib/math/brand-engine";
import { formatCurrency, cn } from "@/lib/utils";

interface Snapshot {
  monthly_income_cents: number;
  monthly_expenses_cents: number;
  monthly_gap_cents: number;
  savings_rate: number;
}

const THRESHOLDS: { brand: MathBrand; range: string }[] = [
  { brand: "cattle", range: "Under 10%" },
  { brand: "silver", range: "10% – 24%" },
  { brand: "gold", range: "25% or higher" },
];

export function Screen44({ userId, brand, initialData, progress }: RenderContext) {
  const [actualBrand, setActualBrand] = useState<MathBrand>(
    ((progress as any)?.actual_brand as MathBrand) ?? brand ?? "cattle",
  );
  const [snap, setSnap] = useState<Snapshot | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data: cf } = await supabase
        .from("cash_flow_snapshots")
        .select(
          "monthly_income_cents, monthly_expenses_cents, monthly_gap_cents, savings_rate",
        )
        .eq("user_id", userId)
        .maybeSingle();
      if (!cancelled && cf) setSnap(cf as any);

      if (!(progress as any)?.actual_brand) {
        const { data: cp } = await supabase
          .from("course_progress")
          .select("actual_brand")
          .eq("user_id", userId)
          .maybeSingle();
        const b = (cp as any)?.actual_brand as MathBrand | undefined;
        if (!cancelled && b) setActualBrand(b);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, progress]);

  const savingsPct = snap ? Math.round(snap.savings_rate * 100) : null;

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["4.4"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      skipSave
      continueLabel="Continue"
    >
      {() => (
        <div className="space-y-8">
          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            Why you&apos;re in {BRAND_LABEL[actualBrand]}.
          </h1>

          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  <th className="px-3 py-2 font-normal">Metric</th>
                  <th className="px-3 py-2 font-normal text-right">Your value</th>
                </tr>
              </thead>
              <tbody className="tabular">
                <tr className="border-t border-border">
                  <td className="px-3 py-2 text-foreground">Monthly income</td>
                  <td className="px-3 py-2 text-right">
                    {formatCurrency(snap?.monthly_income_cents)}
                  </td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-3 py-2 text-foreground">Monthly expenses</td>
                  <td className="px-3 py-2 text-right">
                    {formatCurrency(snap?.monthly_expenses_cents)}
                  </td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-3 py-2 text-foreground">Monthly gap</td>
                  <td className="px-3 py-2 text-right">
                    {formatCurrency(snap?.monthly_gap_cents)}
                  </td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-3 py-2 text-foreground">Savings rate</td>
                  <td className="px-3 py-2 text-right">
                    {savingsPct == null ? "—" : `${savingsPct}%`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  <th className="px-3 py-2 font-normal">Brand</th>
                  <th className="px-3 py-2 font-normal text-right">Savings rate</th>
                </tr>
              </thead>
              <tbody>
                {THRESHOLDS.map((t) => (
                  <tr
                    key={t.brand}
                    className={cn(
                      "border-t border-border",
                      t.brand === actualBrand && "bg-accent/5 border-accent",
                    )}
                  >
                    <td
                      className={cn(
                        "px-3 py-2",
                        t.brand === actualBrand ? "text-accent" : "text-foreground",
                      )}
                    >
                      <span className="mr-2" aria-hidden="true">
                        {BRAND_GLYPH[t.brand]}
                      </span>
                      {BRAND_LABEL[t.brand]}
                    </td>
                    <td
                      className={cn(
                        "px-3 py-2 text-right tabular",
                        t.brand === actualBrand ? "text-accent" : "text-muted-foreground",
                      )}
                    >
                      {t.range}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
            <p>
              Your savings rate is{" "}
              <strong className="text-foreground">
                {savingsPct == null ? "—" : `${savingsPct}%`}
              </strong>
              , which puts you in{" "}
              <strong className="text-accent">{BRAND_LABEL[actualBrand]}</strong>.
            </p>
            <p className="font-serif italic text-foreground">
              This isn&apos;t a judgment. It&apos;s a map. Now we know exactly
              where to start.
            </p>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
