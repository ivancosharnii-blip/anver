/**
 * lib/useCatalog.ts — хук витрины.
 *
 * Сразу показывает товары из lib/products.ts (хардкод), затем, если БД готова
 * и вернула данные, подменяет список данными из Supabase. Так страницы не
 * «мигают» и не ломаются до применения миграции.
 */
"use client";

import { useEffect, useState } from "react";
import { products as hardcodedProducts, type Product } from "@/lib/products";

type UseCatalogOpts = {
  storepart?: number;
  category?: string;
};

export function useCatalogItems({ storepart, category }: UseCatalogOpts): Product[] {
  const [items, setItems] = useState<Product[]>(() => {
    if (storepart !== undefined) {
      return hardcodedProducts.filter((p) => p.storepart === storepart);
    }
    if (category !== undefined) {
      return hardcodedProducts.filter((p) => p.category === category);
    }
    return hardcodedProducts;
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("catalog api")))
      )
      .then((data: { products?: Product[] }) => {
        if (cancelled || !Array.isArray(data.products)) return;
        const filtered =
          storepart !== undefined
            ? data.products.filter((p) => p.storepart === storepart)
            : category !== undefined
              ? data.products.filter((p) => p.category === category)
              : data.products;
        if (filtered.length > 0) setItems(filtered);
      })
      .catch(() => {
        // БД не готова — остаёмся на хардкоде.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return items;
}
