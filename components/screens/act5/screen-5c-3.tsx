"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { RenderContext } from "@/components/screens/registry";

export function Screen5C3({ userId, brand, initialData }: RenderContext) {
  const init = (initialData ?? {}) as Record<string, string>;
  const [direction, setDirection] = useState<string>(init.career_direction ?? "");

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["5C.3"]}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Save my direction"
      canContinue={Boolean(direction.trim())}
      onAdvance={async (data) => {
        const supabase = createClient();
        await supabase.from("career_purpose").upsert(
          {
            user_id: userId,
            answers: {
              q1: data.purpose_answer_1,
              q2: data.purpose_answer_2,
              q3: data.purpose_answer_3,
              q4: data.purpose_answer_4,
            },
            direction: data.career_direction,
          },
          { onConflict: "user_id" },
        );
      }}
    >
      {({ setField }) => (
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            🐂 Cattle Path
          </p>

          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            First, find your God-given purpose.
          </h1>

          <div className="space-y-4 text-lg text-foreground">
            <p>
              Before you start applying for jobs, you need a direction. God gave you a purpose —
              your job is to <em>guesstimate</em> it as best you can.
            </p>
            <p>
              This isn&apos;t going to be perfect. You don&apos;t need a 10-year career plan. You
              need a <em>general direction</em> you believe God is calling you toward.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="purpose_answer_1">What work makes you feel alive?</Label>
              <Textarea
                id="purpose_answer_1"
                defaultValue={init.purpose_answer_1 ?? ""}
                onChange={(e) => setField("purpose_answer_1", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose_answer_2">What problems do you naturally want to solve?</Label>
              <Textarea
                id="purpose_answer_2"
                defaultValue={init.purpose_answer_2 ?? ""}
                onChange={(e) => setField("purpose_answer_2", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose_answer_3">
                Where do people consistently tell you you&apos;re gifted?
              </Label>
              <Textarea
                id="purpose_answer_3"
                defaultValue={init.purpose_answer_3 ?? ""}
                onChange={(e) => setField("purpose_answer_3", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose_answer_4">
                What did you love doing before money got involved?
              </Label>
              <Textarea
                id="purpose_answer_4"
                defaultValue={init.purpose_answer_4 ?? ""}
                onChange={(e) => setField("purpose_answer_4", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <p className="text-lg text-foreground">
            Pray over your answers. Then write down the career direction you believe God is
            pointing you toward — even if it&apos;s vague.
          </p>

          <div className="space-y-2">
            <Label htmlFor="career_direction">My career direction:</Label>
            <Textarea
              id="career_direction"
              value={direction}
              onChange={(e) => {
                setDirection(e.target.value);
                setField("career_direction", e.target.value);
              }}
              rows={3}
              placeholder="e.g. Use my technical skills to build tools that help families..."
            />
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
