"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      // In stub mode (no real Supabase), still progress to verify so the flow is visible
      if (message.toLowerCase().includes("fetch") || message.toLowerCase().includes("network")) {
        toast.warning("Supabase not configured yet — see ACTION_REQUIRED.md");
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center px-6 py-24">
      <Card className="w-full max-w-md border-border/60">
        <CardHeader className="text-center">
          <Link href="/" className="font-display text-xl font-semibold inline-block mb-6">
            Eternal Wealth
          </Link>
          <CardTitle className="font-display text-2xl">Begin the framework</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            We&rsquo;ll send you a one-time sign-in link. No password.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={submitting}
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Sending link…" : "Send sign-in link"}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              By continuing you accept our{" "}
              <Link href="/terms" className="underline">Terms</Link> &amp;{" "}
              <Link href="/privacy" className="underline">Privacy Policy</Link>.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
