import type { Metadata } from "next";
import { getSeoText } from "@/lib/i18n";
import SuccessContent from "./success-content";

export async function generateMetadata(): Promise<Metadata> {
  return { title: await getSeoText("seo.success") };
}

// Серверная обёртка: metadata + рендер client-компонента с контентом
// (переводимые тексты живут в словарях lib/i18n.ts, см. success-content.tsx).

export default function SuccessPage() {
  return <SuccessContent />;
}
