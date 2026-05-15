export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <article>
      <h1 className="font-display text-4xl font-semibold">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-6 p-4 border border-accent/40 bg-accent/5 rounded-md text-sm">
        <strong>Plain-language summary:</strong> We collect what we need to run the app. We don&rsquo;t sell
        your data. Your uploaded bank statements are deleted after 90 days. AI categorization is
        performed by Anthropic&rsquo;s Claude; your data is processed but not used to train models.
        You can export or delete everything at any time.
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold">What we collect</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Account:</strong> email address (for sign-in)</li>
        <li><strong>Profile:</strong> name, age range, marital status, household composition, income, retirement goals, faith context (all self-reported in onboarding)</li>
        <li><strong>Course responses:</strong> answers you enter in the 28 modules</li>
        <li><strong>Bank statements:</strong> PDF files you upload, retained for 90 days then auto-deleted</li>
        <li><strong>Transactions:</strong> extracted from your statements, categorized by AI, persisted</li>
        <li><strong>Usage analytics:</strong> page views, button clicks (anonymized, via PostHog with cookie consent)</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-semibold">How we use it</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>To provide the framework you signed up for</li>
        <li>To save your progress and let you resume across devices</li>
        <li>To categorize your transactions and surface insights</li>
        <li>To compute your legacy projections</li>
        <li>To improve the product based on aggregate usage patterns (with consent)</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-semibold">AI processing</h2>
      <p>
        Transaction extraction and categorization is performed by Anthropic&rsquo;s Claude API.
        Your data is sent to Anthropic for processing only. Per Anthropic&rsquo;s commercial terms,
        your data is not used to train Anthropic&rsquo;s models. Read{" "}
        <a href="https://www.anthropic.com/legal/commercial-terms" target="_blank" rel="noreferrer" className="underline">
          Anthropic&rsquo;s commercial terms
        </a>.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">Data retention</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Bank statement PDFs:</strong> 90 days, then auto-deleted</li>
        <li><strong>Extracted transactions:</strong> retained until you delete them or your account</li>
        <li><strong>Profile + course responses:</strong> retained until account deletion</li>
        <li><strong>Analytics:</strong> per PostHog defaults, typically 7 years; anonymized</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-semibold">Your rights</h2>
      <p>
        Under GDPR (EU users) and CCPA (California users), you have the right to access, export,
        correct, or delete your personal data. Use Settings → Data Export to download everything,
        or Settings → Delete Account to remove all of it. We complete deletion requests within
        30 days.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">We do not sell your data</h2>
      <p>
        We do not sell, lease, or share your personal data with advertisers or third-party
        marketers. Ever.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">Contact</h2>
      <p>
        Privacy questions: <a href="mailto:privacy@eternalwealth.app" className="underline">privacy@eternalwealth.app</a>
      </p>
    </article>
  );
}
