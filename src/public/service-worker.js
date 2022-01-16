const CACHE_NAME = 'sw-cache-example';
const toCache = [
  './',
  '/images/app_logo.png',
  '/views/index.hbs',
  '/views/admin.hbs',
  '/views/layouts/main.hbs',
  '/views/signin.hbs',
  '/css/styles.css',
  '/js/index.js',
  '/js/pwa.js',
  '/pwa.webmanifest',
  '/views/partials/footer.hbs',
  '/views/partials/header.hbs'

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
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.match('/views/index.hbs')
            /* return cache.match(event.request, {ignoreSearch:true}) */
          })
      })
  )
})
  
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

