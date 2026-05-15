import Link from "next/link";

export default function TransactionsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">Transactions</p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl font-semibold">Your spending</h1>
      <p className="mt-3 text-muted-foreground">
        Upload statements in <Link href="/course/get-real-numbers" className="underline">Module 21</Link>.
      </p>
      {/* DRAFT: Alex to review — Phase 8 will populate this with the categorized table */}
    </div>
  );
}
