"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ModuleInteractiveProps } from "./module-renderer";
import { cn } from "@/lib/utils";

const PATHS = [
  {
    key: "plan_a_investor",
    title: "The Investor",
    body: "Earn moderately, save aggressively, invest patiently. Most of the work happens in your 30s and 40s, then compounding does the rest. Stable income, predictable trajectory.",
  },
  {
    key: "plan_b_earner",
    title: "The Earner",
    body: "Skill, business, scale. Your earnings grow non-linearly. You compound your income faster than the market compounds your savings. Higher variance, higher ceiling.",
  },
  {
    key: "plan_c_hybrid",
    title: "The Hybrid",
    body: "Build earning power AND invest the surplus. Most people who reach generational wealth take this path. Slower than the pure earner, faster than the pure investor.",
  },
] as const;

export function ThreePathsModule({ data, onChange }: ModuleInteractiveProps) {
  const selected = (data.selected as string) ?? "";
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          Three paths get you to a legacy. They are different rhythms, different stresses, different
          temperaments. There is no wrong one. There is only an honest one.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60">
        <RadioGroup
          value={selected}
          onValueChange={(v) => onChange({ ...data, selected: v })}
          className="space-y-3"
        >
          {PATHS.map((p) => (
            <label
              key={p.key}
              className={cn(
                "block p-5 border rounded-lg cursor-pointer transition-colors",
                selected === p.key
                  ? "border-accent bg-accent/5"
                  : "border-border/60 hover:border-accent/60",
              )}
            >
              <div className="flex items-start gap-4">
                <RadioGroupItem value={p.key} className="mt-1" />
                <div>
                  <div className="font-display text-xl font-semibold">{p.title}</div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.body}</p>
                </div>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
