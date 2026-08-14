import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Nunito } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileMenu from "@/components/MobileMenu";
import CartDrawer from "@/components/CartDrawer";
import FloatingButtons from "@/components/FloatingButtons";

// Тёплый округлый шрифт Nunito: кириллица + латиница + латинские диакритики (румынский ă â î ș ț).
const nunito = Nunito({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Anver — постельное бельё из 100% хлопка",
    template: "%s | Anver",
  },
  description:
    "Постельное бельё ручной работы из 100% хлопка: Ранфорс, Сатин, Сатин Страйп. Сшито в Молдове. Доставка по всей Молдове.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className={nunito.variable}>
        <LanguageProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <MobileMenu />
            <CartDrawer />
            <FloatingButtons />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
