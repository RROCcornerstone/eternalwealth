export const metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <article>
      <h1 className="font-display text-4xl font-semibold">Cookie Policy</h1>
      <p className="text-sm text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-6 p-4 border border-accent/40 bg-accent/5 rounded-md text-sm">
        <strong>Plain-language summary:</strong> We use essential cookies (so you stay signed in)
        and optional analytics cookies (only if you consent). No third-party advertising cookies.
        Ever.
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold">Essential</h2>
      <p>
        Set by Supabase to keep you signed in across page loads. Cannot be disabled without breaking
        the service.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">Analytics (opt-in)</h2>
      <p>
        Set by PostHog when you consent via the cookie banner. Used to understand which modules
        are clearer, which interactions cause friction. Anonymized.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">No advertising cookies</h2>
      <p>We do not run ads. We do not set advertising or remarketing cookies.</p>
    </article>
  );
}
