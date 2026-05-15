export const metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <article>
      <h1 className="font-display text-4xl font-semibold">Disclaimer</h1>
      <p className="text-sm text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-6 p-4 border border-warning/40 bg-warning/5 rounded-md">
        <strong>Plain-language summary:</strong> Eternal Wealth is educational content and software.
        It is <strong>not</strong> financial, legal, tax, or investment advice. We are not
        fiduciaries. Numbers shown are projections based on inputs and assumptions. Real-world
        results will differ. Talk to a qualified professional before making decisions with real
        money.
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold">Educational use only</h2>
      <p>
        Eternal Wealth provides a structured framework for thinking about personal stewardship,
        budgeting, debt, savings, investment, and inheritance. Every module, calculator, and AI
        output is for informational and educational purposes only. None of it constitutes:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Financial advice</li>
        <li>Investment advice or a recommendation to buy or sell any security</li>
        <li>Tax advice</li>
        <li>Legal advice</li>
        <li>A solicitation, recommendation, or offer to enter any transaction</li>
        <li>An offer to act as your fiduciary</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-semibold">AI categorization</h2>
      <p>
        Transaction categorization on this platform is performed by large language models. AI
        output is automated and may contain errors. Review every transaction. You are responsible
        for the accuracy of the categorization, the budgeting decisions you make from it, and any
        tax filings or financial decisions that depend on it.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">Projections</h2>
      <p>
        Retirement, legacy, and giving projections on this platform are mathematical models based on
        assumptions you supply (rates of return, inflation, contribution levels) plus reasonable
        defaults. Actual returns will vary, sometimes dramatically. Inflation will not be exactly
        3%. Markets are not linear. Past performance does not predict future results.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">Faith-rooted framing</h2>
      <p>
        The framework is built on biblical principles of stewardship — particularly the order
        revealed in Genesis 13:2 (livestock, silver, gold) and the firstfruits principle. Faith
        context is offered honestly; non-religious users are welcome and accommodated throughout.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">Talk to a professional</h2>
      <p>
        Before making material financial decisions — opening accounts, restructuring debt,
        retirement contributions, business investment, tax planning, or estate / inheritance
        planning — consult a qualified Certified Financial Planner (CFP®), CPA, or attorney in
        your jurisdiction.
      </p>
    </article>
  );
}
