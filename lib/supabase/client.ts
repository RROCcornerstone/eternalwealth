import { createBrowserClient } from "@supabase/ssr";

// NOTE: Database<T> generic is intentionally omitted until types are regenerated
// from a live Supabase project via `supabase gen types typescript --linked`.
// Hand-rolled types in `./types.ts` describe the schema for human reference.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:54321",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "stub-anon-key",
  );
}
