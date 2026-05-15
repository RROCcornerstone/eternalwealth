"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { OnboardingInput } from "@/lib/validation/schemas";
import { dollarsToCents, formatCurrency } from "@/lib/utils";

type FormState = Partial<OnboardingInput>;

const STEPS = [
  "name",
  "age",
  "marital",
  "children",
  "grandchildren",
  "income",
  "retirement_age",
  "retirement_income",
  "faith",
  "notes",
] as const;

export function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FormState>({
    num_children: 0,
    retirement_age_goal: 65,
    retirement_income_goal_cents: 8000000,
  });
  const [submitting, setSubmitting] = useState(false);

  const total = STEPS.length;
  const percent = ((step + 1) / total) * 100;

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setState((s) => ({ ...s, [k]: v }));
  }

  function next() {
    if (step < total - 1) setStep(step + 1);
    else submit();
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  async function submit() {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("user_profiles").upsert(
        {
          user_id: userId,
          full_name: state.full_name ?? null,
          age: state.age ?? null,
          marital_status: state.marital_status ?? null,
          num_children: state.num_children ?? 0,
          num_planned_grandchildren: state.num_planned_grandchildren ?? (state.num_children ?? 0) * 2,
          annual_income_cents: state.annual_income_cents ?? null,
          retirement_age_goal: state.retirement_age_goal ?? 65,
          retirement_income_goal_cents: state.retirement_income_goal_cents ?? 8000000,
          faith_context: state.faith_context ?? null,
        },
        { onConflict: "user_id" },
      );
      if (error) throw error;
      router.push("/course/welcome");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Couldn't save profile";
      // In stub-mode (no Supabase), persist via localStorage and continue
      if (msg.toLowerCase().includes("fetch") || msg.toLowerCase().includes("network")) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("ew_pending_profile", JSON.stringify(state));
        }
        toast.warning("Saved locally — see ACTION_REQUIRED.md for Supabase setup");
        router.push("/course/welcome");
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const canNext = (() => {
    switch (STEPS[step]) {
      case "name": return Boolean(state.full_name?.trim());
      case "age": return Boolean(state.age && state.age >= 18 && state.age <= 120);
      case "marital": return Boolean(state.marital_status);
      case "children": return state.num_children != null && state.num_children >= 0;
      case "grandchildren": return state.num_planned_grandchildren != null;
      case "income": return state.annual_income_cents != null && state.annual_income_cents > 0;
      case "retirement_age": return Boolean(state.retirement_age_goal);
      case "retirement_income": return Boolean(state.retirement_income_goal_cents);
      case "faith": return Boolean(state.faith_context);
      case "notes": return true;
      default: return false;
    }
  })();

  return (
    <div>
      <Progress value={percent} className="mb-8" />
      <Card className="border-border/60">
        <CardContent className="pt-8 min-h-[280px] flex flex-col">
          <div className="flex-1">{renderStep(STEPS[step]!, state, update)}</div>
          <div className="mt-8 flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={back} disabled={step === 0 || submitting}>
              Back
            </Button>
            <span className="font-mono text-xs text-muted-foreground">
              {step + 1} / {total}
            </span>
            <Button type="button" onClick={next} disabled={!canNext || submitting}>
              {step === total - 1 ? (submitting ? "Saving…" : "Begin") : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function renderStep(
  step: (typeof STEPS)[number],
  state: FormState,
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void,
) {
  switch (step) {
    case "name":
      return (
        <Field label="What's your first name?" hint="So we can address you personally.">
          <Input
            autoFocus
            value={state.full_name ?? ""}
            onChange={(e) => update("full_name", e.target.value)}
            placeholder="Alex"
          />
        </Field>
      );
    case "age":
      return (
        <Field label="How old are you?" hint="Must be 18 or older.">
          <Input
            autoFocus
            type="number"
            inputMode="numeric"
            min={18}
            max={120}
            value={state.age ?? ""}
            onChange={(e) => update("age", e.target.value ? Number(e.target.value) : undefined)}
          />
        </Field>
      );
    case "marital":
      return (
        <Field label="What's your marital status?">
          <RadioGroup
            value={state.marital_status ?? ""}
            onValueChange={(v) => update("marital_status", v as OnboardingInput["marital_status"])}
            className="space-y-2"
          >
            {[
              ["single", "Single"],
              ["married", "Married"],
              ["divorced", "Divorced"],
              ["widowed", "Widowed"],
              ["other", "Other / prefer not to say"],
            ].map(([v, l]) => (
              <label key={v} className="flex items-center gap-3 cursor-pointer">
                <RadioGroupItem value={v!} id={`marital-${v}`} />
                <span>{l}</span>
              </label>
            ))}
          </RadioGroup>
        </Field>
      );
    case "children":
      return (
        <Field label="How many children do you have (or plan to have)?">
          <Input
            autoFocus
            type="number"
            inputMode="numeric"
            min={0}
            max={15}
            value={state.num_children ?? 0}
            onChange={(e) => update("num_children", Number(e.target.value))}
          />
        </Field>
      );
    case "grandchildren": {
      const defaultGC = (state.num_children ?? 0) * 2;
      return (
        <Field label="How many grandchildren do you anticipate?" hint="A rough estimate is fine.">
          <Input
            autoFocus
            type="number"
            inputMode="numeric"
            min={0}
            max={60}
            value={state.num_planned_grandchildren ?? defaultGC}
            onChange={(e) => update("num_planned_grandchildren", Number(e.target.value))}
          />
        </Field>
      );
    }
    case "income":
      return (
        <Field label="Current annual income, before tax." hint="USD. Best estimate.">
          <CurrencyInput
            value={state.annual_income_cents ?? null}
            onChange={(c) => update("annual_income_cents", c)}
          />
        </Field>
      );
    case "retirement_age":
      return (
        <Field label="At what age would you like to be financially free?">
          <Input
            autoFocus
            type="number"
            min={40}
            max={99}
            value={state.retirement_age_goal ?? 65}
            onChange={(e) => update("retirement_age_goal", Number(e.target.value))}
          />
        </Field>
      );
    case "retirement_income":
      return (
        <Field
          label="What annual income would you want then, in today's dollars?"
          hint="Default: $80,000."
        >
          <CurrencyInput
            value={state.retirement_income_goal_cents ?? null}
            onChange={(c) => update("retirement_income_goal_cents", c)}
          />
        </Field>
      );
    case "faith":
      return (
        <Field label="How would you describe your faith context?" hint="Used to tailor framing — never to filter access.">
          <RadioGroup
            value={state.faith_context ?? ""}
            onValueChange={(v) => update("faith_context", v as OnboardingInput["faith_context"])}
            className="space-y-2"
          >
            {[
              ["practicing_christian", "Practicing Christian"],
              ["exploring", "Exploring"],
              ["not_religious", "Not religious"],
              ["prefer_not_to_say", "Prefer not to say"],
            ].map(([v, l]) => (
              <label key={v} className="flex items-center gap-3 cursor-pointer">
                <RadioGroupItem value={v!} id={`faith-${v}`} />
                <span>{l}</span>
              </label>
            ))}
          </RadioGroup>
        </Field>
      );
    case "notes":
      return (
        <Field
          label="Anything else we should know?"
          hint="Optional. Skip if you'd rather just get started."
        >
          <Textarea
            value={state.notes ?? ""}
            onChange={(e) => update("notes", e.target.value)}
            rows={4}
            placeholder="…"
          />
        </Field>
      );
  }
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="font-display text-xl font-semibold leading-tight">{label}</Label>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function CurrencyInput({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (cents: number) => void;
}) {
  const [text, setText] = useState(() =>
    value != null ? (value / 100).toLocaleString("en-US") : "",
  );
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="font-display text-lg text-muted-foreground">$</span>
        <Input
          autoFocus
          inputMode="decimal"
          value={text}
          onChange={(e) => {
            const t = e.target.value;
            setText(t);
            const cents = dollarsToCents(t);
            onChange(cents);
          }}
          placeholder="80,000"
        />
      </div>
      {value != null && (
        <p className="mt-2 text-xs text-muted-foreground tabular">{formatCurrency(value)}</p>
      )}
    </div>
  );
}
