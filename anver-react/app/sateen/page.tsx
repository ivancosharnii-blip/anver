import type { Metadata } from "next";
import CatalogPage from "@/components/CatalogPage";
import { getSeoText } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const [title, description] = await Promise.all([
    getSeoText("seo.sateen"),
    getSeoText("seo.sateenDescr"),
  ]);
  return { title, description };
}

export default function SateenPage() {
  return (
    <CatalogPage
      storepart={377460312512}
      titleKey="page.sateen"
      crumbKey="page.sateenPremiumCrumb"
      descrKey="page.sateenDescr"
      showRating
    />
  );
}
