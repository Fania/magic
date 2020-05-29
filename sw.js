'use strict';


// console.log('Inside service worker script!');

const cacheVersion = 'v0.1';
const cacheName = 'magic-' + cacheVersion;
const precacheResources = [
  '/',
  '/meta/js/general.js',
  '/meta/js/home.js',
  '/meta/css/styles.css',
  '/data/4/unique/0',
  '/data/themes'
];

const staticVersion = 'v0.1';
const staticName = 'magicStatic-' + staticVersion;
const staticResources = [
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
  '/meta/imgs/spinning-arc.svg'
];


// add new cache(s)
addEventListener('install', event => {
  console.log('[Service Worker] installed!');
  skipWaiting();
  event.waitUntil(
    cacheAssets(cacheName, precacheResources)
  );
  event.waitUntil(
    cacheAssets(staticName, staticResources)
  );
});


// delete old cache(s)
addEventListener('activate', event => {
  console.log('[Service Worker] activate and delete old!');
  const whitelist = [cacheName,staticName];
  event.waitUntil(
    caches.keys().then( names => {
      return Promise.all(
        names.map( cn => {
          if (whitelist.indexOf(cn) === -1) {
            return caches.delete(cn);
          }
        })
      );
    })
  );
});


// addEventListener('sync', event => {
//   console.log('[Service Worker] Synced by', event.tag);
//   if (event.tag == 'update-assets') {
//     event.waitUntil(
//       cacheAssets(cacheName, precacheResources)
//     );
//   }
// });

// https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers
addEventListener('fetch', event => {
  // console.log('[Service Worker] Fetching ', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        // CACHE > NETWORK
        if (cachedResponse) {
          // console.log('[Service Worker] from CACHE');
          return cachedResponse
        } else {
          console.log('[Service Worker] Fetch from NETWORK ', event.request.url);
          return fetch(event.request)
        }
        // return cachedResponse || fetch(event.request);
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


async function getCache(req) {
  console.log('[Service Worker] Retrieving cache ', name);
  // caches.match(event.request)
  const cache = await caches.open(name);
  return await cache.match(req);
}

async function cacheAssets(name, things) {
  console.log('[Service Worker] Caching ', name);
  const cache = await caches.open(name);
  return cache.addAll(things);
}