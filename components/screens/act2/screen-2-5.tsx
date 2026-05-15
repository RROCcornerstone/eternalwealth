"use client";

import { useEffect, useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export function Screen25({ userId, brand, initialData, profile }: RenderContext) {
  const [grandchildren, setGrandchildren] = useState<number | null>(
    typeof profile?.num_planned_grandchildren === "number"
      ? (profile.num_planned_grandchildren as number)
      : null,
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("module_responses")
        .select("data")
        .eq("user_id", userId)
        .eq("module_slug", "2.4")
        .maybeSingle();
      if (cancelled) return;
      const n = (data as any)?.data?.num_grandchildren;
      if (typeof n === "number") setGrandchildren(n);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const grandLabel = grandchildren != null ? String(grandchildren) : "X";

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["2.5"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel={`Show me what that looks like for ${grandLabel} grandchildren`}
    >
      {() => (
        <div className="space-y-10">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            Proverbs 13:22
          </p>

          <div className="space-y-3 text-center">
            <p
              lang="he"
              dir="rtl"
              className="font-serif text-4xl text-foreground"
            >
              טוֹב יַנְחִיל בְּנֵי בָנִים
            </p>
            <p className="font-serif italic text-xl text-muted-foreground">
              tov yanchil b&apos;nei vanim
            </p>
            <p className="font-display italic text-2xl text-foreground leading-snug">
              &ldquo;A good man leaves an inheritance to his children&apos;s
              children…&rdquo;
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
              — Proverbs 13:22
            </p>
          </div>

          <div className="border-l-2 border-accent p-4 space-y-4 text-foreground">
            <p>
              <strong className="font-medium">
                <span lang="he" dir="rtl" className="font-serif">
                  טוֹב
                </span>{" "}
                (tov) — &ldquo;good.&rdquo;
              </strong>{" "}
              Not &ldquo;wealthy.&rdquo; Not &ldquo;successful.&rdquo;{" "}
              <em>Good.</em> The standard isn&apos;t what you have — it&apos;s
              what kind of man you are.
            </p>
            <p>
              <strong className="font-medium">
                <span lang="he" dir="rtl" className="font-serif">
                  יַנְחִיל
                </span>{" "}
                (yanchil) — the key word.
              </strong>{" "}
              It&apos;s not the passive &ldquo;leaves.&rdquo; It&apos;s a{" "}
              <strong className="font-medium">causative</strong> verb. It
              literally means <em>causes to inherit</em>. A good man doesn&apos;t
              just hope his grandkids inherit something — he actively,
              intentionally <strong className="font-medium">causes</strong> it
              to happen. He builds a structure that delivers it.
            </p>
            <p>
              <strong className="font-medium">
                <span lang="he" dir="rtl" className="font-serif">
                  בְּנֵי בָנִים
                </span>{" "}
                (b&apos;nei vanim) — literally &ldquo;sons of sons.&rdquo;
              </strong>{" "}
              Two generations forward. Hebrew bakes generational thinking right
              into the grammar.
            </p>
          </div>

          <Card className="border-accent">
            <CardContent className="space-y-3 text-foreground">
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
                What this means for you
              </p>
              <ul className="space-y-3 list-none">
                <li>
                  The standard isn&apos;t your retirement. It isn&apos;t even
                  your children. It&apos;s your{" "}
                  <strong className="font-medium">children&apos;s children.</strong>
                </li>
                <li>
                  Two generations forward. People you may never meet.
                </li>
                <li>
                  Most people plan for the weekend. God plans for the{" "}
                  <em>grandchildren.</em>
                </li>
                <li>
                  And the word <em>yanchil</em> tells us this doesn&apos;t
                  happen by accident. You have to{" "}
                  <strong className="font-medium">cause</strong> it. With
                  structure. With math. With time.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </ScreenShell>
  );
}
