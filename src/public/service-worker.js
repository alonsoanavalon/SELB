const staticCacheName = 'site-static';
const assets = [
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
  '/views/test2.hbs',
  './signin',
  './admin',
  './signup',
  './logout',
  './test1',
  './test2'


];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('caching shell assets')
      cache.addAll(assets)
    })
  )
})

   
self.addEventListener('fetch', event => {

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.open(staticCacheName)
          .then((cache) => {
            return cache.match(event.request, {ignoreSearch:true})
          })
      })
  )
});


/*   evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request)
    })
  ) */

/*   event.respondWith(caches.match(event.request)
  .then(cachedResponse => {
    return cachedResponse || fetch(event.request);
  })
  ); */

  


  
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

