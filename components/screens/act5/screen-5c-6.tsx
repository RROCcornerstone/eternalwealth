"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { RenderContext } from "@/components/screens/registry";

export function Screen5C6({ userId, brand, initialData }: RenderContext) {
  return (
    <ScreenShell
      screen={SCREENS_BY_ID["5C.6"]}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="I'm starting today"
      onAdvance={async () => {
        const supabase = createClient();
        await supabase
          .from("course_progress")
          .upsert({ user_id: userId, act5_complete: true }, { onConflict: "user_id" });
      }}
    >
      {() => (
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            🐂 Cattle Path
          </p>

          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            Don&apos;t stop until you have the offer.
          </h1>

          <div className="space-y-4 text-lg text-foreground">
            <p>
              Cattle isn&apos;t permanent. It&apos;s a stage. The moment you secure a better job —
              you move forward.
            </p>
            <p>
              And once you&apos;re in: <strong className="font-semibold">keep applying.</strong>{" "}
              Always be looking for the next opportunity. The &ldquo;better job&rdquo; becomes the
              next better job becomes the Silver phase.
            </p>
            <p>You stay hungry. You stay faithful. You don&apos;t stop.</p>
          </div>

          <Card className="px-6">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Tracking dashboard
              </p>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Applications this week</dt>
                  <dd className="font-display text-3xl text-accent">0</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Interviews scheduled</dt>
                  <dd className="font-display text-3xl text-accent">0</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Offers received</dt>
                  <dd className="font-display text-3xl text-accent">0</dd>
                </div>
              </dl>
            </div>
          </Card>

          <p className="font-display italic text-xl text-foreground border-l-2 border-accent p-4">
            God is your provider. Your obedience is the application.
          </p>
        </div>
      )}
    </ScreenShell>
  );
}
