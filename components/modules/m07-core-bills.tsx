"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ModuleInteractiveProps } from "./module-renderer";
import { dollarsToCents, formatCurrency } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

interface LineItem {
  label: string;
  amount_cents: number;
}

const DEFAULTS: LineItem[] = [
  { label: "Rent / Mortgage", amount_cents: 0 },
  { label: "Utilities (electric, gas, water)", amount_cents: 0 },
  { label: "Internet / Phone", amount_cents: 0 },
  { label: "Auto loan / lease", amount_cents: 0 },
  { label: "Auto insurance", amount_cents: 0 },
  { label: "Auto fuel + maintenance", amount_cents: 0 },
  { label: "Health insurance premium", amount_cents: 0 },
];

export function CoreBillsModule({ data, onChange }: ModuleInteractiveProps) {
  const items: LineItem[] = (data.items as LineItem[]) ?? DEFAULTS;
  const total = items.reduce((s, i) => s + (i.amount_cents || 0), 0);

  function update(idx: number, partial: Partial<LineItem>) {
    const next = items.map((it, i) => (i === idx ? { ...it, ...partial } : it));
    onChange({ ...data, items: next, monthly_total_cents: next.reduce((s, i) => s + (i.amount_cents || 0), 0) });
  }

  function add() {
    const next = [...items, { label: "", amount_cents: 0 }];
    onChange({ ...data, items: next, monthly_total_cents: total });
  }

  function remove(idx: number) {
    const next = items.filter((_, i) => i !== idx);
    onChange({ ...data, items: next, monthly_total_cents: next.reduce((s, i) => s + (i.amount_cents || 0), 0) });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          Core bills are the non-negotiables. The things that, if you stopped paying them this month,
          your life materially breaks: housing, lights, transportation to work, the insurance
          required to drive.
        </p>
        <p>
          List every one. Get the actual number — pull a statement, don&rsquo;t guess. This number
          is the floor of your survival. Everything above it is movable.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60 space-y-4">
        <Label className="font-display text-lg font-medium">Monthly core bills</Label>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-[1fr_140px_40px] gap-2 items-center">
              <Input
                value={it.label}
                onChange={(e) => update(i, { label: e.target.value })}
                placeholder="Bill name"
              />
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground text-sm">$</span>
                <Input
                  inputMode="decimal"
                  value={it.amount_cents ? (it.amount_cents / 100).toLocaleString("en-US") : ""}
                  onChange={(e) => update(i, { amount_cents: dollarsToCents(e.target.value) })}
                  placeholder="0"
                  className="text-right tabular"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(i)}
                aria-label="Remove"
                className="h-9 w-9"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={add}>
          <Plus className="h-4 w-4 mr-1" /> Add line
        </Button>

        <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
          <span className="font-display text-lg font-medium">Monthly total</span>
          <span className="font-display text-2xl font-semibold tabular">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
