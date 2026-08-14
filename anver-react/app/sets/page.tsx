import type { Metadata } from "next";
import CatalogPage from "@/components/CatalogPage";
import { getSeoText } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  return { title: await getSeoText("seo.sets") };
}

export default function SetsPage() {
  return <CatalogPage category="Комплект" titleKey="page.sets" crumbKey="page.sets" />;
}
