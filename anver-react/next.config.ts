import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @supabase/supabase-js подключается динамически в route handlers
  // (см. lib/supabase.ts). Пакет пока не установлен — оставляем импорт
  // нативным для Node.js, чтобы сборка не пыталась его резолвить.
  serverExternalPackages: ["@supabase/supabase-js"],
};

export default nextConfig;
