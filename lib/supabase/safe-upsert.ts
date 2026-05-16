/**
 * Defensive upsert that survives missing tables / columns.
 *
 * If the underlying table doesn't exist yet (e.g., user hasn't applied
 * migration 0002), the call returns gracefully — the caller can then
 * fall back to a different persistence path (typically writing the same
 * payload as JSON into module_responses, which always exists).
 */

import { createClient } from "@/lib/supabase/client";

export interface SafeUpsertResult {
  ok: boolean;
  errorCode?: string;
  errorMessage?: string;
  schemaMissing?: boolean;
}

const MISSING_PATTERNS = [
  /relation\s+".+"\s+does not exist/i,
  /could not find the table/i,
  /column\s+".+"\s+does not exist/i,
  /could not find the '.+' column/i,
];

function looksLikeSchemaMissing(message: string | null | undefined): boolean {
  if (!message) return false;
  return MISSING_PATTERNS.some((re) => re.test(message));
}

export async function safeUpsert(
  table: string,
  payload: Record<string, unknown>,
  options?: { onConflict?: string },
): Promise<SafeUpsertResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from(table)
      .upsert(payload as never, options ?? undefined);

    if (!error) return { ok: true };

    const schemaMissing = looksLikeSchemaMissing(error.message);
    if (schemaMissing) {
      // Fall back: stash in module_responses keyed by table name + user
      await supabase
        .from("module_responses")
        .upsert(
          {
            user_id: payload.user_id as string,
            module_slug: `__fallback__:${table}`,
            data: payload,
          } as never,
          { onConflict: "user_id,module_slug" },
        );
    }

    return {
      ok: !schemaMissing, // if we fell back, signal "not really ok"
      errorCode: error.code,
      errorMessage: error.message,
      schemaMissing,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, errorMessage: msg, schemaMissing: false };
  }
}
