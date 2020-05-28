'use strict';


// console.log('Inside service worker script!');



const cacheName = 'magic-v1';
const precacheResources = [
  '/',
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
  // console.log('[Service Worker] install event!');
  event.waitUntil(
    cacheAssets(cacheName, precacheResources)
  );
});


// delete old cache
// self.addEventListener('activate', function(event) {
//   const cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1'];
//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.map(function(cacheName) {
//           if (cacheWhitelist.indexOf(cacheName) === -1) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });


self.addEventListener('sync', event => {
  // console.log('[Service Worker] Sync triggered by', event.tag);
  if (event.tag == 'update-assets') {
    event.waitUntil(
      cacheAssets(cacheName, precacheResources)
    );
  }
});

// https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers
self.addEventListener('fetch', event => {
  // console.log('[Service Worker] Fetching: ', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        // Check cache but fall back to network
        return cachedResponse || fetch(event.request);
      })
    );
});

// automatically add any new things to cache
// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request)
//       .then((r) => {
//         console.log('[Service Worker] Fetching resource: ' + event.request.url);
//         return r || fetch(event.request)
//           .then(async response => {
//             const cache = await caches.open(cacheName);
//             console.log('[Service Worker] Caching new resource: ' + event.request.url);
//             cache.put(event.request, response.clone());
//             return response;
//           });
//       })
//   );
// });



async function cacheAssets(name, things) {
  // console.log('[Service Worker] Caching files');
  const cache = await caches.open(name);
  return cache.addAll(things);
}