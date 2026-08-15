import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, hashAdmin } from "@/lib/admin-auth";

/**
 * Защита админки: /admin/* (кроме /admin/login) и /api/admin/*.
 * Cookie anver_admin должен совпадать с SHA-256(ADMIN_PASSWORD + соль).
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminApi = pathname.startsWith("/api/admin");
  const isAdminPage =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  if (!isAdminApi && !isAdminPage) return NextResponse.next();

  const expected = process.env.ADMIN_PASSWORD;
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const ok =
    Boolean(expected) &&
    Boolean(cookie) &&
    cookie === (await hashAdmin(expected ?? ""));

  if (ok) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json(
      { error: "Требуется вход в админку" },
      { status: 401 },
    );
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
