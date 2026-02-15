/* Minimal service worker for Buddy’s Treehouse (PWA)
   - cache-first for same-origin GET requests
   - avoids aggressive caching of cross-origin resources
*/

const CACHE_NAME = 'buddy-treehouse-v2';
// Keep core cache conservative to avoid iOS PWA getting stuck on old HTML/JS.
const CORE_ASSETS = [
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(CORE_ASSETS);
      self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))));
      self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // For navigations (HTML), always try network first so updates land reliably on iOS.
  const isNav = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      if (isNav) {
        try {
          const fresh = await fetch(req);
          if (fresh && fresh.ok) return fresh;
        } catch {
          // ignore
        }
        return (
          (await cache.match('/index.html')) ||
          (await cache.match('/')) ||
          (await fetch('/'))
        );
      }

      // For other same-origin assets, cache-first.
      const cached = await cache.match(req);
      if (cached) return cached;

      const res = await fetch(req);
      if (res && res.ok && (res.type === 'basic' || res.type === 'default')) {
        cache.put(req, res.clone());
      }
      return res;
    })(),
  );
});
