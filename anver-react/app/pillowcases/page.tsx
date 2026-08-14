import type { Metadata } from "next";
import CatalogPage from "@/components/CatalogPage";
import { getSeoText } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  return { title: await getSeoText("seo.pillowcases") };
}

export default function PillowcasesPage() {
  return (
    <CatalogPage category="Наволочки" titleKey="page.pillowcases" crumbKey="page.pillowcases" />
  );
}
