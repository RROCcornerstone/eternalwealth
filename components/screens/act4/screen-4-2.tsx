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

const SUBTEXT: Record<MathBrand, string> = {
  cattle:
    "You're still building your foundation. That's not failure — it's where every legacy starts.",
  silver: "Your foundation is set. You're ready to grow.",
  gold: "You're in multiplication territory. Time to scale.",
};

export function Screen42({ userId, brand, initialData, progress, profile }: RenderContext) {
  const [actualBrand, setActualBrand] = useState<MathBrand>(
    ((progress as any)?.actual_brand as MathBrand) ?? brand ?? "cattle",
  );
  const firstName: string =
    (profile?.first_name as string) ??
    ((initialData?.first_name as string) ?? "Friend");

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
      const b = ((data as any)?.actual_brand as MathBrand | undefined);
      if (!cancelled && b) setActualBrand(b);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, progress]);

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["4.2"]}
      userId={userId}
      brand={brand}
      initialData={initialData}
      skipSave
      continueLabel="Why?"
    >
      {() => (
        <div className="flex flex-col items-center justify-center min-h-[55vh] gap-8 text-center">
          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            {firstName}, your financial brand is...
          </h1>

          <div
            className="flex flex-col items-center gap-2"
            style={{ animation: "brandReveal 700ms ease-out" }}
          >
            <span className="text-7xl sm:text-8xl" aria-hidden="true">
              {BRAND_GLYPH[actualBrand]}
            </span>
            <span className="font-display text-6xl sm:text-7xl tracking-wide text-accent uppercase">
              {BRAND_LABEL[actualBrand]}
            </span>
          </div>

          <p className="max-w-xl text-lg text-muted-foreground font-serif italic">
            {SUBTEXT[actualBrand]}
          </p>

          <style jsx>{`
            @keyframes brandReveal {
              from { opacity: 0; transform: scale(0.85); }
              to   { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </ScreenShell>
  );
}
