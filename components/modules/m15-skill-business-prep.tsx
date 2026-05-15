"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ModuleInteractiveProps } from "./module-renderer";
import { dollarsToCents } from "@/lib/utils";

export function SkillBusinessPrepModule({ data, onChange }: ModuleInteractiveProps) {
  const monthly = (data.monthly_cents as number) ?? null;
  const reflection = (data.twelve_month_reflection as string) ?? "";
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          Skill and business preparation is the highest-leverage line in the budget. A $300 course
          that adds $30,000 to your annual earning capacity is a 100x return. Stop being cheap with
          this category.
        </p>
        <p>
          Courses, books, conferences, side-project software. The seeds of the silver and gold
          you&rsquo;ll harvest later.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="m">Monthly budget for skill / business preparation</Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">$</span>
            <Input
              id="m"
              inputMode="decimal"
              value={monthly ? (monthly / 100).toLocaleString("en-US") : ""}
              onChange={(e) => onChange({ ...data, monthly_cents: dollarsToCents(e.target.value) })}
              placeholder="200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="r">12-month reflection</Label>
          <p className="text-xs text-muted-foreground">
            What capability would change your trajectory if you had it 12 months from now? Be specific.
          </p>
          <Textarea
            id="r"
            value={reflection}
            onChange={(e) => onChange({ ...data, twelve_month_reflection: e.target.value })}
            rows={5}
          />
        </div>
      </div>
    </div>
  );
}
