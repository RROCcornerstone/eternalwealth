"use client";

import { useEffect, useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { createClient } from "@/lib/supabase/client";

export function Screen213({ userId, brand, initialData, profile }: RenderContext) {
  const [selfId, setSelfId] = useState<string>(
    (profile?.self_id as string) ?? "what you said you were",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("module_responses")
        .select("data")
        .eq("user_id", userId)
        .eq("module_slug", "1.11")
        .maybeSingle();
      if (cancelled) return;
      const sid = (data as any)?.data?.self_id;
      if (typeof sid === "string" && sid.trim().length > 0) {
        setSelfId(sid);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["2.13"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      skipSave
      continueLabel="Upload my statements"
    >
      {() => (
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            Act II · Transition
          </p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            We just showed you where God&apos;s calling you to go.
          </h1>

          <div className="space-y-4 text-lg text-foreground">
            <p>Now we find out where you actually are right now.</p>
            <p>
              Upload your last 3 months of bank statements. We&apos;ll
              auto-categorize every transaction, calculate your real income vs.
              expenses, and tell you exactly what your gap looks like.
            </p>
            <p>
              And remember — you said you were{" "}
              <strong className="font-medium">{selfId}</strong>.
            </p>
            <p className="font-display italic text-accent">
              Let&apos;s see if the math agrees.
            </p>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
