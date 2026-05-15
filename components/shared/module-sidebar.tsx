"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SCREENS, ACT_TITLES, type ActId, type Brand } from "@/lib/content/acts";
import { Check, ChevronRight, Lock } from "lucide-react";

const ACTS: ActId[] = [1, 2, 3, 4, 5];

export function ModuleSidebar({
  currentScreenId,
  completedScreens,
  brand,
  actUnlocked,
}: {
  currentScreenId: string;
  completedScreens: string[];
  brand: Brand | null;
  actUnlocked: { 1: boolean; 2: boolean; 3: boolean; 4: boolean; 5: boolean };
}) {
  const [open, setOpen] = useState(true);
  const completedSet = new Set(completedScreens);

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
        aria-label={open ? "Collapse" : "Expand"}
      >
        <ChevronRight className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <nav className="px-3 pb-6 overflow-y-auto flex-1">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-2 px-2">
            Eternal Wealth
          </div>
          {ACTS.map((actId) => {
            const screens = SCREENS.filter((s) => s.act === actId && (!s.pathBrand || s.pathBrand === brand));
            const isUnlocked = actUnlocked[actId];
            return (
              <div key={actId} className="mb-4">
                <div className="flex items-center justify-between px-2 mt-3 mb-1">
                  <span className="font-display text-xs uppercase tracking-wider text-accent">
                    Act {actId} · {ACT_TITLES[actId]}
                  </span>
                  {!isUnlocked && <Lock className="h-3 w-3 text-muted-foreground" />}
                </div>
                <ul className="space-y-0.5">
                  {screens.map((s) => {
                    const done = completedSet.has(s.id);
                    const active = currentScreenId === s.id;
                    return (
                      <li key={s.id}>
                        <Link
                          href={isUnlocked ? `/act/${s.slug}` : "#"}
                          className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                            active
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              : isUnlocked
                                ? "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                                : "text-sidebar-foreground/40 cursor-not-allowed",
                          )}
                          onClick={(e) => {
                            if (!isUnlocked) e.preventDefault();
                          }}
                        >
                          <span className="flex-shrink-0 w-5 text-center text-[10px] font-mono">
                            {done ? <Check className="h-3.5 w-3.5 text-accent" /> : s.id}
                          </span>
                          <span className="truncate">{s.title}</span>
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
