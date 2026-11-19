# Кромка

Демо-лендинг студии сайтов. Три страницы, Bootstrap, статика.

## Сборка

```bash
node build.mjs
open dist/index.html
```

`node build.mjs` пересобирает `dist/` из `src/`. Требуется только Node 20+,
никаких `npm install`.

## Что где

- `src/*.html` — страницы
- `src/content/site.json` — тексты, тарифы, контакты
- `src/assets/css/site.css` — стили поверх Bootstrap
- `src/assets/js/site.js` — мобильное меню и форма заявки
- `dist/` — результат сборки
