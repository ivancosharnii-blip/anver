import type { Metadata } from "next";
import KitchenPage from "@/components/KitchenPage";
import { getSeoText } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  return { title: await getSeoText("seo.kitchen") };
}

// Раздел «Кухня» — скатерти (и позже фартуки).
export default function KitchenRoute() {
  return <KitchenPage />;
}
