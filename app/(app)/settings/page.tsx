import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const email = user.email ?? "";

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">Settings</p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl font-semibold">Account</h1>

      <div className="space-y-6 mt-10">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-lg">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Email: <span className="font-mono">{email}</span></p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-lg">Data export</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Download all your data as JSON or CSV. Nothing is held back.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" disabled>Download JSON (coming soon)</Button>
              <Button variant="outline" disabled>Download CSV (coming soon)</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="font-display text-lg text-destructive">Delete account</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button variant="destructive" disabled>Delete account (coming soon)</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
