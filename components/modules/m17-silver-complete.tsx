"use client";

import { Check } from "lucide-react";
import type { ModuleInteractiveProps } from "./module-renderer";

const ACHIEVEMENTS = [
  "Debt-payoff strategy chosen — snowball or avalanche.",
  "Retirement contributions scheduled.",
  "Skill / business prep budget set — the highest-leverage line.",
  "Leisure & lifestyle line drawn on yourself.",
];

export function SilverCompleteModule({ data: _d, onChange: _o }: ModuleInteractiveProps) {
  return (
    <div className="space-y-8 text-center py-6">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-silver/15 border-2 border-silver">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="font-display text-3xl font-semibold">Silver is moving.</h2>
        <p className="max-w-lg mx-auto text-muted-foreground">
          The household isn&rsquo;t just stable now &mdash; it&rsquo;s moving. Debt is shrinking. Investments
          are growing. The skill you&rsquo;re building today shows up as silver six months from now and
          gold in three years.
        </p>
      </div>

      <div className="mt-10 text-left max-w-lg mx-auto space-y-3">
        {ACHIEVEMENTS.map((a) => (
          <div key={a} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <span className="text-sm">{a}</span>
          </div>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted-foreground">Continue to Gold — the layer of multiplication.</p>
    </div>
  );
}
