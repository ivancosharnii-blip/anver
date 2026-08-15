import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, hashAdmin } from "@/lib/admin-auth";

/** POST /api/admin/auth — вход: { password } → 200 + cookie | 401. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const password = body?.password;
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD не задан в .env" },
      { status: 500 },
    );
  }
  if (typeof password !== "string" || password.length === 0 || password !== expected) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  const token = await hashAdmin(password);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
