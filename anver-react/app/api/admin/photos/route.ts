import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseFetch, deleteStorageFile } from "@/lib/catalog";

/** DELETE /api/admin/photos?productId=&url= — удалить одно фото из галереи. */
export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const productId = Number(req.nextUrl.searchParams.get("productId"));
  const url = req.nextUrl.searchParams.get("url") ?? "";
  if (!Number.isFinite(productId) || !url) {
    return NextResponse.json(
      { error: "Не хватает параметров productId/url" },
      { status: 400 },
    );
  }

  await deleteStorageFile(url);

  const g = await supabaseFetch(
    `/rest/v1/products?id=eq.${productId}&select=gallery`,
  );
  const rows = (await g.json()) as { gallery?: string[] }[];
  const gallery = rows?.[0]?.gallery ?? [];
  const next = gallery.filter((u) => u !== url);

  const res = await supabaseFetch(`/rest/v1/products?id=eq.${productId}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ gallery: next }),
  });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Не удалось обновить товар" },
      { status: 500 },
    );
  }
  const [product] = (await res.json()) as unknown[];
  return NextResponse.json({ product });
}
