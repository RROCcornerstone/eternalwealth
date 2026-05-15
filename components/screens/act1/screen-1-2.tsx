"use client";

import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";

export function Screen12({ userId, brand, initialData }: RenderContext) {
  return (
    <ScreenShell
      screen={SCREENS_BY_ID["1.2"]!}
      userId={userId}
      brand={brand}
      initialData={initialData}
      continueLabel="Show me where it appears"
    >
      {() => (
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
            Act I · Principle
          </p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight text-foreground">
            Before we look at the verse, you need to understand a principle.
          </h1>

          <div className="space-y-4 text-lg text-foreground">
            <p>
              There&apos;s a pattern throughout Scripture. Theologians call it{" "}
              <strong className="font-medium">the Law of First Mention</strong>.
            </p>
            <p>
              The first time a word, a concept, or a doctrine appears in the Bible, it carries{" "}
              <strong className="font-medium">the heaviest weight</strong>. It sets the blueprint.
              Every other mention of that word — every story, every prophecy, every teaching —
              builds on the foundation laid the first time God said it.
            </p>
          </div>

          <h2 className="font-display text-2xl italic text-foreground">
            And there&apos;s a reason.
          </h2>

          <div className="space-y-4 text-lg text-foreground">
            <p>
              The closer a passage is to <strong className="font-medium">Genesis</strong>, the
              closer it is to the moment God spoke creation into existence. Pure. Uncorrupted.
              The original revelation.
            </p>
            <p>
              As the Bible progresses, the world becomes more and more wicked. Sin multiplies.
              Hearts harden. But the first mention — that anchor in the beginning — never loses
              its weight.
            </p>
          </div>

          <div className="border-l-2 border-accent p-4 space-y-3 text-base text-foreground">
            <p>
              So when you find out where the word{" "}
              <strong className="font-medium">&ldquo;rich&rdquo;</strong> first appears in the
              entire Bible&hellip;
            </p>
            <p>That&apos;s not a coincidence. That&apos;s God&apos;s blueprint for wealth.</p>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
