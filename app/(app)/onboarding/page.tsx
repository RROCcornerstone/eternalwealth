import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "@/components/shared/onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const userId = user.id;

  const { data: existing } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing && (existing as any).full_name) {
    redirect("/course/welcome");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent text-center">
        Onboarding
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-semibold text-center mt-2">
        Before we begin
      </h1>
      <p className="mt-3 text-center text-muted-foreground">
        Ten short questions. About a minute. Saves as you go.
      </p>
      <div className="mt-12">
        <OnboardingForm userId={userId} />
      </div>
    </div>
  );
}
