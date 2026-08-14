import type { Metadata } from "next";
import CatalogPage from "@/components/CatalogPage";
import { getSeoText } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  return { title: await getSeoText("seo.duvet") };
}

// Страница создана из-за ссылки панели категорий t978 «Пододеяльники и покрывала»,
// которая вела на несуществующий /duvet-covers (см. PROJECT.md §6).
export default function DuvetCoversPage() {
  return (
    <CatalogPage
      category="Пододеяльник"
      titleKey="page.duvet"
      crumbKey="page.duvet"
      descrKey="page.duvetDescr"
    />
  );
}
