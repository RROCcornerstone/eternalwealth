"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";

const ROWS: { time: string; activity: string }[] = [
  { time: "Morning (1 hour)", activity: "Job applications (4–5 apps minimum)" },
  { time: "Midday (30 min)", activity: "Skill building in your career direction" },
  { time: "Evening (30 min)", activity: "Follow up on previous applications" },
  { time: "Weekly", activity: "Reflect, adjust strategy, repeat" },
];

export function Screen5C5({ userId, brand, initialData }: RenderContext) {
  return (
    <ScreenShell
      screen={SCREENS_BY_ID["5C.5"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Continue"
    >
      {() => (
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            🐂 Cattle Path
          </p>

          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            Here&apos;s your daily action plan.
          </h1>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Time
                  </th>
                  <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Activity
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.time} className="border-b last:border-b-0">
                    <td className="px-4 py-3 font-semibold text-foreground align-top">
                      {row.time}
                    </td>
                    <td className="px-4 py-3 text-foreground">{row.activity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-lg text-foreground">
            If you do this every weekday, you&apos;ll hit 20+ applications per week. That&apos;s the
            minimum to break out of Cattle.
          </p>
        </div>
      )}
    </ScreenShell>
  );
}
