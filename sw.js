const CACHE_NAME = 'thu-thach-van-v10';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './images/ollie.jpg', './images/fakie-ollie.jpg', './images/fs-180.jpg', './images/fakie-fs-180.jpg', './images/half-cab.jpg',
  './images/boneless.jpg', './images/pop-shuv.jpg', './images/caveman.jpg', './images/cave-shuv.jpg',
  './images/fingerflip.jpg', './images/v-plant.jpg', './images/valial-plant.jpg'
];

// Save the app shell into the cache as soon as the service worker installs.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

// Clean up old cache versions when a new service worker takes over.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first: serve from cache when offline, otherwise fetch and update the cache.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
