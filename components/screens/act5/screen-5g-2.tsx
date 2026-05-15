"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RenderContext } from "@/components/screens/registry";

// TODO(DRAFT): Replace with real Calendly link from Alex.
// <!-- DRAFT: Alex to replace -->
const CALENDLY_URL = "https://calendly.com/alexanderlorenzo/strategy";

export function Screen5G2({ userId, brand, initialData }: RenderContext) {
  const init = (initialData ?? {}) as Record<string, unknown>;
  const [bookingClicked, setBookingClicked] = useState<boolean>(
    Boolean(init.call_booking_id),
  );

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["5G.2"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Book a call with Alex"
      canContinue={bookingClicked}
    >
      {({ setField }) => (
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            🏆 Gold Path
          </p>

          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            Let&apos;s get you on a call.
          </h1>

          <div className="space-y-4 text-lg text-foreground">
            <p>
              Gold-tier strategy is custom. There&apos;s no universal playbook for someone with
              significant capital. The right move depends on:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your current portfolio</li>
              <li>Your business or career velocity</li>
              <li>Your timeline</li>
              <li>Your specific calling</li>
            </ul>
            <p>
              That&apos;s why Gold goes through{" "}
              <strong className="font-semibold">
                1-on-1 coaching with me directly.
              </strong>
            </p>
          </div>

          <Card className="px-6 space-y-3">
            <h2 className="font-display text-xl text-accent">What to expect</h2>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>60-minute strategy call</li>
              <li>Custom roadmap based on your situation</li>
              <li>Ongoing relationship if it&apos;s a fit</li>
            </ul>
          </Card>

          <div className="space-y-3">
            {/* DRAFT: Alex to replace Calendly URL */}
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                const id = `placeholder-${Date.now()}`;
                setBookingClicked(true);
                setField("call_booking_id", id);
              }}
            >
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                Open Calendly to book →
              </a>
            </Button>
            {bookingClicked ? (
              <p className="text-sm text-accent font-mono uppercase tracking-[0.2em]">
                ✓ Booking link opened — click Continue once your call is on the calendar
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click the link above to open Alex&apos;s calendar, then come back here to continue.
              </p>
            )}
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
