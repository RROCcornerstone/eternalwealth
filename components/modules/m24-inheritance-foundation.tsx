"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ModuleInteractiveProps } from "./module-renderer";

export function InheritanceFoundationModule({ data, onChange }: ModuleInteractiveProps) {
  const reflection = (data.reflection as string) ?? "";
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          A good man leaves an inheritance to his children&rsquo;s children. Not just children
          &mdash; their children. Three generations of provision. This is the long view of stewardship,
          and it&rsquo;s the framing that turns budgeting into building.
        </p>
        <p>
          Most people optimize for retirement. The Father optimizes for generations. The math is
          different, and the discipline is different.
        </p>
        <p>
          Before we touch the numbers, sit with this:
        </p>
      </div>

      <div className="pt-6 border-t border-border/60">
        <Label className="font-display text-lg font-medium">
          When you think about your grandchildren&rsquo;s lives — even ones not yet born — what do
          you hope to have built for them?
        </Label>
        <p className="text-xs text-muted-foreground mt-1">
          Not just money. Faith, work ethic, character, opportunity. Write a few sentences.
        </p>
        <Textarea
          value={reflection}
          onChange={(e) => onChange({ ...data, reflection: e.target.value })}
          rows={6}
          className="mt-4"
          placeholder="I hope to leave them…"
          maxLength={2000}
        />
      </div>
    </div>
  );
}
