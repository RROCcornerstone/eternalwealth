import Link from "next/link";

export default function LegacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">Legacy</p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl font-semibold">Your legacy plan</h1>
      <p className="mt-3 text-muted-foreground">
        Build this in <Link href="/course/personal-legacy-plan" className="underline">Module 28</Link>.
      </p>
      {/* DRAFT: Alex to review — Phase 9 will populate this with the 30-year projection */}
    </div>
  );
}
