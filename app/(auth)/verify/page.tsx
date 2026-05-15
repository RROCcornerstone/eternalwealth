import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return (
    <div className="min-h-full flex items-center justify-center px-6 py-24">
      <Card className="w-full max-w-md border-border/60 text-center">
        <CardHeader>
          <Link href="/" className="font-display text-xl font-semibold inline-block mb-6">
            Eternal Wealth
          </Link>
          <CardTitle className="font-display text-2xl">Check your email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            We sent a sign-in link to{" "}
            {email ? <strong className="text-foreground">{email}</strong> : "your email address"}.
            Open it on this device to continue.
          </p>
          <p className="text-xs text-muted-foreground">
            Didn&rsquo;t arrive? Check spam, then{" "}
            <Link href="/signup" className="underline">try again</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
