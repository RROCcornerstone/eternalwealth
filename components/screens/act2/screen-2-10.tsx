"use client";

import { useEffect, useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";

const FMT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type PlanRow = {
  ls_total_today_cents?: number | null;
  ls_total_nominal_cents?: number | null;
  inputs?: { current_age?: number } | null;
  outputs?: { years_to_retirement?: number; LS_total_today?: number; LS_total_nominal?: number } | null;
};

export function Screen210({
  userId,
  brand,
  initialData,
  profile,
  progress,
}: RenderContext) {
  const firstName: string =
    profile?.first_name ?? (initialData?.first_name as string) ?? "friend";

  const initialPlan: PlanRow | null = (progress?.legacy_plan as PlanRow) ?? null;
  const [plan, setPlan] = useState<PlanRow | null>(initialPlan);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (plan) return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("legacy_plans")
        .select(
          "ls_total_today_cents,ls_total_nominal_cents,inputs,outputs",
        )
        .eq("user_id", userId)
        .maybeSingle();
      if (cancelled) return;
      if (data) setPlan(data as PlanRow);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, plan]);

  useEffect(() => {
    const t = window.setTimeout(() => setRevealed(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  const today =
    plan?.ls_total_today_cents != null
      ? plan.ls_total_today_cents / 100
      : (plan?.outputs?.LS_total_today as number | undefined) ?? 0;
  const nominal =
    plan?.ls_total_nominal_cents != null
      ? plan.ls_total_nominal_cents / 100
      : (plan?.outputs?.LS_total_nominal as number | undefined) ?? 0;
  const years =
    (plan?.outputs?.years_to_retirement as number | undefined) ??
    (plan?.inputs?.current_age != null
      ? Math.max(0, 65 - (plan.inputs.current_age as number))
      : 35);

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["2.10"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      skipSave
      continueLabel="Show me the breakdown"
    >
      {() => (
        <div
          className={`space-y-10 transition-opacity duration-1000 ${
            revealed ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            The reveal
          </p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            Here&apos;s God&apos;s standard for your family, {firstName}.
          </h1>

          <Tabs defaultValue="today" className="w-full">
            <TabsList className="mx-auto">
              <TabsTrigger value="today">Today&apos;s dollars</TabsTrigger>
              <TabsTrigger value="nominal">
                Future dollars at age 65
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="mt-8">
              <p className="font-display text-6xl sm:text-7xl md:text-8xl tabular-nums text-center text-foreground mt-12 mb-8">
                {FMT.format(today)}
              </p>
              <p className="text-center text-muted-foreground">
                What it would take in today&apos;s purchasing power.
              </p>
            </TabsContent>

            <TabsContent value="nominal" className="mt-8">
              <p className="font-display text-6xl sm:text-7xl md:text-8xl tabular-nums text-center text-foreground mt-12 mb-8">
                {FMT.format(nominal)}
              </p>
              <p className="text-center text-muted-foreground">
                The actual dollar amount in your account at age 65, after{" "}
                {years} years of inflation.
              </p>
            </TabsContent>
          </Tabs>

          <p className="font-display italic text-xl sm:text-2xl text-foreground leading-snug">
            This is what it really means to leave an inheritance for your
            children&apos;s children.
          </p>
          <p className="text-base text-muted-foreground">
            Inflation-adjusted. Calculated against real investment math. Built
            on what <em>yanchil</em> — the causative inheritance from Proverbs
            13:22 — actually costs.
          </p>
        </div>
      )}
    </ScreenShell>
  );
}
