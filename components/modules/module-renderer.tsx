"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { ModuleDefinition } from "@/lib/content/modules";
import { ModuleScripture } from "@/components/modules/module-scripture";

// Module interactive components, registered by slug:
import { WelcomeModule } from "@/components/modules/m01-welcome";
import { PauseModule } from "@/components/modules/m02-pause";
import { FinancialOrderModule } from "@/components/modules/m03-financial-order";
import { OverviewModule } from "@/components/modules/m04-overview";
import { ReceivingAccountModule } from "@/components/modules/m05-receiving-account";
import { TithesModule } from "@/components/modules/m06-tithes";
import { CoreBillsModule } from "@/components/modules/m07-core-bills";
import { FoodModule } from "@/components/modules/m08-food";
import { HealthWellnessModule } from "@/components/modules/m09-health-wellness";
import { SavingsModule } from "@/components/modules/m10-savings";
import { MinimumDebtModule } from "@/components/modules/m11-minimum-debt";
import { LivestockCompleteModule } from "@/components/modules/m12-livestock-complete";
import { PlaceholderModule } from "@/components/modules/placeholder";

type ModuleData = Record<string, unknown>;

const REGISTRY: Record<string, React.ComponentType<ModuleInteractiveProps>> = {
  welcome: WelcomeModule,
  pause: PauseModule,
  "financial-order": FinancialOrderModule,
  overview: OverviewModule,
  "receiving-account": ReceivingAccountModule,
  tithes: TithesModule,
  "core-bills": CoreBillsModule,
  food: FoodModule,
  "health-wellness": HealthWellnessModule,
  savings: SavingsModule,
  "minimum-debt": MinimumDebtModule,
  "livestock-complete": LivestockCompleteModule,
};

export interface ModuleInteractiveProps {
  data: ModuleData;
  onChange: (data: ModuleData) => void;
}

export function ModuleRenderer({
  def,
  userId,
  initialData,
  nextSlug,
  prevSlug,
}: {
  def: ModuleDefinition;
  userId: string;
  initialData: ModuleData;
  nextSlug: string | null;
  prevSlug: string | null;
}) {
  const router = useRouter();
  const [data, setData] = useState<ModuleData>(initialData);
  const [saving, setSaving] = useState(false);

  const Interactive = REGISTRY[def.slug] ?? PlaceholderModule;

  async function save(advance: boolean) {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("module_responses").upsert(
        {
          user_id: userId,
          module_slug: def.slug,
          data,
        },
        { onConflict: "user_id,module_slug" },
      );
      if (error) throw error;

      // Mark module complete, advance current_module_slug
      const { data: progress } = await supabase
        .from("course_progress")
        .select("completed_modules")
        .eq("user_id", userId)
        .maybeSingle();

      const completed = new Set<string>((progress?.completed_modules as string[]) ?? []);
      completed.add(def.slug);

      await supabase.from("course_progress").upsert(
        {
          user_id: userId,
          current_module_slug: advance && nextSlug ? nextSlug : def.slug,
          completed_modules: Array.from(completed),
          last_active_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (advance && nextSlug) {
        router.push(`/course/${nextSlug}`);
      } else {
        toast.success("Saved.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Couldn't save";
      if (msg.toLowerCase().includes("fetch") || msg.toLowerCase().includes("network")) {
        // Stub-mode: save to localStorage so the flow is testable
        if (typeof window !== "undefined") {
          window.localStorage.setItem(`ew_module_${def.slug}`, JSON.stringify(data));
        }
        toast.warning("Saved locally (Supabase not configured)");
        if (advance && nextSlug) router.push(`/course/${nextSlug}`);
      } else {
        toast.error(msg);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10">
        <div className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
          Module {String(def.number).padStart(2, "0")} · {def.stage}
        </div>
        <h1 className="mt-3 font-display text-3xl md:text-4xl font-semibold leading-tight">
          {def.title}
        </h1>
        <p className="mt-3 text-muted-foreground text-lg">{def.oneLiner}</p>
      </header>

      {def.scripture && <ModuleScripture scripture={def.scripture} />}

      <Card className="border-border/60 mt-8">
        <CardContent className="pt-8 pb-6">
          <Interactive data={data} onChange={setData} />
        </CardContent>
      </Card>

      <nav className="mt-10 flex items-center justify-between gap-3">
        <Button asChild variant="ghost" disabled={!prevSlug}>
          {prevSlug ? <Link href={`/course/${prevSlug}`}>← Previous</Link> : <span>← Previous</span>}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => save(false)} disabled={saving}>
            {saving ? "Saving…" : "Save & exit"}
          </Button>
          <Button onClick={() => save(true)} disabled={saving}>
            {saving ? "Saving…" : nextSlug ? "Save & continue →" : "Save & finish"}
          </Button>
        </div>
      </nav>
    </article>
  );
}
