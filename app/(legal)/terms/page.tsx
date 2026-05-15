export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <article>
      <h1 className="font-display text-4xl font-semibold">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-6 p-4 border border-accent/40 bg-accent/5 rounded-md text-sm">
        <strong>Plain-language summary:</strong> Eternal Wealth is free and educational. You agree
        not to misuse it. We can change or stop the service. Nothing here is professional advice.
        Disputes are resolved by arbitration in the state where the service operates.
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold">Acceptance</h2>
      <p>
        By creating an account or using Eternal Wealth, you agree to these Terms and the{" "}
        <a href="/privacy" className="underline">Privacy Policy</a> and{" "}
        <a href="/disclaimer" className="underline">Disclaimer</a>. If you don&rsquo;t agree,
        don&rsquo;t use the service.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">Eligibility</h2>
      <p>You must be at least 18 years old to use Eternal Wealth.</p>

      <h2 className="mt-10 font-display text-2xl font-semibold">What this service is</h2>
      <p>
        Eternal Wealth is a faith-rooted, educational personal-finance framework delivered as 28
        interactive modules. It is software for thinking through your own money decisions. It is
        not professional advice.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">Acceptable use</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>One account per person.</li>
        <li>Don&rsquo;t share your magic-link sign-in URL.</li>
        <li>Don&rsquo;t attempt to scrape, reverse-engineer, or overload the service.</li>
        <li>Don&rsquo;t upload someone else&rsquo;s bank statements.</li>
        <li>Don&rsquo;t use the service to break the law, evade taxes, or commit fraud.</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-semibold">Service availability</h2>
      <p>
        We provide the service "as is." We may modify features, suspend the service for
        maintenance, or discontinue features at any time. We&rsquo;ll provide reasonable notice for
        material changes.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">Termination</h2>
      <p>
        You can delete your account at any time via Settings. We can suspend or terminate accounts
        that violate these Terms or that endanger the integrity of the service.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">Disputes</h2>
      <p>
        Disputes arising under these Terms are resolved by binding arbitration in the state where
        Eternal Wealth operates, except claims for injunctive relief or small-claims actions.
      </p>
    </article>
  );
}
