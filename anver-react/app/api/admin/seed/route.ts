import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseFetch } from "@/lib/catalog";
import { products } from "@/lib/products";

/**
 * POST /api/admin/seed — перенос товаров из lib/products.ts в БД.
 *
 * Два режима:
 *  - таблица пуста            → полная вставка всех товаров (вместе с опциями);
 *  - товары уже есть          → backfill: дозаполняет json_options по uid
 *                               из кода (цены/бейджи НЕ трогает).
 * Нужен для восстановления опций (цветов) после миграции до версии
 * с колонкой json_options.
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const countRes = await supabaseFetch("/rest/v1/products?select=id&limit=1");
  if (!countRes.ok) {
    return NextResponse.json(
      {
        error:
          "Таблица products недоступна. Выполните миграцию supabase/admin-schema.sql в SQL Editor Supabase (https://supabase.com/dashboard/project/zlnwlaubmcmhbwqkchzq/sql/new).",
      },
      { status: 400 },
    );
  }
  const existing = (await countRes.json()) as unknown[];

  // Режим backfill: таблица не пуста.
  if (Array.isArray(existing) && existing.length > 0) {
    let updated = 0;
    let failed = 0;
    for (const p of products) {
      const res = await supabaseFetch(`/rest/v1/products?uid=eq.${p.uid}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ json_options: p.json_options }),
      });
      if (res.ok) updated++;
      else failed++;
    }
    if (updated === 0 && failed > 0) {
      return NextResponse.json(
        {
          error:
            "Не удалось обновить опции: в таблице нет колонки json_options. Выполните миграцию supabase/admin-schema.sql ещё раз в SQL Editor Supabase.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json({ backfilled: updated });
  }

  // Режим полной вставки: таблица пуста.
  const rows = products.map((p) => ({
    uid: p.uid,
    title: p.title,
    price: p.price,
    priceold: p.priceold,
    mark: p.mark,
    text: p.text,
    descr: p.descr,
    gallery: p.gallery,
    json_options: p.json_options,
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
