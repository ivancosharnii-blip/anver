import type { Metadata } from "next";
import { getSeoText } from "@/lib/i18n";
import FeedbackForm from "./feedback-form";
import ConsultBlock from "../contacts/consult";

export async function generateMetadata(): Promise<Metadata> {
  return { title: await getSeoText("seo.feedback") };
}

// Содержимое перенесено дословно из site/feedback.html:
// Tilda Zero-форма (rec1481375721) + блок «Консультируем…» (rec1507679391).
// Видимого заголовка «Обратная связь» в оригинале нет — только <title>.

export default function FeedbackPage() {
  return (
    <div>
      <section style={{ background: "#f2f2f2", paddingTop: 138, paddingBottom: 90 }}>
        <div className="container">
          <div style={{ maxWidth: 757, margin: "0 auto" }}>
            <FeedbackForm />
          </div>
        </div>
      </section>

      {/* Консультируем по размерам, ткани и наличию (rec1507679391) */}
      <ConsultBlock />
    </div>
  );
}
