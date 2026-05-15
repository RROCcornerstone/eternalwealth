"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import {
  compoundGrowthSeries,
  RETIREMENT_AGE,
} from "@/lib/math/legacy-engine";

const FMT_FULL = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const FMT_SHORT = (n: number): string => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${Math.round(n)}`;
};

type Plan = {
  inputs?: { current_age?: number } | null;
  outputs?: {
    pmt_monthly?: number;
    annual_income_needed?: number;
    years_to_retirement?: number;
    LS_total_today?: number;
  } | null;
  pmt_monthly_cents?: number | null;
  annual_income_needed_cents?: number | null;
  ls_total_today_cents?: number | null;
};

export function Screen212({ userId, brand, initialData, progress }: RenderContext) {
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
          "inputs,outputs,pmt_monthly_cents,annual_income_needed_cents,ls_total_today_cents",
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

  const currentAge = plan?.inputs?.current_age ?? 30;
  const pmtMonthly =
    plan?.pmt_monthly_cents != null
      ? plan.pmt_monthly_cents / 100
      : (plan?.outputs?.pmt_monthly as number | undefined) ?? 0;
  const annualIncome =
    plan?.annual_income_needed_cents != null
      ? plan.annual_income_needed_cents / 100
      : (plan?.outputs?.annual_income_needed as number | undefined) ?? 0;
  const years =
    plan?.outputs?.years_to_retirement ??
    Math.max(0, RETIREMENT_AGE - currentAge);
  const lsTotalToday =
    plan?.ls_total_today_cents != null
      ? plan.ls_total_today_cents / 100
      : (plan?.outputs?.LS_total_today as number | undefined) ?? 0;

  const series = useMemo(
    () => compoundGrowthSeries(currentAge, pmtMonthly),
    [currentAge, pmtMonthly],
  );

  const retirementBalance =
    series.find((p) => p.age === RETIREMENT_AGE)?.balance ?? 0;

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["2.12"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      skipSave
      continueLabel="Now show me where I actually am"
    >
      {() => (
        <div className="space-y-10">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            The path
          </p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            Here&apos;s the truth: you don&apos;t need{" "}
            {FMT_FULL.format(lsTotalToday)} today.
          </h1>
          <p className="text-lg text-muted-foreground">
            You need to plant the seed and let time + compounding do the rest.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="space-y-2 pt-2">
                <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
                  Monthly contribution
                </p>
                <p className="font-display text-3xl sm:text-4xl tabular-nums text-foreground">
                  {FMT_FULL.format(pmtMonthly)}
                </p>
                <p className="text-xs text-muted-foreground">
                  for the next {years} years
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 pt-2">
                <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
                  Annual income needed
                </p>
                <p className="font-display text-3xl sm:text-4xl tabular-nums text-foreground">
                  {FMT_FULL.format(annualIncome)}
                </p>
                <p className="text-xs text-muted-foreground">
                  (investing 10% of it)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 pt-2">
                <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
                  Growth rate used
                </p>
                <p className="font-display text-3xl sm:text-4xl tabular-nums text-foreground">
                  10%
                </p>
                <p className="text-xs text-muted-foreground">
                  /year (S&amp;P 500 historical)
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={series}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <XAxis
                    dataKey="age"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "Age",
                      position: "insideBottom",
                      offset: -4,
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => FMT_SHORT(v as number)}
                    width={64}
                  />
                  <Tooltip
                    formatter={(v) => FMT_FULL.format(v as number)}
                    labelFormatter={(age) => `Age ${age}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="currentColor"
                    className="text-accent"
                    strokeWidth={2}
                    dot={false}
                  />
                  <ReferenceDot
                    x={RETIREMENT_AGE}
                    y={retirementBalance}
                    r={6}
                    className="fill-accent stroke-accent"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="font-display italic text-center text-muted-foreground">
              This is your seed becoming a forest.
            </p>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
