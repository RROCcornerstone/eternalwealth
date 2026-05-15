"use client";

import { Check } from "lucide-react";
import type { ModuleInteractiveProps } from "./module-renderer";

const ACHIEVEMENTS = [
  "Receiving Account opened — income lands cleanly.",
  "Tithes set apart — first of all increase.",
  "Core bills counted — the floor is named.",
  "Food counted — the variable known.",
  "Health & wellness budgeted — body stewarded.",
  "Savings rate set — 10–20% of income.",
  "Debt minimums known — no falling behind.",
];

export function LivestockCompleteModule({ data: _d, onChange: _o }: ModuleInteractiveProps) {
  return (
    <div className="space-y-8 text-center py-6">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border-2 border-accent">
          <Check className="h-8 w-8 text-accent" />
        </div>
        <h2 className="font-display text-3xl font-semibold">Livestock is laid.</h2>
        <p className="max-w-lg mx-auto text-muted-foreground">
          The foundation is poured. From here, every layer rests on this one. It doesn&rsquo;t feel
          glamorous. It isn&rsquo;t supposed to. It feels like Tuesday.
        </p>
        <p className="max-w-lg mx-auto text-muted-foreground italic">
          You cannot multiply chaos. You can multiply order.
        </p>
      </div>

      <div className="mt-12 text-left max-w-lg mx-auto space-y-3">
        <p className="font-display text-lg font-medium text-center">What you&rsquo;ve done</p>
        {ACHIEVEMENTS.map((a) => (
          <div key={a} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <span className="text-sm">{a}</span>
          </div>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        Continue to Silver — the layer of motion.
      </p>
    </div>
  );
}
