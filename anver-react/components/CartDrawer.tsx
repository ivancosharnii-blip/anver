"use client";

import type { CSSProperties } from "react";
import { IMAGES } from "@/lib/site";
import { formatPrice, useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { productRo } from "@/lib/product-ro";

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1099,
  background: "rgba(0, 0, 0, 0.4)",
  backdropFilter: "blur(2px)",
};

const drawerStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  zIndex: 1100,
  height: "100vh",
  width: "min(560px, 100%)",
  background: "#fff",
  boxShadow: "-8px 0 24px rgba(0, 0, 0, 0.15)",
  display: "flex",
  flexDirection: "column",
};

const qtyBtnStyle: CSSProperties = {
  width: 28,
  height: 28,
  border: "1px solid #dedede",
  borderRadius: 6,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 16,
  lineHeight: 1,
};

export default function CartDrawer() {
  const ctx = useCart();
  const { t, lang } = useLang();

  if (!ctx.isOpen) return null;

  return (
    <>
      <div style={overlayStyle} onClick={ctx.closeCart} />
      <aside style={drawerStyle} role="dialog" aria-label="Корзина">
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid #dedede",
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#242424" }}>{t("cart.title")}</h2>
          <button
            onClick={ctx.closeCart}
            aria-label={t("cart.close")}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32 }}
          >
            <img src={IMAGES.closeIcon} alt={t("cart.close")} style={{ width: 24, height: 24 }} />
          </button>
        </div>

        {ctx.items.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#808080",
              fontSize: 16,
              padding: 40,
            }}
          >
            {t("cart.empty")}
          </div>
        ) : (
          <>
            <ul
              style={{
                flex: 1,
                overflowY: "auto",
                listStyle: "none",
                padding: "16px 24px",
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {ctx.items.map((item) => (
                <li key={item.uid} style={{ display: "flex", gap: 16 }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "#242424" }}>
                      {lang === "ro" ? productRo[item.uid]?.title ?? item.title : item.title}
                    </div>
                    {item.color ? (
                      <div style={{ fontSize: 13, color: "#808080", marginTop: 4 }}>
                        {item.color}
                      </div>
                    ) : null}
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#242424", marginTop: 6 }}>
                      {formatPrice(item.price)}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                      <button
                        aria-label={t("cart.qtyDown")}
                        onClick={() => ctx.updateQuantity(item.uid, item.quantity - 1)}
                        style={qtyBtnStyle}
                      >
                        −
                      </button>
                      <span style={{ minWidth: 24, textAlign: "center", fontSize: 14 }}>
                        {item.quantity}
                      </span>
                      <button
                        aria-label={t("cart.qtyUp")}
                        onClick={() => ctx.updateQuantity(item.uid, item.quantity + 1)}
                        style={qtyBtnStyle}
                      >
                        +
                      </button>
                      <button
                        onClick={() => ctx.removeItem(item.uid)}
                        style={{ fontSize: 13, color: "#b15c2a", marginLeft: "auto" }}
                      >
                        {t("cart.remove")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div style={{ flexShrink: 0, padding: "20px 24px", borderTop: "1px solid #dedede" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                  fontSize: 15,
                  color: "#242424",
                }}
              >
                <span>{t("cart.total")}</span>
                <span style={{ fontSize: 20, fontWeight: 600 }}>{formatPrice(ctx.total)}</span>
              </div>
              <button
                className="btn btn-dark"
                style={{ width: "100%" }}
                onClick={() => alert(t("cart.thanks"))}
              >
                {t("cart.checkout")}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
