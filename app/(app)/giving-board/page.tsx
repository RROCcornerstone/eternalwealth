import Link from "next/link";

export default function GivingBoardPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">Giving Board</p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl font-semibold">Your horizons</h1>
      <p className="mt-3 text-muted-foreground">
        Build this in <Link href="/course/giving-board" className="underline">Module 20</Link>.
        Once set, your horizons appear here.
      </p>
      {/* DRAFT: Alex to review — Phase 7 will populate this with the actual board view */}
    </div>
  );
}
