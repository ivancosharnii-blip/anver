import type { Metadata } from "next";
import CatalogPage from "@/components/CatalogPage";
import { getSeoText } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const [title, description] = await Promise.all([
    getSeoText("seo.stripe"),
    getSeoText("seo.stripeDescr"),
  ]);
  return { title, description };
}

export default function SateenStripePage() {
  return (
    <CatalogPage
      storepart={330859305352}
      titleKey="page.stripe"
      crumbKey="page.stripe"
      descrKey="page.stripeDescr"
    />
  );
}
