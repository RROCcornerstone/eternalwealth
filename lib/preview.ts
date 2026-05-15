/**
 * Preview-mode detection.
 *
 * When Supabase isn't configured (no real env vars), the app runs in "stub mode" —
 * authed pages should be walkable without sign-in. Detected by checking whether
 * NEXT_PUBLIC_SUPABASE_URL points at a real Supabase project (https://...supabase.co)
 * or at the dev-stub `http://localhost:54321`.
 */

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("https://") && url.includes("supabase");
}

/** A synthetic user ID used in preview mode so module saves have something to key on. */
export const PREVIEW_USER_ID = "00000000-0000-0000-0000-000000000000";
