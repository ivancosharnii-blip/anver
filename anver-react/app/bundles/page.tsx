import type { Metadata } from "next";
import CatalogPage from "@/components/CatalogPage";
import { getSeoText } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  return { title: await getSeoText("seo.bundles") };
}

export default function BundlesPage() {
  return <CatalogPage category="Комплект" titleKey="page.bundles" crumbKey="page.bundles" />;
}
