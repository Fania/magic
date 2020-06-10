'use strict';


// console.log('Inside service worker script!');

const cacheName = 'magic-v0.1';

const precacheResources = [
  '/',
  '/meta/js/general.js',
  '/meta/js/home.js',
  '/meta/css/styles.css'
];

const postcacheResources = [
  '/gallery',
  '/meta/js/gallery.js',
  '/contribute',
  '/meta/js/contribute.js',
  '/about'
];

const dataResources = [
  '/data/4/unique/0',
  '/data/themes'
];

const staticResources = [
  '/meta/imgs/favicons/site.webmanifest',
  '/meta/imgs/favicons/android-chrome-192x192.png',
  '/meta/imgs/favicons/favicon.ico',
  '/meta/imgs/favicons/favicon-32x32.png',
  '/meta/imgs/favicons/favicon-16x16.png',
  '/meta/imgs/logo.svg',
  '/meta/imgs/spinning-arc.svg'
];


// add new cache(s)
addEventListener('install', event => {
  console.log('[Service Worker] installed!');
  event.waitUntil( cacheAllThings() );
  skipWaiting();
});


// delete old cache(s)
addEventListener('activate', event => {
  console.log('[Service Worker] activating!');
  const whitelist = [cacheName];
  event.waitUntil(
    caches.keys().then( names => {
      return Promise.all(
        names.map( cn => {
          if (whitelist.indexOf(cn) === -1) {
            console.log('[SW] deleting ', cn);
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
          updateDataResources();
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
  console.log('[Service Worker] retrieving ', name);
  // caches.match(event.request)
  const cache = await caches.open(name);
  return await cache.match(req);
}

async function cacheAssets(name,things) {
  console.log('[Service Worker] caching ', name);
  const cache = await caches.open(name);
  return cache.addAll(things);
}
async function cacheAllThings() {
  console.log('[Service Worker] caching ...');
  const cache = await caches.open(cacheName);
  cache.addAll(postcacheResources.concat(dataResources));
  updateDataResources();
  return cache.addAll(precacheResources.concat(staticResources));
}


// IndexedDB
async function updateDataResources() {
  console.log('updating cache from IDB via service worker');
  const request = indexedDB.open('magic', 1);
  request.onerror = event => console.error(event.target.errorCode);
  request.onupgradeneeded = event => {
    const db = event.target.result;
    db.createObjectStore('settings');
  };
  request.onsuccess = event => {
    const db = event.target.result;
    const tx = db.transaction(['settings'], 'readonly');
    const store = tx.objectStore('settings');
    const item = store.get(1);
    item.onsuccess = async () => {
      const output = await item.result;
      const sty = output.amount === 'unique' && output.style === 'quadvertex' 
                  ? 'unique' : output.style;
      const url = `/data/${output.order}/${sty}/0`;
      // const url = `/data/${output.order}/${output.style}/0` || '/data/4/unique/0'
      const cache = await caches.open(cacheName);
      cache.add(url);
    };
    item.onerror = event => console.error(event.target.errorCode);
  };
}
