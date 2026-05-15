"use client";

import { useEffect, useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { computeLegacy, type LegacyInputs } from "@/lib/math/legacy-engine";

export function Screen29({ userId, brand, initialData, profile }: RenderContext) {
  const firstName: string =
    (initialData?.first_name as string) ?? profile?.first_name ?? "friend";

  const [email, setEmail] = useState<string>(
    (initialData?.email as string) ?? profile?.email ?? "",
  );
  const [phone, setPhone] = useState<string>(
    (initialData?.phone as string) ?? profile?.phone ?? "",
  );

  // Pull saved responses so onAdvance has everything we need without a race.
  const [responses, setResponses] = useState<Record<string, any>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("module_responses")
        .select("module_slug,data")
        .eq("user_id", userId)
        .in("module_slug", ["2.1", "2.2", "2.3", "2.4", "2.6", "2.7", "2.8"]);
      if (cancelled) return;
      const map: Record<string, any> = {};
      for (const row of (data ?? []) as any[]) {
        map[row.module_slug] = row.data;
      }
      setResponses(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const canContinue = Boolean(email.trim()) && Boolean(phone.trim());

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["2.9"]}
      userId={userId}
      brand={brand}
      initialData={{ email, phone, ...initialData }}
      canContinue={canContinue}
      continueLabel="Show me my number"
      onAdvance={async (data) => {
        const supabase = createClient();

        const input: LegacyInputs = {
          current_age:
            (responses["2.2"]?.current_age as number) ??
            (profile?.current_age as number) ??
            30,
          num_children:
            (responses["2.3"]?.num_children as number) ??
            (profile?.num_children as number) ??
            0,
          num_grandchildren:
            (responses["2.4"]?.num_grandchildren as number) ??
            (profile?.num_planned_grandchildren as number) ??
            0,
          retirement_spending_today:
            (responses["2.6"]?.retirement_spending_today as number) ?? 80_000,
          gift_per_child_today:
            (responses["2.7"]?.gift_per_child_today as number) ?? 40_000,
          gift_per_grandchild_today:
            (responses["2.8"]?.gift_per_grandchild_today as number) ?? 40_000,
        };

        const outputs = computeLegacy(input);

        await supabase
          .from("legacy_plans")
          .upsert(
            {
              user_id: userId,
              inputs: input,
              outputs,
              retirement_spending_today: input.retirement_spending_today,
              gift_per_child_today: input.gift_per_child_today,
              gift_per_grandchild_today: input.gift_per_grandchild_today,
              ls_retirement_cents: Math.round(outputs.LS_retirement * 100),
              ls_per_child_cents: Math.round(outputs.LS_per_child * 100),
              ls_per_grandchild_at_retirement_cents: Math.round(
                outputs.LS_per_grandchild_at_retirement * 100,
              ),
              ls_all_children_cents: Math.round(
                outputs.LS_all_children * 100,
              ),
              ls_all_grandchildren_cents: Math.round(
                outputs.LS_all_grandchildren * 100,
              ),
              ls_total_today_cents: Math.round(outputs.LS_total_today * 100),
              ls_total_nominal_cents: Math.round(
                outputs.LS_total_nominal * 100,
              ),
              pmt_monthly_cents: Math.round(outputs.pmt_monthly * 100),
              annual_income_needed_cents: Math.round(
                outputs.annual_income_needed * 100,
              ),
            } as never,
            { onConflict: "user_id" },
          );

        await supabase
          .from("user_profiles")
          .upsert(
            {
              user_id: userId,
              phone: (data.phone as string) ?? phone,
              email: (data.email as string) ?? email,
            } as never,
            { onConflict: "user_id" },
          );
      }}
    >
      {({ setField }) => (
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            Act II · Save Your Plan
          </p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            Your legacy number is ready, {firstName}.
          </h1>
          <p className="text-lg text-muted-foreground">
            Drop your email and phone so we can save your plan and send you the
            breakdown.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setField("email", e.target.value);
                }}
                placeholder="you@email.com"
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setField("phone", e.target.value);
                }}
                placeholder="(555) 123-4567"
                className="text-lg"
              />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            We won&apos;t spam you or sell your data.
          </p>
        </div>
      )}
    </ScreenShell>
  );
}
