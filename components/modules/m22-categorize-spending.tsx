"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { ModuleInteractiveProps } from "./module-renderer";
import { AlertCircle } from "lucide-react";

const RECOMMENDED_PERCENTAGES = [
  { cat: "Tithes & Offerings", pct: 10, color: "var(--accent)" },
  { cat: "Core Bills", pct: 35, color: "var(--livestock)" },
  { cat: "Food", pct: 10, color: "var(--livestock)" },
  { cat: "Health & Wellness", pct: 5, color: "var(--silver)" },
  { cat: "Savings", pct: 15, color: "var(--silver)" },
  { cat: "Debt Repayment", pct: 10, color: "var(--silver)" },
  { cat: "Retirement / Investment", pct: 8, color: "var(--gold)" },
  { cat: "Leisure & Lifestyle", pct: 5, color: "var(--gold)" },
  { cat: "Skill / Business Prep", pct: 2, color: "var(--gold)" },
];

export function CategorizeSpendingModule({ data: _d, onChange: _o }: ModuleInteractiveProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          AI categorizes every transaction from your statements into one of ten buckets. You review
          each one. Low-confidence flags get human eyes. Bulk-edit when patterns repeat. Subscriptions
          surface automatically.
        </p>
        <p>The framework is only as honest as the numbers you accept.</p>
      </div>

      <Card className="border-warning/40 bg-warning/5">
        <CardContent className="pt-6 flex gap-3">
          <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
          <div className="text-sm">
            <strong className="block">The transaction review table is being built.</strong>
            <p className="text-muted-foreground mt-1">
              Awaits upload integration from Module 21. Once a statement is processed, the
              extracted + categorized rows will appear here for confirmation.
            </p>
            {/* DRAFT: Alex to review — Phase 8 categorize UI pending live AI integration */}
          </div>
        </CardContent>
      </Card>

      <div className="pt-6 border-t border-border/60">
        <p className="font-display text-lg font-medium mb-3">Recommended allocation</p>
        <p className="text-xs text-muted-foreground mb-4">
          From the Eternal Wealth framework — percentages of after-tax income.
        </p>
        <div className="space-y-2">
          {RECOMMENDED_PERCENTAGES.map((r) => (
            <div key={r.cat} className="flex items-center gap-3 text-sm">
              <span className="flex-1">{r.cat}</span>
              <div className="flex-[3] h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full" style={{ width: `${r.pct * 2}%`, background: r.color }} />
              </div>
              <span className="font-mono text-xs tabular w-12 text-right">{r.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
