import Link from "next/link";
import { ModuleSidebar } from "@/components/shared/module-sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Middleware should already have redirected unauthed users to /login.
  // We still safe-check here so the layout doesn't crash in stub-mode dev.
  let currentSlug = "welcome";
  let completed: string[] = [];

  if (user) {
    const { data: progress } = await supabase
      .from("course_progress")
      .select("current_module_slug, completed_modules")
      .eq("user_id", user.id)
      .maybeSingle();
    if (progress) {
      currentSlug = progress.current_module_slug;
      completed = progress.completed_modules ?? [];
    }
  }

  return (
    <div className="flex min-h-full">
      <ModuleSidebar currentSlug={currentSlug} completed={completed} />
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
