"use client";

import { useEffect, useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface BodyProps {
  num: number;
  setNum: (n: number) => void;
  setField: <T = unknown>(key: string, value: T) => void;
  defaultGuess: number | null;
  initialDataHasValue: boolean;
}

function Body({ num, setNum, setField, defaultGuess, initialDataHasValue }: BodyProps) {
  // When the supabase-derived default arrives, push it once into form data.
  useEffect(() => {
    if (!initialDataHasValue && defaultGuess != null) {
      setNum(defaultGuess);
      setField("num_grandchildren", defaultGuess);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultGuess]);

  function update(next: number) {
    const clamped = Math.max(0, Math.min(20, next));
    setNum(clamped);
    setField("num_grandchildren", clamped);
  }

  return (
    <div className="space-y-8">
      <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
        Act II · Grandchildren
      </p>
      <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
        How many grandchildren do you expect in total?
      </h1>
      <p className="text-lg text-muted-foreground">
        Guesstimate is fine. Most families average 2 grandkids per child.
      </p>

      <div className="flex items-center gap-6">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => update(num - 1)}
          disabled={num <= 0}
          aria-label="Decrease"
          className="h-14 w-14 text-2xl"
        >
          −
        </Button>
        <div className="font-display text-6xl tabular-nums text-foreground w-24 text-center">
          {num}
        </div>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => update(num + 1)}
          disabled={num >= 20}
          aria-label="Increase"
          className="h-14 w-14 text-2xl"
        >
          +
        </Button>
      </div>
    </div>
  );
}

export function Screen24({ userId, brand, initialData, profile }: RenderContext) {
  const savedFromInitial =
    typeof initialData?.num_grandchildren === "number"
      ? (initialData.num_grandchildren as number)
      : null;

  const [num, setNum] = useState<number>(savedFromInitial ?? 0);
  const [defaultGuess, setDefaultGuess] = useState<number | null>(null);

  useEffect(() => {
    if (savedFromInitial != null) return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("module_responses")
        .select("data")
        .eq("user_id", userId)
        .eq("module_slug", "2.3")
        .maybeSingle();
      if (cancelled) return;
      const numChildren =
        typeof (data as any)?.data?.num_children === "number"
          ? ((data as any).data.num_children as number)
          : typeof profile?.num_children === "number"
            ? (profile.num_children as number)
            : 0;
      setDefaultGuess(Math.min(20, Math.max(0, numChildren * 2)));
    })();
    return () => {
      cancelled = true;
    };
  }, [savedFromInitial, userId, profile?.num_children]);

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["2.4"]!}
      userId={userId}
      brand={brand}
      initialData={{ num_grandchildren: savedFromInitial ?? 0, ...initialData }}
    >
      {({ setField }) => (
        <Body
          num={num}
          setNum={setNum}
          setField={setField}
          defaultGuess={defaultGuess}
          initialDataHasValue={savedFromInitial != null}
        />
      )}
    </ScreenShell>
  );
}
