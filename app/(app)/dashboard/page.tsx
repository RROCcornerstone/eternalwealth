import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MODULES, MODULES_BY_SLUG, STAGE_LABELS } from "@/lib/content/modules";
import { isSupabaseConfigured } from "@/lib/preview";

export default async function DashboardPage() {
  let profile: { full_name: string | null; faith_context: string | null } | null = null;
  let progress: {
    current_module_slug: string;
    completed_modules: string[];
    livestock_complete: boolean;
    silver_complete: boolean;
    gold_complete: boolean;
  } | null = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: p } = await supabase
      .from("user_profiles")
      .select("full_name, faith_context")
      .eq("user_id", user.id)
      .maybeSingle();
    profile = p as typeof profile;

    const { data: pr } = await supabase
      .from("course_progress")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    progress = pr as typeof progress;
  }

  const completedCount = (progress?.completed_modules as string[] | undefined)?.length ?? 0;
  const totalCount = MODULES.length;
  const currentSlug = progress?.current_module_slug ?? "welcome";
  const currentModule = MODULES_BY_SLUG[currentSlug];

  const currentStage = (() => {
    if (progress?.gold_complete) return "Legacy";
    if (progress?.silver_complete) return "Gold";
    if (progress?.livestock_complete) return "Silver";
    return "Livestock";
  })();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">Dashboard</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl font-semibold">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}.
        </h1>
        <p className="mt-2 text-muted-foreground">
          You&rsquo;re in <Badge variant="secondary" className="ml-1">{currentStage}</Badge>
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-xl">Continue the course</CardTitle>
          </CardHeader>
          <CardContent>
            {currentModule ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Module {String(currentModule.number).padStart(2, "0")} · {STAGE_LABELS[currentModule.stage]}
                  </div>
                  <div className="font-display text-2xl font-semibold mt-1">{currentModule.title}</div>
                  <p className="text-sm text-muted-foreground mt-1">{currentModule.oneLiner}</p>
                </div>
                <Button asChild>
                  <Link href={`/course/${currentModule.slug}`}>Resume →</Link>
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">Begin at <Link href="/course/welcome" className="underline">Module 01</Link>.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-xl">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-semibold tabular">
              {completedCount}
              <span className="text-muted-foreground text-xl"> / {totalCount}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">modules complete</p>
            <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mt-6">
        <DashCard href="/giving-board" title="Giving Board" body="Set your daily, monthly, yearly, and 10-year giving horizons." />
        <DashCard href="/transactions" title="Transactions" body="Review and categorize spending from uploaded statements." />
        <DashCard href="/legacy" title="Legacy Plan" body="Project your 30-year inheritance and refine the numbers." />
      </div>

      <p className="mt-12 text-xs text-muted-foreground text-center">
        Eternal Wealth is educational only. Not financial, legal, tax, or investment advice. Read the{" "}
        <Link href="/disclaimer" className="underline">full disclaimer</Link>.
      </p>
    </div>
  );
}

function DashCard({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link href={href} className="block">
      <Card className="border-border/60 hover:border-accent/60 transition-colors h-full">
        <CardHeader>
          <CardTitle className="font-display text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{body}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
