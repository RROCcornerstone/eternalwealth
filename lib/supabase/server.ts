import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// NOTE: Database<T> generic is intentionally omitted until types are regenerated
// from a live Supabase project. See lib/supabase/types.ts for the schema reference.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:54321",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "stub-anon-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    },
  );
}

export function createServiceRoleClient() {
  // For server-side admin operations that bypass RLS. Never use in client-callable RSC.
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:54321",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "stub-service-key",
    {
      cookies: {
        getAll() { return []; },
        setAll() {},
      },
    },
  );
}
