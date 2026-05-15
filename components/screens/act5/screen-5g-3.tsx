"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import { createClient } from "@/lib/supabase/client";
import type { RenderContext } from "@/components/screens/registry";

export function Screen5G3({ userId, brand, initialData, profile }: RenderContext) {
  const firstName: string =
    profile?.first_name ?? (profile?.full_name ? String(profile.full_name).split(" ")[0] : "friend");

  // We don't have real Calendly booking data yet — show a friendly placeholder.
  const bookingDateText = "the time you selected on Calendly";

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["5G.3"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Done"
      onAdvance={async () => {
        const supabase = createClient();
        await supabase
          .from("course_progress")
          .upsert({ user_id: userId, act5_complete: true }, { onConflict: "user_id" });
      }}
    >
      {() => (
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            🏆 Gold Path
          </p>

          <h1 className="font-display text-4xl sm:text-5xl leading-tight text-foreground">
            You&apos;re booked, {firstName}.
          </h1>

          <div className="space-y-4 text-lg text-foreground">
            <p>
              Your call is scheduled for{" "}
              <strong className="font-semibold">{bookingDateText}</strong>.
            </p>
            <p>Before we talk, do this:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Have your portfolio numbers ready</li>
              <li>Know your top 3 questions for me</li>
              <li>Pray about what God is calling you to scale</li>
            </ul>
          </div>

          <p className="font-display italic text-xl text-foreground border-l-2 border-accent p-4">
            See you on the call. Bring everything.
          </p>
        </div>
      )}
    </ScreenShell>
  );
}
