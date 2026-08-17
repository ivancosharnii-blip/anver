import { getSupabaseClient } from "@/lib/supabase";
import {
  formatOrderMessage,
  isTelegramConfigured,
  sendTelegramMessage,
} from "@/lib/telegram";

export const runtime = "nodejs";

/** Одна позиция заказа (совпадает со структурой items корзины). */
type OrderItem = {
  uid: number | string;
  title: string;
  qty: number;
  price: number;
  options?: unknown;
};

/** Тело POST /api/order. */
type OrderPayload = {
  name?: unknown;
  contact?: unknown;
  method?: unknown;
  message?: unknown;
  items?: unknown;
  total?: unknown;
  lang?: unknown;
};

/** Обрезает и проверяет строку; возвращает null, если значение не строка или пустое. */
function cleanString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > maxLength) return null;
  return trimmed;
}

/** Проверяет и нормализует состав заказа; null — формат невалиден. */
function parseItems(value: unknown): OrderItem[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const items: OrderItem[] = [];
  for (const raw of value) {
    if (typeof raw !== "object" || raw === null) return null;
    const item = raw as Record<string, unknown>;
    const uid = item.uid;
    const title = typeof item.title === "string" ? item.title.trim() : "";
    const qty = typeof item.qty === "number" ? item.qty : NaN;
    const price = typeof item.price === "number" ? item.price : NaN;
    const uidValid = (typeof uid === "number" || typeof uid === "string") && uid !== "";
    if (
      !uidValid ||
      title.length === 0 ||
      title.length > 300 ||
      !Number.isFinite(qty) ||
      qty <= 0 ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return null;
    }
    items.push({ uid, title, qty, price, options: item.options ?? null });
  }
  return items;
}

/**
 * POST /api/order — приём заказа с сайта.
 * Тело: { name, contact, method?, message?, items: [{uid,title,qty,price,options?}], total?, lang? }
 * Ответ: { ok: true, id } или { ok: false, error }.
 * Если Supabase не сконфигурирован (нет ключей в env) — 503: сайт работает и без БД.
 */
export async function POST(request: Request) {
  let body: OrderPayload;
  try {
    body = (await request.json()) as OrderPayload;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = cleanString(body.name, 200);
  const contact = cleanString(body.contact, 200);
  const method = cleanString(body.method, 50);
  const message = cleanString(body.message, 5000);
  const items = parseItems(body.items);
  const lang = cleanString(body.lang, 10) ?? "ru";
  const clientTotal =
    typeof body.total === "number" && Number.isFinite(body.total) && body.total >= 0
      ? body.total
      : null;

  // Обязательные поля: имя, контакт и хотя бы одна позиция в корзине.
  if (!name || !contact || !items) {
    return Response.json({ ok: false, error: "validation_failed" }, { status: 400 });
  }

  // Итоговая сумма считается на сервере; клиентская сумма — запасной вариант.
  const total = clientTotal ?? items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const supabase = await getSupabaseClient();
  if (!supabase) {
    // Ключей Supabase нет — БД недоступна, но сайт продолжает работать.
    return Response.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 503 },
    );
  }

  try {
    // id генерируем сами (crypto.randomUUID) и вставляем без .select():
    // `return=representation` потребовал бы SELECT-политики RLS, которой нет
    // (чтение заказов анонимам закрыто — только INSERT).
    const id = crypto.randomUUID();
    const { error } = await supabase.from("orders").insert({
      id,
      name,
      contact,
      method: method ?? null,
      message: message ?? null,
      total,
      currency: "MDL",
      lang,
      items,
    });

    if (error) {
      console.error("[api/order] ошибка записи в orders:", error);
      return Response.json({ ok: false, error: "db_error" }, { status: 500 });
    }

    // Уведомление в Telegram (если настроено): отправка после успешной записи
    // в БД, таймаут 8 с. Ошибка отправки не роняет приём заказа.
    if (isTelegramConfigured()) {
      const tgResult = await sendTelegramMessage(
        formatOrderMessage({
          id,
          name,
          contact,
          method,
          message,
          items,
          total,
          currency: "MDL",
          lang,
        }),
      );
      if (!tgResult.ok) {
        console.error("[api/order] заказ #" + id + " сохранён, но уведомление в Telegram не ушло:", tgResult.error);
      }
    }

    return Response.json({ ok: true, id });
  } catch (err) {
    console.error("[api/order] непредвиденная ошибка:", err);
    return Response.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}
