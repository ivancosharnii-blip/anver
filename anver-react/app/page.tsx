import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { getSeoText } from "@/lib/i18n";

export function generateMetadata(): Metadata {
  const title = getSeoText("seo.homeTitle");
  const description = getSeoText("seo.homeDescr");
  const ogDescr = getSeoText("seo.ogDescr");
  return {
    title,
    description,
    openGraph: {
      title,
      description: ogDescr,
      type: "website",
      locale: "ru_RU",
      images: [
        {
          url: "https://static.tildacdn.one/tild3763-6530-4366-a431-393636336632/Autumn_Final_2.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default function Home() {
  return <HomePage />;
}
