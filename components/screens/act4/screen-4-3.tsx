"use client";

import { useEffect, useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { createClient } from "@/lib/supabase/client";
import {
  BRAND_GLYPH,
  BRAND_LABEL,
  compareBrand,
  type Brand as MathBrand,
  type Comparison,
} from "@/lib/math/brand-engine";

const VERDICT: Record<Comparison, string> = {
  match: "You knew yourself. That's rare. Most people overestimate.",
  overestimated:
    "You're more ambitious than the math agrees with right now. The good news: you have a clear path forward, and you already know the framework.",
  underestimated:
    "You undervalued yourself. The math says you're further along than you thought. Time to act like it.",
};

export function Screen43({ userId, brand, initialData, progress }: RenderContext) {
  const [actualBrand, setActualBrand] = useState<MathBrand>(
    ((progress as any)?.actual_brand as MathBrand) ?? brand ?? "cattle",
  );
  const [selfId, setSelfId] = useState<MathBrand>("cattle");
  const [comparison, setComparison] = useState<Comparison>(
    ((progress as any)?.brand_comparison as Comparison) ?? "match",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();

      // self_id from 1.11
      const selfRes = await supabase
        .from("module_responses")
        .select("data")
        .eq("user_id", userId)
        .eq("module_slug", "1.11")
        .maybeSingle();
      const self = (((selfRes.data as any)?.data?.self_id as MathBrand) ?? "cattle");

      // actual brand from course_progress (if not already in props)
      let actual = actualBrand;
      if (!(progress as any)?.actual_brand) {
        const { data } = await supabase
          .from("course_progress")
          .select("actual_brand, brand_comparison")
          .eq("user_id", userId)
          .maybeSingle();
        const row = data as any;
        if (row?.actual_brand) actual = row.actual_brand as MathBrand;
        if (!cancelled && row?.brand_comparison) {
          setComparison(row.brand_comparison as Comparison);
        }
      }

      if (!cancelled) {
        setSelfId(self);
        setActualBrand(actual);
        if (!(progress as any)?.brand_comparison) {
          setComparison(compareBrand(self, actual));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["4.3"]}
      userId={userId}
      brand={brand}
      initialData={initialData}
      skipSave
      continueLabel="Continue"
    >
      {() => (
        <div className="space-y-8">
          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            Here&apos;s what you said vs. what the math says.
          </h1>

          <div className="grid gap-4 sm:grid-cols-2">
            <BrandColumn
              eyebrow="You said"
              glyph={BRAND_GLYPH[selfId]}
              label={BRAND_LABEL[selfId]}
            />
            <BrandColumn
              eyebrow="Math says"
              glyph={BRAND_GLYPH[actualBrand]}
              label={BRAND_LABEL[actualBrand]}
              accent
            />
          </div>

          <p className="text-lg text-foreground font-serif italic leading-relaxed">
            {VERDICT[comparison]}
          </p>
        </div>
      )}
    </ScreenShell>
  );
}

function BrandColumn({
  eyebrow,
  glyph,
  label,
  accent,
}: {
  eyebrow: string;
  glyph: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        "rounded-md border p-6 bg-card flex flex-col items-center text-center gap-2 " +
        (accent ? "border-accent" : "border-border")
      }
    >
      <p className="font-mono text-xs uppercase tracking-[0.32em] text-muted-foreground">
        {eyebrow}
      </p>
      <span className="text-5xl" aria-hidden="true">
        {glyph}
      </span>
      <p className={"font-display text-2xl " + (accent ? "text-accent" : "text-foreground")}>
        {label}
      </p>
    </div>
  );
}
