'use strict';


// console.log('Inside service worker script!');



const cacheName = 'magic-v1';
const precacheResources = [
  '/',
  // '/views/base.njk',
  // '/views/home.njk',
  '/meta/js/general.js',
  '/meta/js/home.js',
  '/meta/css/styles.css',
  '/meta/imgs/favicons/site.webmanifest',
  '/meta/imgs/favicons/android-chrome-192x192.png',
  '/meta/imgs/favicons/favicon.ico',
  '/meta/imgs/favicons/favicon-32x32.png',
  '/meta/imgs/favicons/favicon-16x16.png',
  '/meta/imgs/logo.svg',
  '/meta/imgs/o3s1n.svg',
  '/meta/imgs/o3s1s.svg',
  '/meta/imgs/o3s1qv.svg',
  '/meta/imgs/o3s1ql.svg',
  '/meta/imgs/o3s1a.svg',
  '/meta/imgs/o3s1aa.svg',
  '/meta/imgs/o3s1c.svg',
  '/meta/imgs/o3s1b.svg',
  '/meta/imgs/o3s1t.svg',
  '/meta/imgs/spinning-arc.svg',
  '/data/4/unique/0',
  '/data/themes'
];

self.addEventListener('install', event => {
  // console.log('Service worker install event!');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(precacheResources);
      })
  );
});

self.addEventListener('activate', event => {
  // console.log('Service worker activate event!');
});

self.addEventListener('fetch', event => {
  // console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
    );
});


// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.open(cacheName).then(function(cache) {
//       return fetch(event.request).then(function(response) {
//         cache.put(event.request, response.clone());
//         return response;
//       });
//     })
//   );
// });