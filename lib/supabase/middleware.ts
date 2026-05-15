import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/preview";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Stub mode: skip every auth check. Lets you walk the whole app without sign-in.
  if (!isSupabaseConfigured()) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:54321",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "stub-anon-key",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser();

  // Protect /app routes — redirect to login if no user
  const pathname = request.nextUrl.pathname;
  const isProtected =
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/course") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/giving-board") ||
    pathname.startsWith("/legacy") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/accounts") ||
    pathname.startsWith("/settings");

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
