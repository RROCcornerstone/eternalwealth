"use client";

import { useEffect, useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { INFLATION } from "@/lib/math/legacy-engine";

const FMT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type Plan = {
  inputs?: {
    num_children?: number;
    num_grandchildren?: number;
    retirement_spending_today?: number;
    gift_per_child_today?: number;
    gift_per_grandchild_today?: number;
    current_age?: number;
  } | null;
  outputs?: {
    years_to_retirement?: number;
    LS_retirement?: number;
    LS_all_children?: number;
    LS_all_grandchildren?: number;
    LS_total_today?: number;
    LS_total_nominal?: number;
  } | null;
  ls_retirement_cents?: number | null;
  ls_all_children_cents?: number | null;
  ls_all_grandchildren_cents?: number | null;
  ls_total_today_cents?: number | null;
  ls_total_nominal_cents?: number | null;
};

function dollars(cents: number | null | undefined, fallback: number | undefined) {
  if (typeof cents === "number") return cents / 100;
  if (typeof fallback === "number") return fallback;
  return 0;
}

export function Screen211({ userId, brand, initialData, progress }: RenderContext) {
  const [plan, setPlan] = useState<Plan | null>(
    (progress?.legacy_plan as Plan) ?? null,
  );

  useEffect(() => {
    if (plan) return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("legacy_plans")
        .select(
          "inputs,outputs,ls_retirement_cents,ls_all_children_cents,ls_all_grandchildren_cents,ls_total_today_cents,ls_total_nominal_cents",
        )
        .eq("user_id", userId)
        .maybeSingle();
      if (cancelled) return;
      if (data) setPlan(data as Plan);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, plan]);

  const numChildren = plan?.inputs?.num_children ?? 0;
  const numGrand = plan?.inputs?.num_grandchildren ?? 0;
  const retirementSpending = plan?.inputs?.retirement_spending_today ?? 0;
  const giftChild = plan?.inputs?.gift_per_child_today ?? 0;
  const giftGrand = plan?.inputs?.gift_per_grandchild_today ?? 0;
  const yearsToRet =
    plan?.outputs?.years_to_retirement ??
    Math.max(0, 65 - (plan?.inputs?.current_age ?? 30));

  const lsRetirementToday = dollars(
    plan?.ls_retirement_cents,
    plan?.outputs?.LS_retirement,
  );
  const lsChildrenToday = dollars(
    plan?.ls_all_children_cents,
    plan?.outputs?.LS_all_children,
  );
  const lsGrandToday = dollars(
    plan?.ls_all_grandchildren_cents,
    plan?.outputs?.LS_all_grandchildren,
  );
  const lsTotalToday = dollars(
    plan?.ls_total_today_cents,
    plan?.outputs?.LS_total_today,
  );
  const lsTotalNominal = dollars(
    plan?.ls_total_nominal_cents,
    plan?.outputs?.LS_total_nominal,
  );

  const inflationFactor = Math.pow(1 + INFLATION, yearsToRet);
  const lsRetirementNominal = lsRetirementToday * inflationFactor;
  const lsChildrenNominal = lsChildrenToday * inflationFactor;
  const lsGrandNominal = lsGrandToday * inflationFactor;

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["2.11"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      skipSave
      continueLabel="Show me how to actually get there"
    >
      {() => (
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            The breakdown
          </p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            Here&apos;s what that number actually covers.
          </h1>

          <Tabs defaultValue="today" className="w-full">
            <TabsList>
              <TabsTrigger value="today">Today&apos;s $</TabsTrigger>
              <TabsTrigger value="nominal">Nominal (at 65)</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="mt-6">
              <BreakdownTable
                retirement={lsRetirementToday}
                children={lsChildrenToday}
                grand={lsGrandToday}
                total={lsTotalToday}
                numChildren={numChildren}
                numGrand={numGrand}
                retirementSpending={retirementSpending}
                giftChild={giftChild}
                giftGrand={giftGrand}
                unitLabel="in today's dollars"
              />
            </TabsContent>
            <TabsContent value="nominal" className="mt-6">
              <BreakdownTable
                retirement={lsRetirementNominal}
                children={lsChildrenNominal}
                grand={lsGrandNominal}
                total={lsTotalNominal}
                numChildren={numChildren}
                numGrand={numGrand}
                retirementSpending={retirementSpending}
                giftChild={giftChild}
                giftGrand={giftGrand}
                unitLabel="in today's dollars (per-year basis)"
              />
            </TabsContent>
          </Tabs>

          <Card className="border-accent">
            <CardContent className="space-y-3 text-foreground">
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
                📖 Proverbs 13:22
              </p>
              <p className="font-display italic text-xl leading-snug">
                &ldquo;A good man leaves an inheritance to his children&apos;s
                children.&rdquo;
              </p>
              <p className="text-base text-muted-foreground">
                You just calculated what <em>yanchil</em> — the active,
                causative inheritance — costs in real dollars.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </ScreenShell>
  );
}

function BreakdownTable({
  retirement,
  children,
  grand,
  total,
  numChildren,
  numGrand,
  retirementSpending,
  giftChild,
  giftGrand,
  unitLabel,
}: {
  retirement: number;
  children: number;
  grand: number;
  total: number;
  numChildren: number;
  numGrand: number;
  retirementSpending: number;
  giftChild: number;
  giftGrand: number;
  unitLabel: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground py-3 pr-4">
              Who it funds
            </th>
            <th className="text-right font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground py-3 px-4">
              Amount
            </th>
            <th className="text-left font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground py-3 pl-4">
              What they receive
            </th>
          </tr>
        </thead>
        <tbody className="text-foreground">
          <tr className="border-b border-border">
            <td className="py-4 pr-4">
              <strong className="font-medium">You</strong>{" "}
              <span className="text-muted-foreground">(retirement, 30 yrs)</span>
            </td>
            <td className="py-4 px-4 text-right tabular-nums font-display">
              {FMT.format(retirement)}
            </td>
            <td className="py-4 pl-4 text-sm text-muted-foreground">
              {FMT.format(retirementSpending)}/yr {unitLabel}
            </td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-4 pr-4">
              <strong className="font-medium">{numChildren} Children</strong>{" "}
              <span className="text-muted-foreground">(30 yrs each)</span>
            </td>
            <td className="py-4 px-4 text-right tabular-nums font-display">
              {FMT.format(children)}
            </td>
            <td className="py-4 pl-4 text-sm text-muted-foreground">
              {FMT.format(giftChild)}/yr {unitLabel} per child
            </td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-4 pr-4">
              <strong className="font-medium">
                {numGrand} Grandchildren
              </strong>{" "}
              <span className="text-muted-foreground">(30 yrs each)</span>
            </td>
            <td className="py-4 px-4 text-right tabular-nums font-display">
              {FMT.format(grand)}
            </td>
            <td className="py-4 pl-4 text-sm text-muted-foreground">
              {FMT.format(giftGrand)}/yr {unitLabel} per grandchild
            </td>
          </tr>
          <tr>
            <td className="py-4 pr-4">
              <strong className="font-medium">Total</strong>
            </td>
            <td className="py-4 px-4 text-right tabular-nums font-display text-accent text-xl">
              <strong className="font-semibold">{FMT.format(total)}</strong>
            </td>
            <td className="py-4 pl-4" />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
