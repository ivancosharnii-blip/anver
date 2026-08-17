import { getSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * GET /api/admin/reviews — отзывы, ожидающие модерации (moderated = false).
 * Ответ защищён middleware (требует cookie админки).
 */
export async function GET() {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return Response.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 503 },
    );
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("moderated", false)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("[api/admin/reviews] ошибка чтения:", error);
      return Response.json({ ok: false, error: "db_error" }, { status: 500 });
    }

    return Response.json({ ok: true, reviews: data ?? [] });
  } catch (err) {
    console.error("[api/admin/reviews] непредвиденная ошибка:", err);
    return Response.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/reviews — одобрить отзыв (moderated = true).
 * Тело: { id: string }
 */
export async function PATCH(request: Request) {
  let body: { id?: unknown };
  try {
    body = (await request.json()) as { id?: unknown };
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const id = typeof body.id === "string" && body.id.trim() ? body.id.trim() : null;
  if (!id) {
    return Response.json({ ok: false, error: "id_required" }, { status: 400 });
  }

  const supabase = await getSupabaseClient();
  if (!supabase) {
    return Response.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 503 },
    );
  }

  try {
    const { error } = await supabase
      .from("reviews")
      .update({ moderated: true })
      .eq("id", id);

    if (error) {
      console.error("[api/admin/reviews] ошибка одобрения:", error);
      return Response.json({ ok: false, error: "db_error" }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/reviews] непредвиденная ошибка:", err);
    return Response.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/reviews — удалить отзыв.
 * Параметр: ?id=...
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || !id.trim()) {
    return Response.json({ ok: false, error: "id_required" }, { status: 400 });
  }

  const supabase = await getSupabaseClient();
  if (!supabase) {
    return Response.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 503 },
    );
  }

  try {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id.trim());

    if (error) {
      console.error("[api/admin/reviews] ошибка удаления:", error);
      return Response.json({ ok: false, error: "db_error" }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/reviews] непредвиденная ошибка:", err);
    return Response.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}