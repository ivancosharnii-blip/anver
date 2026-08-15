/**
 * lib/admin-auth.ts — простая аутентификация админки.
 *
 * Пароль берётся из env ADMIN_PASSWORD. После успешного входа клиенту
 * выставляется httpOnly-cookie со SHA-256 хешем пароля (+соль); middleware
 * и серверные роуты сравнивают cookie с хешем. Без состояния и БД.
 */
import { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE = "anver_admin";

const SALT = "anver-admin-salt";

/** SHA-256(пароль + соль) в hex — значение cookie. */
export async function hashAdmin(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${SALT}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function checkAdmin(req: NextRequest): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!cookie) return false;
  const want = await hashAdmin(expected);
  return cookie === want;
}

/** 401-ответ, если не авторизован; null, если ок. */
export async function requireAdmin(
  req: NextRequest,
): Promise<NextResponse | null> {
  if (await checkAdmin(req)) return null;
  return NextResponse.json(
    { error: "Требуется вход в админку" },
    { status: 401 },
  );
}
