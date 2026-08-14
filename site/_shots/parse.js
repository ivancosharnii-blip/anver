// Извлечение структуры Tilda-страницы: rec-блоки + типы + тексты + ключевые стили
const fs = require("fs");
const file = process.argv[2];
const html = fs.readFileSync(file, "utf8");

const starts = [...html.matchAll(/<div[^>]*id="(rec\d+)"[^>]*class="r t-rec"[^>]*data-record-type="(\d+)"/g)];
for (let i = 0; i < starts.length; i++) {
  const id = starts[i][1];
  const type = starts[i][2];
  const from = starts[i].index;
  const to = i + 1 < starts.length ? starts[i + 1].index : html.length;
  const chunk = html.slice(from, to);
  const texts = [...new Set([...chunk.matchAll(/>([^<>]{4,90})<\//g)].map((t) => t[1].replace(/&[a-z]+;/g, " ").trim()).filter((t) => t && !/^(t-|field|data-|http|\/\/)/.test(t)))].slice(0, 10);
  // цвета из style-блока
  const colors = [...new Set([...chunk.matchAll(/background-color:(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\))/g)].map((c) => c[1]))].slice(0, 4);
  console.log(`${id} type=${type}` + (texts.length ? " | " + texts.join(" • ") : "") + (colors.length ? " || colors: " + colors.join(",") : ""));
}
