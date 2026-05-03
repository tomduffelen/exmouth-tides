const CACHE = 'exmouth-tides-v1';
const SHELL = [
  '/exmouth-tides/',
  '/exmouth-tides/index.html',
  '/exmouth-tides/manifest.json',
  '/exmouth-tides/logo.png',
  '/exmouth-tides/favicon.ico',
  '/exmouth-tides/favicon-16x16.png',
  '/exmouth-tides/favicon-32x32.png',
  '/exmouth-tides/apple-touch-icon.png',
  '/exmouth-tides/icon-192x192.png',
  '/exmouth-tides/icon-512x512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.hostname === 'www.worldtides.info') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res.ok && e.request.method === 'GET') {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
