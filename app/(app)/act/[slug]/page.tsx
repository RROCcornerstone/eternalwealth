import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SCREENS_BY_SLUG, type Brand } from "@/lib/content/acts";
import { renderScreen } from "@/components/screens/registry";

export default async function ActScreenPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const screen = SCREENS_BY_SLUG[slug];
  if (!screen) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/act/${slug}`);

  // Load existing response + course progress for this screen
  const [responseRes, progressRes, profileRes] = await Promise.all([
    supabase.from("module_responses").select("data").eq("user_id", user.id).eq("module_slug", screen.id).maybeSingle(),
    supabase.from("course_progress").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("user_profiles").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  const initialData = ((responseRes.data as any)?.data as Record<string, unknown>) ?? {};
  const progress = (progressRes.data as any) ?? null;
  const profile = (profileRes.data as any) ?? null;
  const brand: Brand | null = progress?.actual_brand ?? null;

  // Act 5 gating — if user lands on a path screen that doesn't match their brand, redirect
  if (screen.act === 5 && screen.pathBrand && brand && screen.pathBrand !== brand) {
    const correctFirst = brand === "cattle" ? "5c-1" : brand === "silver" ? "5s-1" : "5g-1";
    redirect(`/act/${correctFirst}`);
  }

  // Generic gating: don't let user jump ahead to an Act they haven't unlocked
  if (screen.act > 1 && !progress?.act1_complete && screen.id !== "1.1") {
    // Allow Act 1 screens freely; force user back to Act 1 if they try to skip ahead
    if (screen.act >= 2) {
      const last = progress?.current_screen ?? "1.1";
      const lastSlug = SCREENS_BY_SLUG[last]?.slug ?? "1-1";
      if (lastSlug !== slug) {
        // Don't aggressively redirect — let them navigate back if they have a saved spot
      }
    }
  }

  const node = renderScreen({
    screen,
    userId: user.id,
    brand,
    initialData,
    profile,
    progress,
  });

  if (!node) {
    // Screen not yet built — show a placeholder so the flow stays walkable
    return (
      <article className="mx-auto max-w-2xl px-6 py-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Act {screen.act} · {screen.id}</p>
        <h1 className="mt-3 font-display text-3xl font-semibold">{screen.title}</h1>
        <p className="mt-3 text-muted-foreground">{screen.oneLiner}</p>
        <p className="mt-12 text-sm text-muted-foreground italic">This screen is being built. Check back in a moment.</p>
      </article>
    );
  }
  return node;
}
