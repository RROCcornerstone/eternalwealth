"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { ModuleInteractiveProps } from "./module-renderer";

const REQUIREMENTS = [
  {
    key: "has_skill",
    title: "Skill",
    body: "You have studied a market, an instrument, or a methodology for at least 12 months. You can explain it to someone honestly without hand-waving.",
  },
  {
    key: "has_proof",
    title: "Proof",
    body: "You have a documented record — paper-trading, demo accounts, or a small live account — that shows you can execute the methodology and not lose money over a meaningful sample size.",
  },
  {
    key: "has_system",
    title: "System",
    body: "You have written rules for entry, exit, position sizing, and risk management. You do not 'feel' your way into trades.",
  },
  {
    key: "has_surplus",
    title: "Surplus",
    body: "The money you are deploying is not money you need for rent, bills, tithes, or your savings buffer. It is true surplus — money you could lose without harm to the household.",
  },
];

export function AggressiveTradingModule({ data, onChange }: ModuleInteractiveProps) {
  const allFour = REQUIREMENTS.every((r) => data[r.key] === true);
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          Aggressive trading is a Gold-stage activity. It can compound wealth dramatically. It can
          also vaporize it. Whether it builds or destroys depends entirely on four things, all of
          which must be true at the same time.
        </p>
        <p>If any one is missing, this is not your stage yet. Build it first.</p>
      </div>

      <div className="pt-6 border-t border-border/60 space-y-4">
        {REQUIREMENTS.map((r) => (
          <label
            key={r.key}
            className="flex items-start gap-4 p-4 border border-border/60 rounded-lg cursor-pointer hover:border-accent/60 transition-colors"
          >
            <Checkbox
              checked={Boolean(data[r.key])}
              onCheckedChange={(v) => onChange({ ...data, [r.key]: v === true })}
              className="mt-1"
            />
            <div>
              <div className="font-display font-semibold">{r.title}</div>
              <p className="text-sm text-muted-foreground mt-1">{r.body}</p>
            </div>
          </label>
        ))}
      </div>

      <div
        className={`p-4 rounded-lg border ${
          allFour
            ? "border-success/40 bg-success/5 text-success"
            : "border-warning/40 bg-warning/5 text-warning"
        }`}
      >
        {allFour ? (
          <p className="text-sm">
            <strong>Cleared.</strong> All four checked. You meet the readiness bar for aggressive
            trading. Deploy from surplus only.
          </p>
        ) : (
          <p className="text-sm">
            <strong>Not yet.</strong> One or more boxes are unchecked. Build those pieces first.
            Aggressive trading without all four is gambling.
          </p>
        )}
      </div>
    </div>
  );
}
