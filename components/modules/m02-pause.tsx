"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ModuleInteractiveProps } from "./module-renderer";

export function PauseModule({ data, onChange }: ModuleInteractiveProps) {
  const committed = (data.committed_to_finish as boolean) ?? false;
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          Before you set a single number, hear this: <em>don&rsquo;t build yet.</em>
        </p>
        <p>
          Most men start at gold. They quit the job before three months are saved. They buy the
          rental before the credit card is paid. They invest in something they don&rsquo;t understand
          because they want to skip the work. And they fail. Not because gold is bad. They fail
          because they skipped livestock.
        </p>
        <p>
          For now, just learn. Read what each module says. Don&rsquo;t open accounts yet. Don&rsquo;t
          change anything. Walk the framework end-to-end first. Then you build.
        </p>
        <p className="text-muted-foreground italic">
          You cannot multiply chaos. The order is divine.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60">
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={committed}
            onCheckedChange={(c) => onChange({ ...data, committed_to_finish: c === true })}
            className="mt-0.5"
          />
          <span className="text-sm">
            I commit to walking the entire framework before I build. Twenty-eight modules. In order.
          </span>
        </label>
      </div>
    </div>
  );
}
