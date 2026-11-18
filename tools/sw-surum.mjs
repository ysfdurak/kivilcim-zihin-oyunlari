// Service worker önbellek sürümünü uygulama dosyalarının içeriğinden üretir.
//
// Neden: Tarayıcı yeni sürümü yalnızca sw.js'in kendisi değiştiğinde fark eder.
// Önbellek adı sabit kalırsa (ör. "v4") oyun dosyası değişse bile kurulu kullanıcı
// eski kopyayla kalır. Bu betik sw.js'teki `core` listesindeki dosyaların özetini
// (SHA-256, ilk 12 karakter) önbellek adına yazar; herhangi bir dosya değişince
// sw.js de değişir ve güncelleme akışı ("Yeni sürüm hazır") tetiklenir.
//
// Kullanım:
//   node tools/sw-surum.mjs          # sürümü güncelle (yayından önce çalıştır)
//   node tools/sw-surum.mjs --check  # güncel değilse hata ver (CI)
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SW = join(ROOT, 'sw.js');
const check = process.argv.includes('--check');

const sw = readFileSync(SW, 'utf8');
const block = sw.match(/const core = \[([\s\S]*?)\]\.map/);
if (!block) throw new Error('sw.js içinde `const core = [...]` listesi bulunamadı');
const files = [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1]).filter((p) => p !== './');

// Kökteki her .js/.css dosyası önbellek listesinde olmalı; yoksa çevrimdışıda eksik kalır.
const skip = new Set(['sw.js']);
const missing = readdirSync(ROOT)
  .filter((f) => /\.(js|css)$/.test(f) && !skip.has(f) && !files.includes(f));
if (missing.length) {
  console.error(`sw.js core listesinde olmayan dosyalar: ${missing.join(', ')}`);
  process.exit(1);
}

const hash = createHash('sha256');
for (const f of files.sort()) {
  hash.update(f + '\0');
  hash.update(readFileSync(join(ROOT, f)));
  hash.update('\0');
}
const version = hash.digest('hex').slice(0, 12);

const re = /const cacheName = `\$\{cachePrefix\}[^`]*`;/;
if (!re.test(sw)) throw new Error('sw.js içinde cacheName satırı bulunamadı');
const next = sw.replace(re, `const cacheName = \`\${cachePrefix}${version}\`;`);

if (next === sw) {
  console.log(`Önbellek sürümü güncel: ${version}`);
} else if (check) {
  console.error(`sw.js önbellek sürümü güncel değil (beklenen ${version}). Çalıştır: node tools/sw-surum.mjs`);
  process.exit(1);
} else {
  writeFileSync(SW, next);
  console.log(`Önbellek sürümü yazıldı: ${version}`);
}
