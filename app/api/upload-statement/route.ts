import { NextResponse, type NextRequest } from "next/server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { extractTransactionsFromText } from "@/lib/ai/extract-transactions";
import { categorizeTransactions } from "@/lib/ai/categorize-transactions";

/**
 * POST /api/upload-statement
 *  - multipart/form-data with `file` (a single PDF or CSV)
 *  - Saves to Supabase Storage, records statement_uploads, runs extraction + categorization,
 *    persists transactions, returns summary.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > 52_428_800) {
    return NextResponse.json({ error: "File too large (max 50 MB)" }, { status: 413 });
  }

  // Save to Supabase Storage
  const storagePath = `${user.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from("statements")
    .upload(storagePath, buffer, { contentType: file.type });
  if (uploadError) {
    return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
  }

  // Record the upload
  const { data: uploadRow, error: insertError } = await supabase
    .from("statement_uploads")
    .insert({
      user_id: user.id,
      storage_path: storagePath,
      original_filename: file.name,
      status: "parsing",
    } as never)
    .select()
    .single();
  if (insertError || !uploadRow) {
    return NextResponse.json({ error: `DB insert failed: ${insertError?.message}` }, { status: 500 });
  }
  const uploadId = (uploadRow as any).id as string;

  // Extract text from the file
  let text = "";
  try {
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      // pdf-parse v2 uses a class-based API; load it at request time so build stays light
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      text = result.text ?? "";
      await parser.destroy();
    } else {
      text = buffer.toString("utf-8");
    }
  } catch (err) {
    await supabase.from("statement_uploads").update({ status: "error", error_message: String(err) } as never).eq("id", uploadId);
    return NextResponse.json({ error: "Could not parse file" }, { status: 422 });
  }

  if (!text || text.length < 50) {
    await supabase.from("statement_uploads").update({ status: "error", error_message: "Empty / unreadable file" } as never).eq("id", uploadId);
    return NextResponse.json({ error: "File is empty or unreadable" }, { status: 422 });
  }

  // Extract transactions
  const extracted = await extractTransactionsFromText(text);

  // Categorize
  const inputForCat = extracted.map((t, idx) => ({
    id: `${uploadId}-${idx}`,
    date: t.date,
    description: t.description,
    amount_cents: t.amount_cents,
  }));
  const categorized = await categorizeTransactions(inputForCat);
  const catById: Record<string, (typeof categorized)[number]> = Object.fromEntries(
    categorized.map((c) => [c.transaction_id, c]),
  );

  // Persist transactions (skip nulls / transfers)
  const rows = extracted.map((t, idx) => {
    const tid = `${uploadId}-${idx}`;
    const cat = catById[tid];
    return {
      user_id: user.id,
      upload_id: uploadId,
      transaction_date: t.date,
      description: t.description,
      amount_cents: t.amount_cents,
      category: cat?.category != null ? categoryEnumName(cat.category) : null,
      ai_confidence: cat?.confidence ?? null,
      transaction_type: t.amount_cents > 0 ? "income" : "expense",
    };
  });

  if (rows.length > 0) {
    // Use service role to bypass RLS for bulk inserts (we still attribute user_id correctly)
    const admin = createServiceRoleClient();
    await admin.from("transactions").insert(rows as never);
  }

  await supabase.from("statement_uploads").update({
    status: "complete",
  } as never).eq("id", uploadId);

  return NextResponse.json({
    upload_id: uploadId,
    transactions_found: extracted.length,
    transactions_categorized: categorized.filter((c) => c.category != null).length,
    low_confidence_count: categorized.filter((c) => (c.confidence ?? 0) < 0.7).length,
  });
}

function categoryEnumName(id: number): string | null {
  const map: Record<number, string> = {
    1: "tithes_offerings",
    2: "core_bills",
    3: "food",
    4: "health_wellness",
    5: "savings",
    6: "debt_repayment",
    7: "retirement_investment",
    8: "leisure_lifestyle",
    9: "skill_business_prep",
    10: "active_business_investment",
  };
  return map[id] ?? null;
}
