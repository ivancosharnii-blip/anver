import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";

/** GET /api/catalog — каталог для витрины (БД, иначе хардкод). */
export async function GET() {
  const products = await getCatalog();
  return NextResponse.json({ products });
}
