"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MODULES, STAGE_LABELS, type ModuleStage } from "@/lib/content/modules";
import { Check, ChevronRight } from "lucide-react";

const STAGES: ModuleStage[] = ["welcome", "livestock", "silver", "gold", "legacy"];

export function ModuleSidebar({
  currentSlug,
  completed,
}: {
  currentSlug: string;
  completed: string[];
}) {
  const [open, setOpen] = useState(true);
  const completedSet = new Set(completed);

  return (
    <aside
      className={cn(
        "border-r border-border/60 bg-sidebar text-sidebar-foreground transition-all hidden md:flex flex-col",
        open ? "w-72" : "w-12",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="p-3 text-xs text-muted-foreground hover:text-foreground self-end"
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        <ChevronRight className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <nav className="px-3 pb-6 overflow-y-auto flex-1">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-2 px-2">
            Course
          </div>
          {STAGES.map((stage) => {
            const items = MODULES.filter((m) => m.stage === stage);
            return (
              <div key={stage} className="mb-4">
                <div className="font-display text-xs uppercase tracking-wider text-accent px-2 mt-3 mb-1">
                  {STAGE_LABELS[stage]}
                </div>
                <ul className="space-y-0.5">
                  {items.map((m) => {
                    const done = completedSet.has(m.slug);
                    const active = currentSlug === m.slug;
                    return (
                      <li key={m.slug}>
                        <Link
                          href={`/course/${m.slug}`}
                          className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                            active
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                          )}
                        >
                          <span className="flex-shrink-0 w-5 text-center text-[10px] font-mono">
                            {done ? <Check className="h-3.5 w-3.5 text-accent" /> : String(m.number).padStart(2, "0")}
                          </span>
                          <span className="truncate">{m.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      )}
    </aside>
  );
}
