import type { Metadata } from "next";
import { getSeoText } from "@/lib/i18n";
import ReviewsPageClient from "@/components/ReviewsPage";
import ConsultBlock from "../contacts/consult";

export async function generateMetadata(): Promise<Metadata> {
  return { title: getSeoText("seo.reviews") };
}

export default function ReviewsPage() {
  return (
    <div>
      <section style={{ background: "#f2f2f2", paddingTop: 138, paddingBottom: 90 }}>
        <div className="container">
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#242424",
                textAlign: "center",
                marginBottom: 12,
                fontFamily: "var(--font-nunito)",
              }}
            >
              Отзывы наших клиентов
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "#555",
                textAlign: "center",
                marginBottom: 40,
                fontFamily: "var(--font-nunito)",
              }}
            >
              Мы ценим каждое мнение — это помогает нам становиться лучше
            </p>
            <ReviewsPageClient />
          </div>
        </div>
      </section>

      {/* Консультируем по размерам, ткани и наличию */}
      <ConsultBlock />
    </div>
  );
}