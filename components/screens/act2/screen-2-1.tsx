"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function Screen21({ userId, brand, initialData, profile }: RenderContext) {
  const initial = {
    first_name:
      (initialData?.first_name as string) ?? profile?.first_name ?? "",
    ...initialData,
  };

  const [firstName, setFirstName] = useState<string>(
    (initial.first_name as string) ?? "",
  );

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["2.1"]!}
      userId={userId}
      brand={brand}
      initialData={initial}
      canContinue={Boolean(firstName.trim())}
      onAdvance={async () => {
        const supabase = createClient();
        const trimmed = firstName.trim();
        if (trimmed) {
          await supabase
            .from("user_profiles")
            .upsert(
              { user_id: userId, first_name: trimmed } as never,
              { onConflict: "user_id" },
            );
        }
      }}
    >
      {({ setField }) => (
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            Act II · Set Your Legacy
          </p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            Let&apos;s build your legacy. What should we call you?
          </h1>
          <div className="space-y-2">
            <Label
              htmlFor="first_name"
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
            >
              Your name
            </Label>
            <Input
              id="first_name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setField("first_name", e.target.value);
              }}
              placeholder="First name"
              autoFocus
              className="text-lg"
            />
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
