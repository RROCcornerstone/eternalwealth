import Link from "next/link";
import { redirect } from "next/navigation";
import { ModuleSidebar } from "@/components/shared/module-sidebar";
import { createClient } from "@/lib/supabase/server";
import type { Brand } from "@/lib/content/acts";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: progressRaw } = await supabase
    .from("course_progress")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  const progress: any = progressRaw ?? {};

  const currentScreenId: string = progress.current_screen ?? "1.1";
  const completed: string[] = Array.isArray(progress.completed_screens) ? progress.completed_screens : [];
  const brand: Brand | null = progress.actual_brand ?? null;
  const actUnlocked = {
    1: true,
    2: Boolean(progress.act1_complete),
    3: Boolean(progress.act2_complete),
    4: Boolean(progress.act3_complete),
    5: Boolean(progress.act4_complete),
  };

  return (
    <div className="flex min-h-full">
      <ModuleSidebar
        currentScreenId={currentScreenId}
        completedScreens={completed}
        brand={brand}
        actUnlocked={actUnlocked}
      />
      <div className="flex-1 flex flex-col">
        <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-10">
          <div className="px-6 py-3 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="font-display font-semibold tracking-tight"
            >
              Eternal Wealth
            </Link>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
