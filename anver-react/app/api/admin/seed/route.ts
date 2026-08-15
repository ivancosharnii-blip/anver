import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseFetch } from "@/lib/catalog";
import { products } from "@/lib/products";

/**
 * POST /api/admin/seed — одноразовая загрузка товаров из lib/products.ts
 * в таблицу products (если она ещё пуста).
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const countRes = await supabaseFetch("/rest/v1/products?select=id&limit=1");
  if (!countRes.ok) {
    return NextResponse.json(
      {
        error:
          "Таблица products недоступна. Выполните миграцию supabase/admin-schema.sql в SQL Editor Supabase.",
      },
      { status: 400 },
    );
  }
  const existing = (await countRes.json()) as unknown[];
  if (Array.isArray(existing) && existing.length > 0) {
    return NextResponse.json(
      { error: "Товары уже загружены в БД" },
      { status: 400 },
    );
  }

  const rows = products.map((p) => ({
    uid: p.uid,
    title: p.title,
    price: p.price,
    priceold: p.priceold,
    mark: p.mark,
    text: p.text,
    descr: p.descr,
    gallery: p.gallery,
    category: p.category,
    fabric: p.fabric,
    storepart: p.storepart,
  }));

  const ins = await supabaseFetch("/rest/v1/products", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(rows),
  });
  if (!ins.ok) {
    return NextResponse.json(
      { error: "Не удалось загрузить товары в БД" },
      { status: 500 },
    );
  }
  return NextResponse.json({ inserted: rows.length });
}
