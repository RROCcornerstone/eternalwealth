import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STAGES = [
  {
    label: "Livestock",
    sub: "The Foundation",
    body: "Rent, groceries, tithes, savings, minimum debt. The layer that keeps the household alive.",
  },
  {
    label: "Silver",
    sub: "The Movement",
    body: "Aggressive debt payoff, retirement, skill building, lifestyle. The layer of strategy.",
  },
  {
    label: "Gold",
    sub: "The Multiplication",
    body: "Trading, active business investment, building wealth that compounds. The layer of overflow.",
  },
];

const ACTIONS = [
  { title: "Set the order", body: "Walk through every layer in sequence. No skipping." },
  { title: "Tithe first", body: "Set apart the firstfruits before anything else." },
  { title: "Pull your numbers", body: "Upload statements. AI extracts every transaction." },
  { title: "Categorize honestly", body: "Ten buckets. AI suggests; you confirm." },
  { title: "Build the flow", body: "Nine accounts. Take the sheet to your bank." },
  { title: "Project your legacy", body: "A 30-year plan that names the number." },
];

export default function LandingPage() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-16 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
          A Faith-Rooted Financial Framework
        </p>
        <h1 className="mt-6 font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
          The divine order of wealth.
        </h1>
        <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
          A guided, interactive course through livestock, silver, and gold —
          the order of increase. You don&rsquo;t read about it. You walk it.
          Twenty-eight modules. Real numbers. Your legacy.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="px-10 py-6 text-base">
            <Link href="/signup">Begin the framework</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="px-10 py-6 text-base">
            <Link href="#what-youll-do">What you&rsquo;ll do</Link>
          </Button>
        </div>
      </section>

      {/* THREE STAGES */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {STAGES.map((s, i) => (
            <Card key={s.label} className="border-border/60">
              <CardHeader>
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                  Stage {i + 1}
                </p>
                <CardTitle className="font-display text-3xl font-semibold mt-1">
                  {s.label}
                </CardTitle>
                <p className="font-display italic text-muted-foreground text-sm">{s.sub}</p>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* SCRIPTURE */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <blockquote className="font-serif italic text-2xl md:text-3xl leading-relaxed text-foreground">
          &ldquo;And Abram was very rich in livestock, in silver, and in gold.&rdquo;
        </blockquote>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.32em] text-accent">
          Genesis 13 : 2
        </p>
      </section>

      {/* WHAT YOU'LL DO */}
      <section id="what-youll-do" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-center">
          What you&rsquo;ll do
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {ACTIONS.map((a, i) => (
            <div key={a.title} className="space-y-2">
              <div className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-display text-lg font-semibold">{a.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="font-display text-xl md:text-2xl leading-relaxed text-foreground">
          Built on biblical financial order.
          <br />
          Free forever. No ads. No selling data.
        </p>
        <p className="mt-8 text-sm text-muted-foreground max-w-xl mx-auto">
          Your bank statements stay in your account, encrypted, auto-deleted after
          90 days. Transactions are categorized by AI you can correct. Nothing leaves
          the platform. Nothing is monetized.
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
          Sit down and count.
        </h2>
        <p className="mt-6 text-muted-foreground">
          The tower is yours to build.
        </p>
        <Button asChild size="lg" className="mt-10 px-12 py-6 text-base">
          <Link href="/signup">Begin the framework</Link>
        </Button>
      </section>
    </>
  );
}
