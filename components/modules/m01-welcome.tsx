"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ModuleInteractiveProps } from "./module-renderer";

export function WelcomeModule({ data, onChange }: ModuleInteractiveProps) {
  const sentence = (data.money_relationship_sentence as string) ?? "";
  return (
    <div className="space-y-8">
      <div className="prose-content">
        <p>
          This is the Eternal Wealth Framework. It is faith-rooted, biblically ordered, and built
          for one purpose: to put your finances in the order the Father set in Genesis 13:2 —
          livestock first, silver after, gold last. In that order. Never in any other.
        </p>
        <p>
          You will not skim it. You will walk it. Every module asks something of you — a number,
          a decision, a sentence written in your own hand. The work is the point.
        </p>
        <p>
          Before the lessons begin, one short reflection.
        </p>
      </div>

      <div className="space-y-2 pt-4 border-t border-border/60">
        <Label className="font-display text-lg font-medium">
          In one sentence, what&rsquo;s your relationship with money right now?
        </Label>
        <p className="text-xs text-muted-foreground">
          Be honest. No one else sees this. The Father already knows.
        </p>
        <Textarea
          value={sentence}
          onChange={(e) => onChange({ ...data, money_relationship_sentence: e.target.value })}
          rows={3}
          placeholder="I feel…"
          maxLength={500}
        />
      </div>
    </div>
  );
}
