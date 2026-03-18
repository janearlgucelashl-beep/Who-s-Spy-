const CACHE_NAME = 'spymind-v2';
const ASSETS = [
  'index.html',
  'manifest.json'
];

// 1. Install Phase
self.addEventListener('install', (e) => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 2. Activate Phase (Clean up old caches)
self.addEventListener('activate', (e) => {
  // Tell the new service worker to take control of the page immediately
  e.waitUntil(clients.claim());
  
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Fetch Phase
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});

