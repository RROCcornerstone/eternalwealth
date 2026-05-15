import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-lg font-semibold">Eternal Wealth</Link>
          <nav className="text-sm text-muted-foreground flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/disclaimer" className="hover:text-foreground">Disclaimer</Link>
            <Link href="/cookies" className="hover:text-foreground">Cookies</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto max-w-3xl px-6 py-12 prose prose-neutral dark:prose-invert">
        {children}
      </main>
    </div>
  );
}
