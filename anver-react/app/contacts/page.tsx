import type { Metadata } from "next";
import { getSeoText } from "@/lib/i18n";
import ContactsContent from "./contacts-content";

export async function generateMetadata(): Promise<Metadata> {
  return { title: await getSeoText("seo.contacts") };
}

// Серверная обёртка: metadata + рендер client-компонента с контентом
// (переводимые тексты живут в словарях lib/i18n.ts, см. contacts-content.tsx).

export default function ContactsPage() {
  return <ContactsContent />;
}
