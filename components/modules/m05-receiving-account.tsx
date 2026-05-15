"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import type { ModuleInteractiveProps } from "./module-renderer";

const CHECKLIST = [
  "Open a second checking account at your current bank",
  'Name it "Receiving" (or similar)',
  "Decline the debit card and any auto-pay setup",
  "Point your direct deposit to this new account",
  "Set a weekly transfer day — Sunday or Monday is common",
  "Tithes transfer first, every time. Always.",
];

export function ReceivingAccountModule({ data, onChange }: ModuleInteractiveProps) {
  const bank = (data.bank_name as string) ?? "";
  const nickname = (data.account_nickname as string) ?? "";
  const isSetUp = (data.is_set_up as boolean) ?? false;
  const notes = (data.notes as string) ?? "";
  const checks = (data.checklist as boolean[]) ?? new Array(CHECKLIST.length).fill(false);

  function setCheck(i: number, v: boolean) {
    const next = [...checks];
    next[i] = v;
    onChange({ ...data, checklist: next });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          Income and obligation should not live in the same room. The moment they do, you start
          spending what you do not have.
        </p>
        <p>
          The Receiving Account is small. It is the first move. Every dollar you earn lands there.
          Nothing pulls from it automatically. No subscription. No bill. No card. It is a holding
          tank — a clean place where money rests for an hour or a day before you move it on purpose.
        </p>
        <p className="text-muted-foreground italic">
          Income lands. Tithes leave first. Then bills. Then everything else. Manual transfer. Every
          time.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60 space-y-6">
        <div>
          <Label className="font-display text-lg font-medium">Setup checklist</Label>
          <ul className="mt-3 space-y-2">
            {CHECKLIST.map((c, i) => (
              <li key={c}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={checks[i]}
                    onCheckedChange={(v) => setCheck(i, v === true)}
                    className="mt-0.5"
                  />
                  <span className="text-sm">{c}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bank">Bank name (optional)</Label>
            <Input
              id="bank"
              value={bank}
              onChange={(e) => onChange({ ...data, bank_name: e.target.value })}
              placeholder="e.g., Chase"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nickname">Account nickname (optional)</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => onChange({ ...data, account_nickname: e.target.value })}
              placeholder="Receiving"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={isSetUp}
            onCheckedChange={(v) => onChange({ ...data, is_set_up: v === true })}
          />
          <span className="text-sm">The Receiving Account is set up and direct deposit points to it.</span>
        </label>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => onChange({ ...data, notes: e.target.value })}
            rows={3}
            placeholder="Anything you want to remember about this account…"
          />
        </div>
      </div>
    </div>
  );
}
