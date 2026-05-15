"use client";

import { useEffect, useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { createClient } from "@/lib/supabase/client";
import { BRAND_LABEL, type Brand as MathBrand } from "@/lib/math/brand-engine";

const BODY: Record<MathBrand, JSX.Element> = {
  cattle: (
    <p>
      Your roadmap is focused on one thing:{" "}
      <strong className="text-foreground">increasing your income</strong>.
      We&apos;re going to walk through it step by step — finding your
      God-given purpose, applying for better jobs, and getting out of Cattle as
      fast as possible.
    </p>
  ),
  silver: (
    <p>
      Your roadmap is focused on{" "}
      <strong className="text-foreground">widening the gap</strong>. More
      income, less waste, and starting to deploy your margin into investments
      that multiply.
    </p>
  ),
  gold: (
    <p>
      Your roadmap is different. At your level, the playbook is custom.
      You&apos;re going to work with me directly.
    </p>
  ),
};

export function Screen45({ userId, brand, initialData, progress }: RenderContext) {
  const [actualBrand, setActualBrand] = useState<MathBrand>(
    ((progress as any)?.actual_brand as MathBrand) ?? brand ?? "cattle",
  );

  useEffect(() => {
    if ((progress as any)?.actual_brand) return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("course_progress")
        .select("actual_brand")
        .eq("user_id", userId)
        .maybeSingle();
      const b = (data as any)?.actual_brand as MathBrand | undefined;
      if (!cancelled && b) setActualBrand(b);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, progress]);

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["4.5"]}
      userId={userId}
      brand={actualBrand}
      initialData={initialData}
      continueLabel={`Start my ${BRAND_LABEL[actualBrand]} path`}
    >
      {() => (
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            Act IV · Transition
          </p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            Let&apos;s build your {BRAND_LABEL[actualBrand]} roadmap.
          </h1>
          <div className="text-lg text-muted-foreground leading-relaxed">
            {BODY[actualBrand]}
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
