"use client";

import { useState, type ReactNode } from "react";

export type AccordionItem = {
  title: string;
  content: ReactNode;
};

// Стилизация по оригиналу Tilda (блок t668, rec1506769501 в site/success.html):
// карточки #f2f2f2 со скруглением 8px, иконка-«плюс» в кружке: белый круг со
// штрихом #808080, при открытии/наведении — круг #5c7494 со штрихом #e9eef4.
export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <style>{`
        .t668-trigger:hover .t668-icon { background-color: #5c7494; }
        .t668-trigger:hover .t668-icon .t668-lines { stroke: #e9eef4; }
      `}</style>
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.title} style={{ background: "#f2f2f2", borderRadius: 8, overflow: "hidden" }}>
            <button
              type="button"
              className="t668-trigger"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-controls={`accordion-${index}`}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 16,
                fontWeight: 500,
                color: "#242424",
              }}
            >
              {item.title}
              <span
                className="t668-icon"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: isOpen ? "#5c7494" : "#ffffff",
                  transition: "background-color 0.2s ease",
                  flexShrink: 0,
                }}
              >
                <svg
                  role="presentation"
                  focusable="false"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <g stroke="none" strokeWidth="1px" fill="none" fillRule="evenodd" strokeLinecap="square">
                    <g transform="translate(1.000000, 1.000000)" stroke={isOpen ? "#e9eef4" : "#808080"}>
                      <path d="M0,11 L22,11" />
                      <path d="M11,0 L11,22" />
                    </g>
                  </g>
                </svg>
              </span>
            </button>
            <div
              id={`accordion-${index}`}
              hidden={!isOpen}
              style={{
                display: isOpen ? "block" : "none",
                padding: "0 20px 20px",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#242424",
                  fontFamily: "var(--font)",
                  maxWidth: 960,
                  lineHeight: 1.55,
                }}
              >
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
