import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { legacyInputsSchema } from "@/lib/validation/schemas";
import {
  nestEggRequired,
  monthlyContributionRequired,
  projectLegacy,
  purchasingPower,
} from "@/lib/math/legacy";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = legacyInputsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.format() }, { status: 400 });
  }

  const input = parsed.data;
  const yearsToRetirement = Math.max(0, input.retirement_age - input.current_age);
  const yearsInRetirement = 25;

  const nestEgg = nestEggRequired({
    annualNeedTodayCents: input.retirement_annual_need_cents,
    yearsToRetirement,
    yearsInRetirement,
    inflationRate: input.inflation_rate,
    withdrawalReturnRate: input.expected_return_rate * 0.6, // conservative withdrawal-phase
  });

  const monthlyContribution = monthlyContributionRequired({
    targetCents: nestEgg,
    currentSavedCents: 0, // We don't yet track current invested balance
    yearsToRetirement,
    annualReturnRate: input.expected_return_rate,
  });

  const inheritancePresentValue =
    input.num_children * input.inheritance_per_child_cents +
    input.num_grandchildren * input.inheritance_per_grandchild_cents;

  const projection = projectLegacy({
    currentAge: input.current_age,
    retirementAge: input.retirement_age,
    yearsInRetirement,
    currentSavedCents: 0,
    annualContributionCents: monthlyContribution * 12,
    expectedReturnRate: input.expected_return_rate,
  });

  return NextResponse.json({
    inputs: input,
    outputs: {
      yearsToRetirement,
      yearsInRetirement,
      nestEggRequiredCents: nestEgg,
      monthlyContributionRequiredCents: monthlyContribution,
      futurePurchasingPowerCents: purchasingPower(
        input.retirement_annual_need_cents,
        input.inflation_rate,
        yearsToRetirement,
      ),
      inheritancePresentValueCents: inheritancePresentValue,
      projection: projection.map((p) => ({
        year: p.year,
        age: p.age,
        balanceCents: p.balanceCents,
      })),
    },
  });
}
