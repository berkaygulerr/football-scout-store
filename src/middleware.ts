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
  
  // Herkes tarafından erişilebilir sayfalar
  const publicPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/terms",
    "/privacy"
  ];
  
  // Sayfa public mi kontrol et
  const isPublicPage = publicPages.some(page => pathname.startsWith(page));

  // Oturum yoksa ve public sayfada değilse → /login'e yönlendir
  if (!session && !isPublicPage) {
    const loginUrl = new URL("/login", origin);
    return NextResponse.redirect(loginUrl);
  }

  // Oturum varken /login veya /register gibi auth sayfalarındaysa → anasayfaya yönlendir
  // (terms ve privacy sayfaları bu kontrolden hariç tutuldu)
  if (session && (
    pathname.startsWith("/login") || 
    pathname.startsWith("/register") || 
    pathname.startsWith("/forgot-password") || 
    pathname.startsWith("/reset-password")
  )) {
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