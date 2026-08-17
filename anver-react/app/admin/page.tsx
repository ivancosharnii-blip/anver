"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Modal, Toast } from "./admin-ui";

/**
 * Главный дашборд админ-панели каталога.
 * Работает только через fetch к /api/admin/* (без импортов из lib/ и БД).
 */

type Product = {
  id: number;
  uid: number;
  title: string;
  price: number;
  priceold: number | null;
  mark: string;
  text: string;
  descr: string;
  gallery: string[];
  category: string;
  fabric: string;
  storepart: number;
  created_at: string;
};

type ToastState = { message: string; type: "ok" | "err" };

const EMPTY_ADD = { title: "", price: "", priceold: "", mark: "", category: "", fabric: "" };

function fmtPrice(n: number | null | undefined): string {
  if (n === null || n === undefined) return "";
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(n);
}

function parseNum(s: string): number | null {
  if (s.trim() === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Добавление товара
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_ADD);
  const [addPhoto, setAddPhoto] = useState<File | null>(null);
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  // Изменение цены
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({ price: "", priceold: "", mark: "" });
  const [editError, setEditError] = useState("");
  const [editing, setEditing] = useState(false);

  // Удаление фото
  const [photosProduct, setPhotosProduct] = useState<Product | null>(null);

  // Отзывы на модерацию
  type Review = {
    id: string;
    name: string;
    text: string;
    rating: number;
    photo_url: string | null;
    product_uid: string | null;
    city: string | null;
    moderated: boolean;
    created_at: string;
  };

  const [pendingReviews, setPendingReviews] = useState<Review[] | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const reqId = useRef(0);
  const reviewReqId = useRef(0);
  const firstLoad = useRef(true);

  const load = useCallback(async (query?: string) => {
    const id = ++reqId.current;
    setLoading(true);
    setLoadError("");
    try {
      const url = query ? `/api/admin/products?q=${encodeURIComponent(query)}` : "/api/admin/products";
      const res = await fetch(url);
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!res.ok) throw new Error("bad status " + res.status);
      const data = (await res.json()) as { products?: Product[] };
      if (reqId.current !== id) return;
      setProducts(data.products ?? []);
    } catch {
      if (reqId.current !== id) return;
      setLoadError("Не удалось загрузить товары. Проверьте соединение и повторите.");
    } finally {
      if (reqId.current === id) setLoading(false);
    }
  }, []);

  // Первичная загрузка сразу + поиск с debounce ~300мс.
  useEffect(() => {
    const t = setTimeout(() => {
      void load(q);
    }, firstLoad.current ? 0 : 300);
    firstLoad.current = false;
    return () => clearTimeout(t);
  }, [q, load]);

  // Загрузка отзывов на модерацию
  const loadReviews = useCallback(async () => {
    const id = ++reviewReqId.current;
    setReviewsLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!res.ok) throw new Error("bad status " + res.status);
      const data = (await res.json()) as { reviews?: Review[] };
      if (reviewReqId.current !== id) return;
      setPendingReviews(data.reviews ?? []);
    } catch {
      if (reviewReqId.current !== id) return;
      setPendingReviews([]);
    } finally {
      if (reviewReqId.current === id) setReviewsLoading(false);
    }
  }, []);

  // Загружаем отзывы при монтировании
  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const approveReview = async (id: string) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!res.ok) throw new Error("bad status");
      setToast({ message: "Отзыв одобрен", type: "ok" });
      void loadReviews();
    } catch {
      setToast({ message: "Не удалось одобрить отзыв", type: "err" });
    }
  };

  const rejectReview = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/reviews?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!res.ok) throw new Error("bad status");
      setToast({ message: "Отзыв отклонён", type: "ok" });
      void loadReviews();
    } catch {
      setToast({ message: "Не удалось отклонить отзыв", type: "err" });
    }
  };

  // Автоскрытие уведомлений.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      /* сеть недоступна — всё равно уходим на логин */
    }
    window.location.href = "/admin/login";
  };

  const seed = async () => {
    setBusy(true);
    setToast(null);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as {
        inserted?: number;
        backfilled?: number;
        error?: string;
      };
      if (res.ok) {
        const n = data.inserted ?? data.backfilled ?? 0;
        setToast({
          message:
            data.backfilled !== undefined
              ? `Обновлено опций товаров: ${n}`
              : `Загружено товаров из кода: ${n}`,
          type: "ok",
        });
        void load(q);
      } else {
        // 400 с текстом ошибки — нормально, если товары уже загружены.
        setToast({ message: data.error ?? "Не удалось загрузить товары из кода.", type: "err" });
      }
    } catch {
      setToast({ message: "Сеть недоступна. Попробуйте ещё раз.", type: "err" });
    } finally {
      setBusy(false);
    }
  };

  const submitAdd = async (e: FormEvent) => {
    e.preventDefault();
    setAddError("");
    if (!addForm.title.trim()) {
      setAddError("Укажите название товара.");
      return;
    }
    const price = parseNum(addForm.price);
    if (price === null || price <= 0) {
      setAddError("Укажите корректную цену (число больше нуля).");
      return;
    }
    if (!addPhoto) {
      setAddError("Выберите фото товара.");
      return;
    }
    const fd = new FormData();
    fd.set("title", addForm.title.trim());
    fd.set("price", String(price));
    const priceold = parseNum(addForm.priceold);
    if (priceold !== null) fd.set("priceold", String(priceold));
    if (addForm.mark.trim() !== "") fd.set("mark", addForm.mark.trim());
    if (addForm.category.trim() !== "") fd.set("category", addForm.category.trim());
    if (addForm.fabric.trim() !== "") fd.set("fabric", addForm.fabric.trim());
    fd.set("storepart", "387894771902");
    fd.set("photo", addPhoto);

    setAdding(true);
    try {
      const res = await fetch("/api/admin/products", { method: "POST", body: fd });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { product?: Product; error?: string };
      if (!res.ok) {
        setAddError(data.error ?? "Не удалось добавить товар.");
        return;
      }
      setAddOpen(false);
      setAddForm(EMPTY_ADD);
      setAddPhoto(null);
      setToast({ message: "Товар добавлен", type: "ok" });
      void load(q);
    } catch {
      setAddError("Сеть недоступна. Попробуйте ещё раз.");
    } finally {
      setAdding(false);
    }
  };

  const openEdit = (p: Product) => {
    setEditForm({
      price: String(p.price),
      priceold: p.priceold != null ? String(p.priceold) : "",
      mark: p.mark ?? "",
    });
    setEditError("");
    setEditProduct(p);
  };

  const submitEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    setEditError("");
    const price = parseNum(editForm.price);
    if (price === null || price <= 0) {
      setEditError("Укажите корректную цену (число больше нуля).");
      return;
    }
    const priceold = parseNum(editForm.priceold);
    if (editForm.priceold.trim() !== "" && priceold === null) {
      setEditError("Старая цена должна быть числом.");
      return;
    }
    setEditing(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editProduct.id, price, priceold, mark: editForm.mark.trim() }),
      });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { product?: Product; error?: string };
      if (!res.ok) {
        setEditError(data.error ?? "Не удалось обновить товар.");
        return;
      }
      if (data.product) {
        const product = data.product;
        setProducts((prev) =>
          prev === null ? prev : prev.map((p) => (p.id === product.id ? product : p)),
        );
      }
      setEditProduct(null);
      setToast({ message: "Цена обновлена", type: "ok" });
    } catch {
      setEditError("Сеть недоступна. Попробуйте ещё раз.");
    } finally {
      setEditing(false);
    }
  };

  const deletePhoto = async (p: Product, url: string) => {
    if (!confirm(`Удалить это фото?\n${url}`)) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/photos?productId=${p.id}&url=${encodeURIComponent(url)}`,
        { method: "DELETE" },
      );
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { product?: Product; error?: string };
      if (!res.ok) {
        setToast({ message: data.error ?? "Не удалось удалить фото.", type: "err" });
        return;
      }
      if (data.product) {
        const product = data.product;
        setProducts((prev) =>
          prev === null ? prev : prev.map((x) => (x.id === product.id ? product : x)),
        );
        setPhotosProduct((cur) => (cur && cur.id === product.id ? { ...product } : cur));
        if (!product.gallery.length) setPhotosProduct(null);
      }
      setToast({ message: "Фото удалено", type: "ok" });
    } catch {
      setToast({ message: "Сеть недоступна. Попробуйте ещё раз.", type: "err" });
    } finally {
      setBusy(false);
    }
  };

  const deleteProduct = async (p: Product) => {
    if (!confirm(`Удалить товар «${p.title}»?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products?id=${p.id}`, { method: "DELETE" });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setToast({ message: data.error ?? "Не удалось удалить товар.", type: "err" });
        return;
      }
      setProducts((prev) => (prev === null ? prev : prev.filter((x) => x.id !== p.id)));
      setPhotosProduct((cur) => (cur && cur.id === p.id ? null : cur));
      setToast({ message: "Товар удалён", type: "ok" });
    } catch {
      setToast({ message: "Сеть недоступна. Попробуйте ещё раз.", type: "err" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-page">
      <style>{`
        .adm-page {
          min-height: 100vh; background: #f2f2f2; color: #242424;
          padding: 24px; font-size: 14px; line-height: 1.5;
        }
        .adm-header {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; margin-bottom: 20px;
        }
        .adm-title { margin: 0; font-size: 22px; font-weight: 700; color: #242424; }
        .adm-count {
          margin-left: 8px; font-size: 13px; font-weight: 600;
          color: #3a4f6a; background: #eef2f6; border-radius: 999px;
          padding: 2px 10px; vertical-align: middle;
        }
        .adm-toolbar {
          display: flex; flex-wrap: wrap; align-items: center;
          gap: 10px; margin-bottom: 16px;
        }
        .adm-search {
          flex: 1; min-width: 220px; box-sizing: border-box;
          padding: 9px 12px; border: 1px solid #dedede; border-radius: 6px;
          background: #fff; font-size: 14px; color: #242424;
        }
        .adm-search:focus {
          outline: none; border-color: #3a4f6a;
          box-shadow: 0 0 0 2px rgba(58, 79, 106, 0.15);
        }
        .adm-btn {
          padding: 9px 16px; border-radius: 6px; border: 1px solid #dedede;
          background: #fff; color: #242424; font-size: 14px;
          font-weight: 600; cursor: pointer; white-space: nowrap;
        }
        .adm-btn:hover { border-color: #3a4f6a; color: #3a4f6a; }
        .adm-btn:disabled { opacity: 0.55; cursor: default; }
        .adm-btn-primary { background: #3a4f6a; border-color: #3a4f6a; color: #fff; }
        .adm-btn-primary:hover { background: #2e3f55; border-color: #2e3f55; color: #fff; }
        .adm-btn-danger { color: #c0392b; }
        .adm-btn-danger:hover { border-color: #c0392b; color: #c0392b; }

        .adm-card { background: #fff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
        .adm-table-wrap { overflow-x: auto; }
        .adm-table { width: 100%; border-collapse: collapse; }
        .adm-table th, .adm-table td {
          padding: 10px 12px; border-bottom: 1px solid #eee;
          text-align: left; vertical-align: middle;
        }
        .adm-table th {
          background: #fafafa; color: #3a4f6a; font-weight: 600;
          white-space: nowrap; font-size: 13px;
        }
        .adm-table tr:last-child td { border-bottom: none; }
        .adm-thumb {
          width: 60px; height: 60px; object-fit: cover; display: block;
          border-radius: 6px; border: 1px solid #dedede; background: #f2f2f2;
        }
        .adm-thumb-empty {
          width: 60px; height: 60px; display: flex; align-items: center;
          justify-content: center; border-radius: 6px; border: 1px dashed #dedede;
          background: #f6f6f6; color: #bbb; font-size: 20px;
        }
        .adm-title-cell { font-weight: 600; }
        .adm-cat { color: #555; font-size: 13px; }
        .adm-old { text-decoration: line-through; color: #999; margin-left: 6px; }
        .adm-badge {
          display: inline-block; padding: 2px 8px; border-radius: 999px;
          background: #eef2f6; color: #3a4f6a; font-size: 12px; font-weight: 600;
        }
        .adm-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .adm-link-btn {
          background: none; border: none; padding: 0; cursor: pointer;
          color: #3a4f6a; font-size: 13px; text-decoration: underline;
        }
        .adm-link-btn:hover { color: #2e3f55; }
        .adm-link-danger { color: #c0392b; }
        .adm-link-danger:hover { color: #a02f22; }

        .adm-status { padding: 48px 16px; text-align: center; color: #777; }
        .adm-status .adm-retry { margin-top: 12px; }

        .adm-field { margin-bottom: 14px; }
        .adm-label {
          display: block; font-size: 13px; font-weight: 600;
          color: #3a4f6a; margin-bottom: 6px;
        }
        .adm-required { color: #c0392b; }
        .adm-input {
          width: 100%; box-sizing: border-box; padding: 9px 12px;
          border: 1px solid #dedede; border-radius: 6px;
          background: #fff; font-size: 14px; color: #242424;
        }
        .adm-input:focus {
          outline: none; border-color: #3a4f6a;
          box-shadow: 0 0 0 2px rgba(58, 79, 106, 0.15);
        }
        .adm-hint { font-size: 12px; color: #888; margin-top: 4px; }
        .adm-form-error { color: #c0392b; font-size: 13px; margin: 4px 0 0; }
        .adm-form-actions {
          display: flex; gap: 10px; justify-content: flex-end; margin-top: 18px;
        }

        .adm-photo-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
          gap: 14px;
        }
        .adm-photo-item { position: relative; }
        .adm-photo-item img {
          width: 100%; height: 104px; object-fit: cover;
          border-radius: 8px; border: 1px solid #dedede; background: #f2f2f2;
        }
        .adm-photo-del {
          position: absolute; top: -8px; right: -8px; width: 22px; height: 22px;
          border-radius: 50%; background: #c0392b; color: #fff;
          border: 2px solid #fff; cursor: pointer; font-size: 13px; line-height: 1;
          padding: 0; display: flex; align-items: center; justify-content: center;
        }
        .adm-photo-del:hover { background: #a02f22; }
      `}</style>

      {/* Шапка */}
      <div className="adm-header">
        <h1 className="adm-title">
          Каталог
          {products !== null && <span className="adm-count">{products.length}</span>}
        </h1>
        <button className="adm-btn" onClick={logout} type="button">
          Выйти
        </button>
      </div>

      {/* Панель действий */}
      <div className="adm-toolbar">
        <input
          className="adm-search"
          type="search"
          placeholder="Поиск по названию…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="adm-btn adm-btn-primary" type="button" onClick={() => setAddOpen(true)}>
          + Добавить товар
        </button>
        <button className="adm-btn" type="button" onClick={() => void seed()} disabled={busy}>
          Загрузить товары из кода
        </button>
      </div>

      {/* Загрузка */}
      {loading && products === null && (
        <div className="adm-card adm-status">Загрузка товаров…</div>
      )}

      {/* Ошибка загрузки */}
      {!loading && loadError !== "" && (
        <div className="adm-card adm-status">
          <div>{loadError}</div>
          <button className="adm-btn adm-retry" type="button" onClick={() => void load(q)}>
            Повторить
          </button>
        </div>
      )}

      {/* Таблица */}
      {!loading && loadError === "" && products !== null && (
        <div className="adm-card adm-table-wrap">
          {products.length === 0 ? (
            <div className="adm-status">Товары не найдены</div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Фото</th>
                  <th>Название</th>
                  <th>Цена</th>
                  <th>Старая цена</th>
                  <th>Бейдж</th>
                  <th>Категория</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.gallery && p.gallery.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="adm-thumb" src={p.gallery[0]} alt={p.title} />
                      ) : (
                        <div className="adm-thumb-empty" title="Нет фото">
                          Фото
                        </div>
                      )}
                    </td>
                    <td className="adm-title-cell">{p.title}</td>
                    <td>{fmtPrice(p.price)} MDL</td>
                    <td>
                      {p.priceold != null && p.priceold > 0 ? (
                        <span className="adm-old">{fmtPrice(p.priceold)} MDL</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{p.mark ? <span className="adm-badge">{p.mark}</span> : "—"}</td>
                    <td className="adm-cat">{p.category || "—"}</td>
                    <td>
                      <div className="adm-actions">
                        <button className="adm-link-btn" type="button" onClick={() => openEdit(p)}>
                          Изменить цену
                        </button>
                        <button
                          className="adm-link-btn"
                          type="button"
                          onClick={() => setPhotosProduct(p)}
                        >
                          Удалить фото
                        </button>
                        <button
                          className="adm-link-btn adm-link-danger"
                          type="button"
                          onClick={() => void deleteProduct(p)}
                        >
                          Удалить товар
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Добавление товара */}
      {addOpen && (
        <Modal title="Добавить товар" onClose={() => setAddOpen(false)}>
          <form onSubmit={(e) => void submitAdd(e)}>
            <div className="adm-field">
              <label className="adm-label" htmlFor="adm-add-title">
                Название <span className="adm-required">*</span>
              </label>
              <input
                id="adm-add-title"
                className="adm-input"
                value={addForm.title}
                onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                placeholder="Например: Комплект постельного белья «Сатин» 2-спальный"
              />
            </div>
            <div className="adm-field">
              <label className="adm-label" htmlFor="adm-add-price">
                Цена MDL <span className="adm-required">*</span>
              </label>
              <input
                id="adm-add-price"
                className="adm-input"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={addForm.price}
                onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                placeholder="Например: 1250"
              />
            </div>
            <div className="adm-field">
              <label className="adm-label" htmlFor="adm-add-priceold">
                Старая цена MDL
              </label>
              <input
                id="adm-add-priceold"
                className="adm-input"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={addForm.priceold}
                onChange={(e) => setAddForm({ ...addForm, priceold: e.target.value })}
                placeholder="Например: 1500"
              />
              <div className="adm-hint">Необязательно. Показывается зачёркнутой рядом с ценой.</div>
            </div>
            <div className="adm-field">
              <label className="adm-label" htmlFor="adm-add-mark">
                Бейдж
              </label>
              <input
                id="adm-add-mark"
                className="adm-input"
                value={addForm.mark}
                onChange={(e) => setAddForm({ ...addForm, mark: e.target.value })}
                placeholder="Например: Выгода 10%"
              />
              <div className="adm-hint">Необязательно. Короткая плашка над названием.</div>
            </div>
            <div className="adm-field">
              <label className="adm-label" htmlFor="adm-add-category">
                Категория
              </label>
              <input
                id="adm-add-category"
                className="adm-input"
                value={addForm.category}
                onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                placeholder="Например: Комплект / Пододеяльник / Простынь / Наволочки"
              />
            </div>
            <div className="adm-field">
              <label className="adm-label" htmlFor="adm-add-fabric">
                Ткань
              </label>
              <input
                id="adm-add-fabric"
                className="adm-input"
                value={addForm.fabric}
                onChange={(e) => setAddForm({ ...addForm, fabric: e.target.value })}
                placeholder="Например: sateen / ranforce / sateen-stripe"
              />
            </div>
            <div className="adm-field">
              <label className="adm-label" htmlFor="adm-add-photo">
                Фото <span className="adm-required">*</span>
              </label>
              <input
                id="adm-add-photo"
                className="adm-input"
                type="file"
                accept="image/*"
                onChange={(e) => setAddPhoto(e.target.files?.[0] ?? null)}
              />
              <div className="adm-hint">Один файл изображения.</div>
            </div>
            {addError && <p className="adm-form-error">{addError}</p>}
            <div className="adm-form-actions">
              <button className="adm-btn" type="button" onClick={() => setAddOpen(false)}>
                Отмена
              </button>
              <button className="adm-btn adm-btn-primary" type="submit" disabled={adding}>
                {adding ? "Добавление…" : "Добавить"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Изменение цены */}
      {editProduct && (
        <Modal title={`Изменить цену — ${editProduct.title}`} onClose={() => setEditProduct(null)}>
          <form onSubmit={(e) => void submitEdit(e)}>
            <div className="adm-field">
              <label className="adm-label" htmlFor="adm-edit-price">
                Цена MDL <span className="adm-required">*</span>
              </label>
              <input
                id="adm-edit-price"
                className="adm-input"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              />
            </div>
            <div className="adm-field">
              <label className="adm-label" htmlFor="adm-edit-priceold">
                Старая цена MDL
              </label>
              <input
                id="adm-edit-priceold"
                className="adm-input"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={editForm.priceold}
                onChange={(e) => setEditForm({ ...editForm, priceold: e.target.value })}
              />
              <div className="adm-hint">Пустое поле — старая цена будет убрана.</div>
            </div>
            <div className="adm-field">
              <label className="adm-label" htmlFor="adm-edit-mark">
                Бейдж
              </label>
              <input
                id="adm-edit-mark"
                className="adm-input"
                value={editForm.mark}
                onChange={(e) => setEditForm({ ...editForm, mark: e.target.value })}
                placeholder="Например: Выгода 10%"
              />
            </div>
            {editError && <p className="adm-form-error">{editError}</p>}
            <div className="adm-form-actions">
              <button className="adm-btn" type="button" onClick={() => setEditProduct(null)}>
                Отмена
              </button>
              <button className="adm-btn adm-btn-primary" type="submit" disabled={editing}>
                {editing ? "Сохранение…" : "Сохранить"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Удаление фото */}
      {photosProduct && (
        <Modal
          title={`Фото — ${photosProduct.title}`}
          wide
          onClose={() => setPhotosProduct(null)}
        >
          {photosProduct.gallery.length === 0 ? (
            <div className="adm-status">У товара нет фото.</div>
          ) : (
            <div className="adm-photo-grid">
              {photosProduct.gallery.map((url) => (
                <div className="adm-photo-item" key={url}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="Фото товара" />
                  <button
                    className="adm-photo-del"
                    type="button"
                    title="Удалить фото"
                    disabled={busy}
                    onClick={() => void deletePhoto(photosProduct, url)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="adm-form-actions">
            <button className="adm-btn" type="button" onClick={() => setPhotosProduct(null)}>
              Закрыть
            </button>
          </div>
        </Modal>
      )}

      {/* Отзывы на модерации */}
      <div className="adm-card" style={{ marginTop: 24 }}>
        <div className="adm-header" style={{ padding: "14px 20px", marginBottom: 0 }}>
          <h2 className="adm-title" style={{ fontSize: 18 }}>
            Отзывы на модерации
            {pendingReviews !== null && (
              <span className="adm-count">{pendingReviews.length}</span>
            )}
          </h2>
          <button className="adm-btn" type="button" onClick={() => void loadReviews()}>
            Обновить
          </button>
        </div>
        {reviewsLoading && pendingReviews === null ? (
          <div className="adm-status">Загрузка отзывов…</div>
        ) : pendingReviews === null || pendingReviews.length === 0 ? (
          <div className="adm-status">Нет отзывов на модерации</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Имя</th>
                  <th>Город</th>
                  <th>Рейтинг</th>
                  <th>Текст</th>
                  <th>Товар</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {pendingReviews.map((r) => (
                  <tr key={r.id}>
                    <td style={{ whiteSpace: "nowrap", fontSize: 13 }}>
                      {new Date(r.created_at).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="adm-title-cell">{r.name}</td>
                    <td>{r.city || "—"}</td>
                    <td>{"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}</td>
                    <td style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.text}
                    </td>
                    <td style={{ fontSize: 13 }}>{r.product_uid || "—"}</td>
                    <td>
                      <div className="adm-actions">
                        <button
                          className="adm-link-btn"
                          style={{ color: "#2e7d32" }}
                          type="button"
                          onClick={() => void approveReview(r.id)}
                        >
                          Одобрить
                        </button>
                        <button
                          className="adm-link-btn adm-link-danger"
                          type="button"
                          onClick={() => void rejectReview(r.id)}
                        >
                          Отклонить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Toast message={toast?.message ?? ""} type={toast?.type ?? "ok"} />
    </div>
  );
}
