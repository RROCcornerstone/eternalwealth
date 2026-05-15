"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { ModuleInteractiveProps } from "./module-renderer";
import { dollarsToCents } from "@/lib/utils";

const COMMITMENTS = [
  "Strength training 2-3× per week",
  "Walking 30+ minutes most days",
  "Adequate sleep (7+ hours)",
  "Annual physical scheduled",
  "Therapy or counseling routine",
];

export function HealthWellnessModule({ data, onChange }: ModuleInteractiveProps) {
  const total = (data.monthly_total_cents as number) ?? null;
  const checks = (data.commitments as string[]) ?? [];

  function toggle(c: string) {
    const next = checks.includes(c) ? checks.filter((x) => x !== c) : [...checks, c];
    onChange({ ...data, commitments: next });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          Stewarding the body is part of stewarding wealth. A body that breaks costs more than a gym
          membership. Health & wellness is the smallest preventative spend you make against the
          largest preventable expense — illness.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="total">Monthly health & wellness budget</Label>
          <p className="text-xs text-muted-foreground">
            Gym, supplements, therapy, recovery, prescriptions, medical co-pays.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">$</span>
            <Input
              id="total"
              inputMode="decimal"
              value={total ? (total / 100).toLocaleString("en-US") : ""}
              onChange={(e) => onChange({ ...data, monthly_total_cents: dollarsToCents(e.target.value) })}
              placeholder="200"
            />
          </div>
        </div>

        <div>
          <Label className="font-display text-base font-medium">Commitments</Label>
          <p className="text-xs text-muted-foreground mt-1">Check what you&rsquo;re committed to.</p>
          <ul className="mt-3 space-y-2">
            {COMMITMENTS.map((c) => (
              <li key={c}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={checks.includes(c)}
                    onCheckedChange={() => toggle(c)}
                  />
                  <span className="text-sm">{c}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
