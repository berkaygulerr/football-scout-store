import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname, origin } = req.nextUrl;
  const isAuthPage = (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")
  );

  // Oturum yoksa ve auth sayfasında değilse → /login'e yönlendir
  if (!session && !isAuthPage) {
    const loginUrl = new URL("/login", origin);
    return NextResponse.redirect(loginUrl);
  }

  // Oturum varken /login veya /register ise → anasayfaya yönlendir
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", origin));
  }

  return res;
}

export const config = {
  matcher: [
    // _next, api, static dosyalar, favicon hariç tüm rotalar
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};


