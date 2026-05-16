import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SCREENS_BY_ID, ACT_TITLES, type ActId, type Brand } from "@/lib/content/acts";
import { BRAND_GLYPH, BRAND_LABEL, BRAND_SUBTITLE } from "@/lib/math/brand-engine";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [progressRes, profileRes, legacyRes, cashflowRes] = await Promise.all([
    supabase.from("course_progress").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("user_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("legacy_plans").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("cash_flow_snapshots").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  const progress: any = progressRes.data ?? {};
  const profile: any = profileRes.data ?? {};
  const legacy: any = legacyRes.data ?? null;
  const cashflow: any = cashflowRes.data ?? null;

  const firstName: string = profile.first_name ?? "friend";
  const currentScreenId: string = progress.current_screen ?? "1.1";
  const currentScreen = SCREENS_BY_ID[currentScreenId];
  const brand: Brand | null = progress.actual_brand ?? null;

  const completedScreens: string[] = Array.isArray(progress.completed_screens) ? progress.completed_screens : [];
  const totalScreens = brand ? 39 + (brand === "cattle" ? 6 : brand === "silver" ? 6 : 3) : 51;
  const screensCompleted = completedScreens.length;
  const journeyPercent = Math.min(100, Math.round((screensCompleted / totalScreens) * 100));

  const allActsDone = Boolean(progress.act5_complete);

  // Compute next action by brand + completion state
  let nextActionLabel = "Resume the framework";
  let nextActionHref = `/act/${currentScreen?.slug ?? "1-1"}`;
  if (allActsDone) {
    nextActionLabel = "Re-upload statements to check progress";
    nextActionHref = "/act/3-1";
  } else if (!progress.act1_complete) {
    nextActionLabel = "Begin Act I — God's Framework";
    nextActionHref = "/act/1-1";
  } else if (!progress.act2_complete) {
    nextActionLabel = "Continue Act II — Set Your Legacy";
    nextActionHref = "/act/2-1";
  } else if (!progress.act3_complete) {
    nextActionLabel = "Continue Act III — Upload Statements";
    nextActionHref = "/act/3-1";
  } else if (!progress.act4_complete) {
    nextActionLabel = "Reveal your brand";
    nextActionHref = "/act/4-1";
  } else if (!progress.act5_complete) {
    const path = brand === "cattle" ? "5c-1" : brand === "silver" ? "5s-1" : "5g-1";
    nextActionLabel = `Walk the ${BRAND_LABEL[brand ?? "cattle"]} path`;
    nextActionHref = `/act/${path}`;
  }

  const ACT_INFO: { id: ActId; status: string; href: string }[] = [
    { id: 1, status: progress.act1_complete ? "complete" : currentScreen?.act === 1 ? "in_progress" : "locked", href: "/act/1-1" },
    { id: 2, status: progress.act2_complete ? "complete" : currentScreen?.act === 2 ? "in_progress" : progress.act1_complete ? "unlocked" : "locked", href: "/act/2-1" },
    { id: 3, status: progress.act3_complete ? "complete" : currentScreen?.act === 3 ? "in_progress" : progress.act2_complete ? "unlocked" : "locked", href: "/act/3-1" },
    { id: 4, status: progress.act4_complete ? "complete" : currentScreen?.act === 4 ? "in_progress" : progress.act3_complete ? "unlocked" : "locked", href: "/act/4-1" },
    { id: 5, status: progress.act5_complete ? "complete" : currentScreen?.act === 5 ? "in_progress" : progress.act4_complete ? "unlocked" : "locked", href: brand === "silver" ? "/act/5s-1" : brand === "gold" ? "/act/5g-1" : "/act/5c-1" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">Your Dashboard</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl font-semibold leading-tight">
          Welcome back, {firstName}.
        </h1>
        {brand ? (
          <p className="mt-3 text-muted-foreground flex items-center gap-2">
            You're in <Badge variant="secondary" className="text-lg gap-1 px-3 py-1">{BRAND_GLYPH[brand]} {BRAND_LABEL[brand]}</Badge>
            <span className="text-sm">— {BRAND_SUBTITLE[brand]}</span>
          </p>
        ) : (
          <p className="mt-3 text-muted-foreground">Walk through the framework to see where you stand.</p>
        )}
      </header>

      {/* Top action */}
      <Card className="border-accent/40 bg-accent/5 mb-8">
        <CardContent className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Next Action</p>
            <p className="font-display text-xl font-semibold mt-1">{nextActionLabel}</p>
          </div>
          <Button asChild size="lg">
            <Link href={nextActionHref}>{allActsDone ? "Re-run →" : "Continue →"}</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Top stat cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {/* Progress */}
        <Card className="border-border/60">
          <CardHeader><CardTitle className="font-display text-base">Journey</CardTitle></CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-semibold tabular">
              {screensCompleted}
              <span className="text-muted-foreground text-lg"> / {totalScreens}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">screens complete</p>
            <Progress value={journeyPercent} className="mt-3 h-1" />
          </CardContent>
        </Card>

        {/* Legacy number */}
        <Card className="border-border/60">
          <CardHeader><CardTitle className="font-display text-base">Legacy Target</CardTitle></CardHeader>
          <CardContent>
            {legacy?.ls_total_today_cents ? (
              <>
                <p className="font-display text-3xl font-semibold tabular">{formatCurrency(legacy.ls_total_today_cents)}</p>
                <p className="text-xs text-muted-foreground mt-1">in today's dollars</p>
                {legacy.pmt_monthly_cents ? (
                  <p className="text-xs text-muted-foreground mt-2 tabular">
                    {formatCurrency(legacy.pmt_monthly_cents)} <span className="opacity-60">/ month</span>
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-muted-foreground italic">Complete Act II to see your number.</p>
            )}
          </CardContent>
        </Card>

        {/* Brand math */}
        <Card className="border-border/60">
          <CardHeader><CardTitle className="font-display text-base">Savings Rate</CardTitle></CardHeader>
          <CardContent>
            {cashflow?.savings_rate != null ? (
              <>
                <p className="font-display text-3xl font-semibold tabular">{Math.round(Number(cashflow.savings_rate) * 100)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Target for Gold: 25%
                </p>
                {cashflow.monthly_gap_cents ? (
                  <p className="text-xs text-muted-foreground mt-2 tabular">
                    {formatCurrency(cashflow.monthly_gap_cents)} <span className="opacity-60">/ month gap</span>
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-muted-foreground italic">Upload statements in Act III to compute.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Acts overview */}
      <div className="mb-8">
        <h2 className="font-display text-xl font-semibold mb-4">The Five Acts</h2>
        <div className="space-y-2">
          {ACT_INFO.map(({ id, status, href }) => {
            const label = ACT_TITLES[id];
            const isComplete = status === "complete";
            const isInProgress = status === "in_progress";
            const isLocked = status === "locked";
            return (
              <Link key={id} href={isLocked ? "#" : href}>
                <Card
                  className={
                    isLocked
                      ? "border-border/30 opacity-50 cursor-not-allowed"
                      : isComplete
                        ? "border-success/40 bg-success/5 hover:border-success/60 transition-colors"
                        : isInProgress
                          ? "border-accent/60 bg-accent/5 hover:border-accent transition-colors"
                          : "border-border/60 hover:border-accent/40 transition-colors"
                  }
                >
                  <CardContent className="pt-5 pb-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-display text-2xl font-semibold w-10 text-center">{id}</span>
                      <div>
                        <p className="font-display font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground capitalize">{status.replace("_", " ")}</p>
                      </div>
                    </div>
                    <span className="text-sm">
                      {isComplete && "✓"}
                      {isInProgress && "→"}
                      {isLocked && "🔒"}
                      {status === "unlocked" && "→"}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Brand-specific quick links */}
      {brand && (
        <div className="mb-8">
          <h2 className="font-display text-xl font-semibold mb-4">{BRAND_GLYPH[brand]} {BRAND_LABEL[brand]} Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {brand === "cattle" && (
              <>
                <DashCard href="/act/5c-3" title="Your Career Direction" body="Re-read your purpose worksheet." />
                <DashCard href="/act/5c-5" title="Daily Action Plan" body="The plan to break out of Cattle." />
              </>
            )}
            {brand === "silver" && (
              <>
                <DashCard href="/act/5s-6" title="Investment Blueprint" body="Your BTC / ETH / retirement allocation." />
                <DashCard href="/act/5s-2" title="Gap Strategy" body="See your current income vs expenses." />
              </>
            )}
            {brand === "gold" && (
              <>
                <DashCard href="/act/5g-2" title="Book Your Call" body="1-on-1 strategy with Alex." />
                <DashCard href="/act/5g-3" title="Booking Confirmation" body="Your upcoming session details." />
              </>
            )}
            <DashCard href="/act/2-10" title="Revisit Your Number" body="The legacy target. The lump sum." />
            <DashCard href="/act/4-4" title="The Math" body="Why you're in this brand." />
          </div>
        </div>
      )}

      <footer className="text-center mt-16 pt-8 border-t border-border/40">
        <p className="text-xs text-muted-foreground">
          Eternal Wealth is educational only. Not financial, legal, tax, or investment advice.{" "}
          <Link href="/disclaimer" className="underline">Full disclaimer</Link>.
        </p>
      </footer>
    </div>
  );
}

function DashCard({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link href={href} className="block">
      <Card className="border-border/60 hover:border-accent/60 transition-colors h-full">
        <CardHeader><CardTitle className="font-display text-base">{title}</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{body}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
