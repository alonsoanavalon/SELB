const CACHE_NAME = 'sw-cache-example';
const toCache = [
  './',
  '/css/styles.css',
  '/js/index.js',
  '/js/pwa.js',
  '/js/pwa.webmanifest',
  '/images/app_logo.png',
  '/views/index.hbs',
  '/views/admin.hbs',
  '/views/layouts/main.hbs',
  '/views/signin.hbs',
  '/views/signup.hbs',
  '/views/partials/footer.hbs',
  '/views/partials/header.hbs',
  '/views/test.hbs',
  '/views/test2.hbs'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(toCache)
      })
      .then(self.skipWaiting())
  )
})

  
self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request)
  .then(cachedResponse => {
    return cachedResponse || fetch(event.request);
  })
  );
});

/*   event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.match('/views/test')
            return cache.match(event.request, {ignoreSearch:true})
          })
      })
  ) */

  
  self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys()
        .then((keyList) => {
          return Promise.all(keyList.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('[ServiceWorker] Removing old cache', key)
              return caches.delete(key)
            }
          }))
        })
        .then(() => self.clients.claim())
    )
  })

