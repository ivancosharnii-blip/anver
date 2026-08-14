import type { Metadata } from "next";
import CatalogPage from "@/components/CatalogPage";
import { getSeoText } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  return { title: await getSeoText("seo.sheets") };
}

export default function SheetsPage() {
  return <CatalogPage category="Простынь" titleKey="page.sheets" crumbKey="page.sheets" />;
}
