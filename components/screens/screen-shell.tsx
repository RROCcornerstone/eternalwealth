"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { nextScreen, prevScreen, screenProgressPercent, type Brand, type ScreenDef } from "@/lib/content/acts";

export interface ScreenShellProps {
  screen: ScreenDef;
  userId: string;
  brand?: Brand | null;
  initialData?: Record<string, unknown>;
  children: (helpers: {
    data: Record<string, unknown>;
    setData: (next: Record<string, unknown>) => void;
    setField: <T = unknown>(key: string, value: T) => void;
  }) => ReactNode;
  /** When false, "Continue" is disabled. */
  canContinue?: boolean;
  /** Custom CTA label. Defaults to "Continue". */
  continueLabel?: string;
  /** Hide Back button (default false except on 1.1). */
  hideBack?: boolean;
  /** Async hook fired after the screen response is saved. Use for engine math, side effects. */
  onAdvance?: (data: Record<string, unknown>) => Promise<void> | void;
  /** Skip default save (e.g. animation-only screens). */
  skipSave?: boolean;
}

export function ScreenShell({
  screen,
  userId,
  brand,
  initialData = {},
  children,
  canContinue = true,
  continueLabel = "Continue",
  hideBack = false,
  onAdvance,
  skipSave = false,
}: ScreenShellProps) {
  const router = useRouter();
  const [data, setData] = useState<Record<string, unknown>>(initialData);
  const [submitting, setSubmitting] = useState(false);

  function setField<T = unknown>(key: string, value: T) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function advance() {
    setSubmitting(true);
    try {
      if (!skipSave) {
        const supabase = createClient();
        const { error } = await supabase.from("module_responses").upsert(
          { user_id: userId, module_slug: screen.id, data },
          { onConflict: "user_id,module_slug" },
        );
        if (error) throw error;

        // mark screen complete
        const { data: progress } = await supabase
          .from("course_progress")
          .select("completed_screens")
          .eq("user_id", userId)
          .maybeSingle();
        const completed = new Set<string>(((progress as any)?.completed_screens as string[]) ?? []);
        completed.add(screen.id);

        const next = nextScreen(screen.id, brand ?? null);
        await supabase.from("course_progress").upsert(
          {
            user_id: userId,
            current_act: next?.act ?? screen.act,
            current_screen: next?.id ?? screen.id,
            completed_screens: Array.from(completed),
            last_active_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );
      }

      if (onAdvance) await onAdvance(data);

      const next = nextScreen(screen.id, brand ?? null);
      if (next) {
        router.push(`/act/${next.slug}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Couldn't save";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const prev = prevScreen(screen.id);
  const percent = screenProgressPercent(screen.id, brand);

  return (
    <article className="mx-auto max-w-2xl px-6 py-12 min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono mb-2">
          <span>Act {screen.act} · {screen.id}</span>
          <span>{percent}%</span>
        </div>
        <Progress value={percent} className="h-1" />
      </div>

      {/* Content */}
      <div className="flex-1">
        {children({ data, setData, setField })}
      </div>

      {/* Nav footer */}
      <nav className="mt-10 flex items-center justify-between gap-3">
        {hideBack || !prev ? (
          <span />
        ) : (
          <Button asChild variant="ghost">
            <Link href={`/act/${prev.slug}`}>← Back</Link>
          </Button>
        )}
        <Button
          onClick={advance}
          disabled={!canContinue || submitting}
          size="lg"
          className="px-10"
        >
          {submitting ? "Saving…" : continueLabel}
        </Button>
      </nav>
    </article>
  );
}
