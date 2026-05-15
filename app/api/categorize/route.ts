import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(_request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // TODO Phase 8: batch Claude categorization
  return NextResponse.json(
    {
      status: "not_implemented",
      message: "AI categorization is being built. Coming in Phase 8.",
    },
    { status: 501 },
  );
}
