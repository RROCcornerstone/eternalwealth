"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { ModuleInteractiveProps } from "./module-renderer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const CHECKING = [
  { key: "receiving", label: "Receiving", sub: "income lands here" },
  { key: "core_bills", label: "Core Bills & Housing", sub: "rent/mortgage, utilities, insurance" },
  { key: "food", label: "Food", sub: "groceries, restaurants" },
  { key: "health", label: "Health & Wellness", sub: "gym, supplements, copays" },
  { key: "skill", label: "Skill & Business Prep", sub: "courses, books, conferences" },
  { key: "leisure", label: "Leisure & Lifestyle", sub: "travel, entertainment" },
];

const SAVINGS = [
  { key: "tithes", label: "Tithes", sub: "10% set apart first" },
  { key: "general", label: "General Savings", sub: "the buffer" },
  { key: "aggressive", label: "Aggressive Debt / Investing", sub: "Silver/Gold deployment" },
];

export function MoneyFlowModule({ data, onChange }: ModuleInteractiveProps) {
  const opened = (data.opened as Record<string, boolean>) ?? {};

  function toggle(k: string) {
    onChange({ ...data, opened: { ...opened, [k]: !opened[k] } });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          Mixed money lies to you. Separated money cannot. Six checking accounts — each with its own
          debit card. Three savings accounts — no card, for holding.
        </p>
        <p>
          It takes one Saturday morning to open them. After that, it&rsquo;s the easiest thing in
          the world.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60 space-y-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground mb-3">
            Six checking · with debit cards
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {CHECKING.map((c) => (
              <label
                key={c.key}
                className="flex items-start gap-3 p-3 border border-border/60 rounded-md cursor-pointer hover:border-accent/60 transition-colors"
              >
                <Checkbox
                  checked={Boolean(opened[c.key])}
                  onCheckedChange={() => toggle(c.key)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-sm">{c.label}</div>
                  <p className="text-xs text-muted-foreground">{c.sub}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent mb-3">
            Three savings · no card
          </p>
          <div className="grid sm:grid-cols-3 gap-2">
            {SAVINGS.map((s) => (
              <label
                key={s.key}
                className="flex items-start gap-3 p-3 border border-dashed border-accent/40 rounded-md cursor-pointer hover:border-accent transition-colors"
              >
                <Checkbox
                  checked={Boolean(opened[s.key])}
                  onCheckedChange={() => toggle(s.key)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-sm">{s.label}</div>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border/60">
          <Button variant="outline" disabled>
            <Download className="h-4 w-4 mr-2" />
            Download "Take This To Your Bank" sheet (PDF)
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            {/* DRAFT: Alex to review — PDF generator pending Phase 7 finish */}
            PDF generator coming next iteration. For now, the checklist above is the script.
          </p>
        </div>
      </div>
    </div>
  );
}
