// Сборка без npm: копирует src → dist и подставляет {{ключи}} из content/site.json.
// Запуск: node build.mjs
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = import.meta.dirname;
const SRC = join(root, 'src');
const DIST = join(root, 'dist');
const TOKEN = /\{\{\s*([\w.]+)\s*\}\}/g;

const content = JSON.parse(await readFile(join(SRC, 'content/site.json'), 'utf8'));
const get = (path) =>
  path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), content);

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

const missing = new Set();
const outputs = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name === 'content') continue;

    const from = join(dir, entry.name);
    const to = join(DIST, relative(SRC, from));

    if (entry.isDirectory()) {
      await mkdir(to, { recursive: true });
      await walk(from);
      continue;
    }

    if (entry.name.endsWith('.html')) {
      const html = (await readFile(from, 'utf8')).replace(TOKEN, (match, key) => {
        const value = get(key);
        if (value === undefined) {
          missing.add(key);
          return match;
        }
        return String(value);
      });
      await writeFile(to, html);
    } else {
      await cp(from, to);
    }

    outputs.push(relative(DIST, to));
  }
}

await walk(SRC);

if (missing.size) {
  console.error('Сборка остановлена. Нет значений для:');
  for (const key of missing) console.error(`  {{${key}}} — добавьте в src/content/site.json`);
  process.exit(1);
}

console.log(`Готово: ${outputs.length} файлов в dist/`);
for (const file of outputs.filter((f) => f.endsWith('.html'))) console.log(`  dist/${file}`);
console.log('Открыть: open dist/index.html');
