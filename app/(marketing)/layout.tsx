import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-tight text-foreground"
          >
            Eternal Wealth
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/disclaimer" className="text-muted-foreground hover:text-foreground transition-colors">
              Disclaimer
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Begin
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60 mt-24">
        <div className="mx-auto max-w-6xl px-6 py-12 grid gap-8 md:grid-cols-3 text-sm text-muted-foreground">
          <div>
            <div className="font-display font-semibold text-foreground text-base">Eternal Wealth</div>
            <p className="mt-2 leading-relaxed">
              A faith-rooted financial framework. Livestock first. Silver after. Gold last.
              On the Cornerstone.
            </p>
          </div>
          <div>
            <div className="font-medium text-foreground mb-2">Resources</div>
            <ul className="space-y-1">
              <li><Link href="/disclaimer" className="hover:text-foreground">Disclaimer</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
              <li><Link href="/cookies" className="hover:text-foreground">Cookies</Link></li>
            </ul>
          </div>
          <div className="md:text-right">
            <p className="text-xs leading-relaxed">
              Eternal Wealth is educational only. It is not financial, legal, tax, or
              investment advice. Read the full disclaimer before relying on any output.
            </p>
            <p className="mt-4 text-xs">© {new Date().getFullYear()} Eternal Wealth</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
