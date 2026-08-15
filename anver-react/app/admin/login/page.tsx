"use client";

import { useState } from "react";
import type { FormEvent } from "react";

/**
 * Вход в админ-панель. POST /api/admin/auth {password}.
 * 200 → переход на /admin, 401 → «Неверный пароль».
 */

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password) {
      setError("Введите пароль.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 401) {
        setError("Неверный пароль");
        return;
      }
      if (!res.ok) {
        setError("Ошибка входа. Попробуйте ещё раз.");
        return;
      }
      window.location.href = "/admin";
    } catch {
      setError("Сеть недоступна. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-login">
      <style>{`
        .adm-login {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: #f2f2f2; padding: 20px;
        }
        .adm-login-card {
          background: #fff; border-radius: 12px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
          padding: 32px; width: 100%; max-width: 360px;
        }
        .adm-login-title {
          margin: 0 0 22px; font-size: 20px; font-weight: 700;
          color: #3a4f6a; text-align: center;
        }
        .adm-login-label {
          display: block; font-size: 13px; font-weight: 600;
          color: #242424; margin-bottom: 6px;
        }
        .adm-login-input {
          width: 100%; box-sizing: border-box;
          padding: 10px 12px; border: 1px solid #dedede; border-radius: 6px;
          font-size: 14px; color: #242424; background: #fff;
        }
        .adm-login-input:focus {
          outline: none; border-color: #3a4f6a;
          box-shadow: 0 0 0 2px rgba(58, 79, 106, 0.15);
        }
        .adm-login-error { margin: 12px 0 0; color: #c0392b; font-size: 13px; }
        .adm-login-btn {
          width: 100%; margin-top: 18px; padding: 11px 16px;
          background: #3a4f6a; color: #fff; border: none; border-radius: 6px;
          font-size: 15px; font-weight: 600; cursor: pointer;
        }
        .adm-login-btn:hover { background: #2e3f55; }
        .adm-login-btn:disabled { opacity: 0.55; cursor: default; }
      `}</style>

      <form className="adm-login-card" onSubmit={submit}>
        <h1 className="adm-login-title">Админ-панель Anver</h1>
        <label className="adm-login-label" htmlFor="adm-password">
          Пароль
        </label>
        <input
          id="adm-password"
          className="adm-login-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введите пароль"
          autoFocus
        />
        {error && <p className="adm-login-error">{error}</p>}
        <button className="adm-login-btn" type="submit" disabled={busy}>
          {busy ? "Проверка…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
