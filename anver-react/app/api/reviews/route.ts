import { getSupabaseClient } from "@/lib/supabase";
import {
  isTelegramConfigured,
  sendTelegramMessage,
} from "@/lib/telegram";

export const runtime = "nodejs";

/** Тело POST /api/reviews. */
type ReviewPayload = {
  name?: unknown;
  text?: unknown;
  rating?: unknown;
  photo_url?: unknown;
  product_uid?: unknown;
  city?: unknown;
};

/** Обрезает и проверяет строку; возвращает null, если значение не строка или пустое. */
function cleanString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > maxLength) return null;
  return trimmed;
}

/**
 * POST /api/reviews — создание отзыва.
 * Тело: { name, text, rating, photo_url?, product_uid?, city? }
 * Ответ: { ok: true, id } или { ok: false, error }.
 */
export async function POST(request: Request) {
  let body: ReviewPayload;
  try {
    body = (await request.json()) as ReviewPayload;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = cleanString(body.name, 200);
  const text = cleanString(body.text, 5000);
  const photo_url = cleanString(body.photo_url, 2000);
  const product_uid = cleanString(body.product_uid, 100);
  const city = cleanString(body.city, 200);

  // Валидация рейтинга
  const rating =
    typeof body.rating === "number" &&
    Number.isInteger(body.rating) &&
    body.rating >= 1 &&
    body.rating <= 5
      ? body.rating
      : null;

  // Обязательные поля: имя, текст, рейтинг
  if (!name || !text || rating === null) {
    return Response.json({ ok: false, error: "validation_failed" }, { status: 400 });
  }

  const supabase = await getSupabaseClient();
  if (!supabase) {
    return Response.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 503 },
    );
  }

  try {
    const id = crypto.randomUUID();
    const { error } = await supabase.from("reviews").insert({
      id,
      name,
      text,
      rating,
      photo_url: photo_url ?? null,
      product_uid: product_uid ?? null,
      city: city ?? null,
      // moderated: false — по умолчанию, не передаём явно
    });

    if (error) {
      console.error("[api/reviews] ошибка записи в reviews:", error);
      return Response.json({ ok: false, error: "db_error" }, { status: 500 });
    }

    // Уведомление в Telegram о новом отзыве
    if (isTelegramConfigured()) {
      const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
      const tgMessage = [
        `💬 <b>Новый отзыв</b> (ожидает модерации)`,
        "",
        `👤 <b>Имя:</b> ${escapeHtml(name)}`,
        city ? `🌆 <b>Город:</b> ${escapeHtml(city)}` : null,
        `⭐ <b>Оценка:</b> ${stars} (${rating}/5)`,
        `📝 <b>Текст:</b> ${escapeHtml(text.length > 300 ? text.slice(0, 300) + "…" : text)}`,
        product_uid ? `🏷️ <b>Товар:</b> uid=${escapeHtml(product_uid)}` : null,
        ``,
        `🔗 /admin — для модерации`,
      ]
        .filter(Boolean)
        .join("\n");

      const tgResult = await sendTelegramMessage(tgMessage);
      if (!tgResult.ok) {
        console.error(
          "[api/reviews] отзыв #" + id + " сохранён, но уведомление в Telegram не ушло:",
          tgResult.error,
        );
      }
    }

    return Response.json({ ok: true, id });
  } catch (err) {
    console.error("[api/reviews] непредвиденная ошибка:", err);
    return Response.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}

/**
 * GET /api/reviews — список модерированных отзывов.
 * Параметры запроса:
 *   ?product_uid= — фильтр по товару (опционально)
 * Ответ: { ok: true, reviews: [...] }
 */
export async function GET(request: Request) {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return Response.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 503 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const productUid = searchParams.get("product_uid");

    // Строим запрос: только модерированные, сортировка по дате, лимит 20
    let query = supabase
      .from("reviews")
      .select("*")
      .eq("moderated", true)
      .order("created_at", { ascending: false })
      .limit(20);

    if (productUid) {
      query = query.eq("product_uid", productUid);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[api/reviews] ошибка чтения reviews:", error);
      return Response.json({ ok: false, error: "db_error" }, { status: 500 });
    }

    return Response.json({ ok: true, reviews: data ?? [] });
  } catch (err) {
    console.error("[api/reviews] непредвиденная ошибка:", err);
    return Response.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}

/** Экранирует спецсимволы HTML для Telegram. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}