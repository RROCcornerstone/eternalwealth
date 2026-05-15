"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RenderContext } from "@/components/screens/registry";

// TODO(DRAFT): Replace with real Coinbase referral URL from Alex.
// <!-- DRAFT: Alex to replace -->
const COINBASE_REFERRAL_URL = "https://www.coinbase.com/join/lorenz_aw5";

export function Screen5S5({ userId, brand, initialData }: RenderContext) {
  const init = (initialData ?? {}) as Record<string, unknown>;
  const [setupClicked, setSetupClicked] = useState<boolean>(
    Boolean(init.coinbase_setup),
  );

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["5S.5"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Continue"
    >
      {({ setField }) => (
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            🪙 Silver Path
          </p>

          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
            Set up Coinbase to start accumulating Bitcoin and Ethereum.
          </h1>

          <div className="space-y-4 text-lg text-foreground">
            <p>
              Bitcoin and Ethereum are the foundation of your investment portfolio. Not because of
              hype — because they&apos;re the most established, most liquid, most
              institutionally-adopted digital assets in the world.
            </p>
            <p>
              Coinbase is the easiest, most trusted way to buy them. Set it up now.
            </p>
          </div>

          <Card className="px-6 space-y-3">
            <h2 className="font-display text-xl text-accent">Why BTC + ETH</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>
                <strong className="font-semibold">Bitcoin:</strong> Digital gold. Scarce. Store of
                value.
              </li>
              <li>
                <strong className="font-semibold">Ethereum:</strong> Programmable money. The
                infrastructure layer of crypto.
              </li>
            </ul>
          </Card>

          <div className="space-y-3">
            {/* DRAFT: Alex to replace Coinbase referral URL */}
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                setSetupClicked(true);
                setField("coinbase_setup", true);
              }}
            >
              <a
                href={COINBASE_REFERRAL_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Sign up for Coinbase
              </a>
            </Button>

            <p className="text-sm">
              <button
                type="button"
                onClick={() => {
                  setSetupClicked(true);
                  setField("coinbase_setup", true);
                }}
                className="text-muted-foreground underline-offset-4 hover:underline"
              >
                Already have a Coinbase account? Continue →
              </button>
            </p>

            {setupClicked ? (
              <p className="text-sm text-accent font-mono uppercase tracking-[0.2em]">
                ✓ Coinbase setup acknowledged
              </p>
            ) : null}
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
