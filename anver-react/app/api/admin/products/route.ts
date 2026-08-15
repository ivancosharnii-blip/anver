import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  supabaseFetch,
  SUPABASE_URL,
  STORAGE_BUCKET,
  deleteStorageFile,
} from "@/lib/catalog";

function bad(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

/** GET /api/admin/products?q= — список товаров (поиск по названию). */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const q = req.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";
  const url = q
    ? `/rest/v1/products?select=*&order=id.desc&title=ilike.*${encodeURIComponent(q)}*`
    : "/rest/v1/products?select=*&order=id.desc";

  const res = await supabaseFetch(url);
  if (!res.ok) {
    return NextResponse.json({ error: "Ошибка при чтении каталога" }, { status: 500 });
  }
  const products = await res.json();
  return NextResponse.json({ products });
}

/**
 * POST /api/admin/products — создать товар с фото.
 * multipart/form-data: title, price, priceold?, mark?, category?, fabric?,
 * storepart?, photo (файл).
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return bad("Не удалось прочитать форму");
  }

  const title = String(form.get("title") ?? "").trim();
  const price = Number(form.get("price"));
  const priceoldRaw = form.get("priceold");
  const mark = String(form.get("mark") ?? "").trim();
  const category = String(form.get("category") ?? "").trim();
  const fabric = String(form.get("fabric") ?? "").trim();
  const storepartRaw = Number(form.get("storepart") ?? 387894771902);
  const photo = form.get("photo");

  if (!title) return bad("Укажите название");
  if (!Number.isFinite(price) || price < 0) return bad("Укажите корректную цену");
  if (!photo || typeof photo !== "object" || !("arrayBuffer" in photo)) {
    return bad("Загрузите фото");
  }

  // 1. Загрузка фото в Supabase Storage.
  const ext = String((photo as File).name.split(".").pop() ?? "jpg")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || "jpg"}`;
  const buf = Buffer.from(await (photo as File).arrayBuffer());
  const up = await supabaseFetch(`/storage/v1/object/${STORAGE_BUCKET}/${key}`, {
    method: "POST",
    headers: { "Content-Type": (photo as File).type || "application/octet-stream" },
    body: buf,
  });
  if (!up.ok) {
    return NextResponse.json(
      { error: "Не удалось загрузить фото в хранилище" },
      { status: 500 },
    );
  }
  const photoUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${key}`;

  // 2. Создание товара.
  const uid = Date.now() * 1000 + Math.floor(Math.random() * 1000);
  const priceold =
    priceoldRaw && priceoldRaw !== "" && Number.isFinite(Number(priceoldRaw))
      ? Number(priceoldRaw)
      : null;
  const row = {
    uid,
    title,
    price,
    priceold,
    mark,
    category,
    fabric,
    storepart: Number.isFinite(storepartRaw) ? storepartRaw : 387894771902,
    gallery: [photoUrl],
    text: "",
    descr: "",
  };

  const ins = await supabaseFetch("/rest/v1/products", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!ins.ok) {
    return NextResponse.json({ error: "Не удалось сохранить товар" }, { status: 500 });
  }
  const [created] = (await ins.json()) as unknown[];
  return NextResponse.json({ product: created }, { status: 201 });
}

/** PATCH /api/admin/products — правка цены: { id, price?, priceold?, mark? }. */
export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (!body) return bad("Некорректный JSON");
  const id = Number(body.id);
  if (!Number.isFinite(id)) return bad("Нет id товара");

  const patch: Record<string, unknown> = {};
  if (body.price !== undefined && body.price !== null && body.price !== "") {
    const p = Number(body.price);
    if (!Number.isFinite(p) || p < 0) return bad("Некорректная цена");
    patch.price = p;
  }
  if (body.priceold !== undefined) {
    if (body.priceold === null || body.priceold === "") {
      patch.priceold = null;
    } else {
      const po = Number(body.priceold);
      if (!Number.isFinite(po) || po < 0) return bad("Некорректная старая цена");
      patch.priceold = po;
    }
  }
  if (body.mark !== undefined) patch.mark = String(body.mark).trim();

  if (Object.keys(patch).length === 0) return bad("Нет полей для обновления");

  const res = await supabaseFetch(`/rest/v1/products?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    return NextResponse.json({ error: "Не удалось обновить товар" }, { status: 500 });
  }
  const [updated] = (await res.json()) as unknown[];
  return NextResponse.json({ product: updated });
}

/** DELETE /api/admin/products?id= — удалить товар (+ его фото из storage). */
export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!Number.isFinite(id)) return bad("Нет id товара");

  const g = await supabaseFetch(`/rest/v1/products?id=eq.${id}&select=gallery`);
  const rows = (await g.json()) as { gallery?: string[] }[];
  const gallery = rows?.[0]?.gallery ?? [];

  const del = await supabaseFetch(`/rest/v1/products?id=eq.${id}`, {
    method: "DELETE",
  });
  if (!del.ok) {
    return NextResponse.json({ error: "Не удалось удалить товар" }, { status: 500 });
  }
  await Promise.all(gallery.map((u) => deleteStorageFile(u)));
  return NextResponse.json({ ok: true });
}
