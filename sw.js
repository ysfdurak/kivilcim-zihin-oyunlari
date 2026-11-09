// Resolve assets against the installation scope, including GitHub Pages project paths.
const scope = new URL(self.registration.scope);
const cachePrefix = `kivilcim:${scope.pathname}:`;
const cacheName = `${cachePrefix}v2`;
const shell = scope.href;
const index = new URL('index.html', scope).href;
const shellUrls = new Set([shell, index]);
const core = [
  './', 'index.html', 'style.css', 'catalog.js', 'app.js', 'games.js',
  'workshop.js', 'deep.js', 'expansion.js', 'action.js', 'balance.js',
  'visuals.js', 'routes.js', 'arcade-plus.js', 'mobile.js', 'parking-data.js',
  'revamp.js', 'memory-plus.js', 'content.js', 'new-games.js', 'pwa.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png',
  'icons/apple-touch-icon.png',
].map(path => new URL(path, scope).href);
const coreUrls = new Set(core);

async function isAppShell(response) {
  if (!response.ok || response.redirected) return false;
  const html = await response.clone().text();
  return html.includes('id="shell"') && html.includes('memory-plus.js');
}

async function verifiedResponse(url) {
  const response = await fetch(new Request(url, { cache: 'reload', credentials: 'same-origin' }));
  if (!response.ok || response.redirected) throw new Error('Resource unavailable');
  if (shellUrls.has(url)) {
    if (!(await isAppShell(response))) throw new Error('Application shell unavailable');
  } else if (/\.(js|css|webmanifest)$/.test(url)) {
    const content = await response.clone().text();
    if (/^\s*</.test(content)) throw new Error('Unexpected HTML response');
  }
  return response;
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    try {
      for (const url of core) await cache.put(url, await verifiedResponse(url));
    } catch (error) {
      await caches.delete(cacheName);
      throw error;
    }
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(cachePrefix) && key !== cacheName)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'CHECK_OFFLINE') {
    event.waitUntil((async () => {
      const cache = await caches.open(cacheName);
      const entries = await Promise.all(core.map(url => cache.match(url)));
      event.ports[0]?.postMessage({ ready: entries.every(Boolean), version: cacheName });
    })());
  }
});

async function navigate(request) {
  const cache = await caches.open(cacheName);
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    let response;
    try {
      response = await fetch(request, { signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
    if (await isAppShell(response)) return (await cache.match(shell)) || response;
    return response;
  } catch {
    return (await cache.match(shell)) || new Response(
      'Kıvılcım bu cihazda henüz çevrimdışı kullanıma hazırlanmadı. İnternet bağlantısıyla bir kez aç.',
      { status: 503, headers: { 'Content-Type': 'text/plain;charset=utf-8' } },
    );
  }
}

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== scope.origin) return;
  const path = new URL(url.pathname, scope.origin).href;
  if (request.mode === 'navigate' && shellUrls.has(path)) {
    event.respondWith(navigate(request));
  } else if (coreUrls.has(url.href) && !shellUrls.has(url.href)) {
    event.respondWith(caches.open(cacheName).then(async cache =>
      (await cache.match(request)) || fetch(request),
    ));
  }
});
