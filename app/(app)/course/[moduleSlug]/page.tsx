import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MODULES_BY_SLUG, nextModule, prevModule, type ModuleDefinition } from "@/lib/content/modules";
import { ModuleRenderer } from "@/components/modules/module-renderer";

export default async function CourseModulePage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}) {
  const { moduleSlug } = await params;
  const def: ModuleDefinition | undefined = MODULES_BY_SLUG[moduleSlug];
  if (!def) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/course/${moduleSlug}`);

  const { data: response } = await supabase
    .from("module_responses")
    .select("data")
    .eq("user_id", user.id)
    .eq("module_slug", moduleSlug)
    .maybeSingle();

  const userId = user.id;
  const initialData = ((response as any)?.data as Record<string, unknown>) ?? {};
  const next = nextModule(moduleSlug);
  const prev = prevModule(moduleSlug);

  return (
    <ModuleRenderer
      def={def}
      userId={userId}
      initialData={initialData}
      nextSlug={next?.slug ?? null}
      prevSlug={prev?.slug ?? null}
    />
  );
}
