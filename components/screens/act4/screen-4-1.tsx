"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";

const MESSAGES = [
  "Comparing what you said to what the math says...",
  "Running your numbers against God's framework...",
  "Locking in your financial brand...",
];

export function Screen41({ userId, brand, initialData }: RenderContext) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const cycle = setInterval(() => {
      setIdx((i) => (i + 1) % MESSAGES.length);
    }, 1000);
    const advance = setTimeout(() => {
      router.push("/act/4-2");
    }, 3000);
    return () => {
      clearInterval(cycle);
      clearTimeout(advance);
    };
  }, [router]);

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["4.1"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      skipSave
      continueLabel="Continue"
    >
      {() => (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-8 text-center">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="size-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: "0ms" }} />
            <span className="size-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: "200ms" }} />
            <span className="size-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: "400ms" }} />
          </div>
          <p
            key={idx}
            className="font-serif italic text-xl sm:text-2xl text-foreground transition-all duration-500"
            style={{ animation: "fadeInUp 600ms ease-out" }}
          >
            {MESSAGES[idx]}
          </p>
          <style jsx>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(8px) scale(0.98); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
        </div>
      )}
    </ScreenShell>
  );
}
