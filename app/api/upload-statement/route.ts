import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // TODO Phase 8: implement full PDF parse + Claude extraction pipeline
  return NextResponse.json(
    {
      status: "not_implemented",
      message: "PDF upload + parse pipeline is being built. Coming in Phase 8.",
    },
    { status: 501 },
  );
}
