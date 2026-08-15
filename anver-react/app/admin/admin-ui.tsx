"use client";

import type { ReactNode } from "react";

/**
 * Общие UI-компоненты админ-панели: модальное окно и всплывающее уведомление.
 * Стили подключаются через инлайн <style> (паттерн проекта), классы .adm-*.
 */

export function Modal({
  title,
  onClose,
  wide,
  children,
}: {
  title: string;
  onClose: () => void;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="adm-overlay" onClick={onClose}>
      <div
        className={wide ? "adm-modal adm-modal-wide" : "adm-modal"}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="adm-modal-head">
          <h3 className="adm-modal-title">{title}</h3>
          <button
            type="button"
            className="adm-modal-close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        <div className="adm-modal-body">{children}</div>
      </div>
      <style>{`
        .adm-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0, 0, 0, 0.45);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .adm-modal {
          background: #fff; border-radius: 10px;
          width: 100%; max-width: 440px; max-height: 90vh; overflow: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }
        .adm-modal-wide { max-width: 660px; }
        .adm-modal-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; border-bottom: 1px solid #eee;
          position: sticky; top: 0; background: #fff; z-index: 1;
        }
        .adm-modal-title { margin: 0; font-size: 16px; font-weight: 700; color: #3a4f6a; }
        .adm-modal-close {
          background: none; border: none; cursor: pointer;
          font-size: 26px; line-height: 1; color: #777; padding: 0 2px;
        }
        .adm-modal-close:hover { color: #242424; }
        .adm-modal-body { padding: 20px; }

        .adm-toast {
          position: fixed; bottom: 20px; right: 20px; z-index: 200;
          padding: 12px 18px; border-radius: 8px; color: #fff;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
          font-size: 14px; max-width: 380px;
        }
        .adm-toast-ok { background: #3a4f6a; }
        .adm-toast-err { background: #c0392b; }
      `}</style>
    </div>
  );
}

export function Toast({ message, type }: { message: string; type: "ok" | "err" }) {
  if (!message) return null;
  return (
    <div className={"adm-toast" + (type === "err" ? " adm-toast-err" : " adm-toast-ok")} role="status">
      {message}
    </div>
  );
}
