"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { ModuleInteractiveProps } from "./module-renderer";

const SCENARIOS = [
  { rate: 0.10, label: "10% — stock market historical" },
  { rate: 0.12, label: "12% — aggressive blended" },
  { rate: 0.15, label: "15% — high-skill active management" },
  { rate: 0.20, label: "20% — exceptional, not guaranteed" },
];

export function PersonalLegacyPlanModule({ data: _d, onChange: _o }: ModuleInteractiveProps) {
  return (
    <div className="space-y-8 text-center py-6">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/15 border-2 border-gold">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="font-display text-3xl font-semibold">Your Legacy Plan</h2>
        <p className="max-w-lg mx-auto text-muted-foreground">
          You have walked every module. You have named the number. You have chosen a path.
          What follows is yours to build.
        </p>
      </div>

      <div className="text-left max-w-2xl mx-auto space-y-4 mt-12">
        <p className="font-display text-lg font-medium text-center">Multi-rate projection</p>
        <p className="text-xs text-muted-foreground text-center">
          What your trajectory looks like at four assumed return rates.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          {SCENARIOS.map((s) => (
            <Card key={s.rate} className="border-border/60">
              <CardContent className="pt-6">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Annual return assumption
                </p>
                <p className="font-display text-2xl font-semibold tabular mt-1">
                  {(s.rate * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground mt-2">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center italic pt-4">
          {/* DRAFT: Alex to review — full Recharts 30-year chart pending Phase 9 finish */}
          A live 30-year projection chart appears here once your inputs from Module 25 flow through.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-border/60">
        <p className="font-display text-2xl italic">
          Livestock first. Always.<br />
          Then silver. Then gold.<br />
          In that order. Never in any other.<br />
          <span className="text-accent">And not on yourself. On the Cornerstone.</span>
        </p>
      </div>

      <p className="text-xs text-muted-foreground mt-12">Continue to your dashboard.</p>
    </div>
  );
}
