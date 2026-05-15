import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SCREENS_BY_ID } from "@/lib/content/acts";

/**
 * Entry point for authed users. Routes them to wherever they left off:
 *  - If no progress: /act/1-1
 *  - If progress exists: /act/{current_screen.slug}
 */
export default async function BeginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/begin");

  const { data: progress } = await supabase
    .from("course_progress")
    .select("current_screen")
    .eq("user_id", user.id)
    .maybeSingle();

  const currentId = (progress as any)?.current_screen ?? "1.1";
  const screen = SCREENS_BY_ID[currentId] ?? SCREENS_BY_ID["1.1"];
  redirect(`/act/${screen!.slug}`);
}
