import type { Metadata } from "next";
import CatalogPage from "@/components/CatalogPage";
import { getSeoText } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const [title, description] = await Promise.all([
    getSeoText("seo.ranforce"),
    getSeoText("seo.ranforceDescr"),
  ]);
  return { title, description };
}

export default function RanforcePage() {
  return (
    <CatalogPage
      storepart={387894771902}
      titleKey="page.ranforce"
      crumbKey="page.ranforce"
      descrKey="page.ranforceDescr"
    />
  );
}
