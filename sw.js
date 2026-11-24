/* Entrelinhas PWA 0.9 — armazena apenas a interface, nunca manuscritos nem tokens do Google. */
const CACHE = 'entrelinhas-app-shell-v29';
const ASSETS = ['./', './index.html', './manifest.json', './app.js', './pwa-register.js', './styles.css', './icon-192.png', './icon-512.png'];
const ROOT = new URL('./', self.location.href);
const KNOWN = new Set(ASSETS.map(path => new URL(path, ROOT).pathname));
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('entrelinhas-app-shell-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !KNOWN.has(url.pathname)) return;
  if (request.mode === 'navigate') {
    // Use a versão publicada quando houver internet; recorra ao cache se offline.
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE);
          await cache.put(new URL('./index.html', ROOT).href, response.clone());
          return response;
        }
      } catch (_) { /* sem conexão */ }
      return await caches.match(new URL('./index.html', ROOT).href)
        || new Response('Entrelinhas indisponível sem cache. Abra uma vez com internet.', {status:503, headers:{'Content-Type':'text/plain;charset=utf-8'}});
    })());
  } else {
    event.respondWith((async () => {
      const cached = await caches.match(request, {ignoreSearch:true});
      if (cached) return cached;
      return fetch(request);
    })());
  }
});
