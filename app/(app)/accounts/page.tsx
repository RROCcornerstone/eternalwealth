import Link from "next/link";

export default function AccountsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">Accounts</p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl font-semibold">Your nine accounts</h1>
      <p className="mt-3 text-muted-foreground">
        Set these up in <Link href="/course/money-flow" className="underline">Module 23</Link>.
      </p>
      {/* DRAFT: Alex to review — Phase 7 will populate this with the bank-setup checklist */}
    </div>
  );
}
