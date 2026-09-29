const CACHE = 'bsac-next-v1';
const CORE_ASSETS = [
  '/',
  '/apply',
  '/activities',
  '/connect',
  '/manifest.webmanifest',
  '/logo.png',
  '/app.png',
  '/welcome.png',
  '/about.png',
  '/bg1.png',
  '/bg2.png',
  '/bg3.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Cache files independently: one unavailable asset must not abort the whole install.
    await Promise.allSettled(CORE_ASSETS.map((asset) => cache.add(asset)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Videos are streamed with Range requests; partial (206) responses cannot be cached.
  if (request.headers.has('range') || request.destination === 'video') return;

  // Pages: network first so deployments show immediately, falling back to the cached copy offline.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request, { cache: 'no-store' });
        if (response && response.ok) {
          const cache = await caches.open(CACHE);
          await cache.put(url.pathname, response.clone());
        }
        return response;
      } catch {
        return (await caches.match(url.pathname)) || (await caches.match('/')) || Response.error();
      }
    })());
    return;
  }

  // Page data for client-side navigation changes with every deploy: also network first.
  if (url.searchParams.has('_rsc') || request.headers.get('RSC') === '1') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.status === 200) {
          const cache = await caches.open(CACHE);
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        return (await caches.match(request, { ignoreSearch: true })) || Response.error();
      }
    })());
    return;
  }

  // Everything else (hashed /_next/ bundles, images): cache first, refreshed in the background.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    const refresh = fetch(request).then(async (response) => {
      if (response && response.ok && response.status === 200) {
        const cache = await caches.open(CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    }).catch(() => null);
    if (cached) {
      event.waitUntil(refresh);
      return cached;
    }
    return (await refresh) || Response.error();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
