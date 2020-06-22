'use strict';

const cacheName = 'magic-v0.2';

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
  '/meta/imgs/favicons/android-chrome-192x192.png',
  '/meta/imgs/favicons/favicon-32x32.png',
  '/meta/imgs/favicons/favicon-16x16.png',
  '/meta/imgs/favicons/site.webmanifest',
  '/meta/imgs/favicons/favicon.ico',
  '/meta/imgs/spinning-arc.svg',
  '/meta/imgs/logo.svg'
];


// add new cache(s)
addEventListener('install', event => {
  console.log('[Service Worker] installing...');
  event.waitUntil( cacheAllThings() );
  skipWaiting();
});


// delete old cache(s)
addEventListener('activate', event => {
  console.log('[Service Worker] activating...');
  const whitelist = [cacheName];
  event.waitUntil(
    caches.keys().then( names => {
      return Promise.all(
        names.map( cn => {
          if (whitelist.indexOf(cn) === -1) {
            console.log('[Service Worker] deleting ', cn);
            return caches.delete(cn);
          }
        })
      );
    })
  );
  // event.waitUntil(requestReload());
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
// addEventListener('fetch', event => {
//   // console.log('[Service Worker] Fetching ', event.request.url);
//   event.respondWith(caches.match(event.request)
//     .then(cachedResponse => {
//         // CACHE > NETWORK
//         if (cachedResponse) {
//           // console.log('[Service Worker] from CACHE');
//           return cachedResponse
//         } else {
//           console.log('[Service Worker] Fetch from NETWORK ', event.request.url);
//           // updateDataResources();
//           return fetch(event.request)
//         }
//         // return cachedResponse || fetch(event.request);
//       })
//     );
// });


addEventListener('fetch', event => {
  // console.log('[Service Worker] fetching/serving assets');
  // respondWith() for ASAP answer from cache
  event.respondWith(
    serveFromCache(event.request)
  );
  // don't put SW to sleep until we've done the following
  event.waitUntil(
    updateCacheFromNetwork(event.request)
      // .then(requestRefresh)
  );
});



// automatically add any new things to cache
// careful, this will add all images and videos too, not just data
// addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request)
//       .then((r) => {
//         console.log('[Service Worker] Fetching NETWORK resource: ' + event.request.url);
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


// async function getCache(req) {
//   console.log('[Service Worker] retrieving ', cacheName);
//   // caches.match(event.request)
//   const cache = await caches.open(cacheName);
//   return await cache.match(req);
// }

// async function cacheAssets(name,things) {
//   console.log('[Service Worker] caching ', name);
//   const cache = await caches.open(name);
//   return cache.addAll(things);
// }

async function cacheAllThings() {
  console.log('[Service Worker] caching ...');
  const cache = await caches.open(cacheName);
  cache.addAll(postcacheResources.concat(dataResources));
  // updateDataResources();
  return cache.addAll(precacheResources.concat(staticResources));
}





// CACHE, UPDATE AND REFRESH

async function serveFromCache(request) {
  // console.log(`[Service Worker] serving from CACHE: ${request.url}`);
  const cache = await caches.open(cacheName);
  // get it from cache or fetch from network if new
  return await cache.match(request) || await fetch(request);
}

async function updateCacheFromNetwork(request) {
  // console.log(`[Service Worker] updating CACHE from NETWORK: ${request.url}`);
  const cache = await caches.open(cacheName);
  const fullurl = new URL(request.url)
  const resource = fullurl.pathname;
  // const thing = await cache.match(resource) || await fetch(request);
  let thing = await cache.match(resource);
  if (thing === undefined) {
    thing = await fetch(request);
    await cache.put(request, thing);
  }
  const oldEtag = thing.headers.get('ETag');
  const response = await fetch(request);
  const newEtag = response.headers.get('ETag');

  // only update and refresh changed resources
    // console.log('old: ' + oldEtag);
    // console.log('new: ' + newEtag);
    // console.log('source: ' + resource);
  if (oldEtag !== newEtag) {
    console.log('old: ' + oldEtag);
    console.log('new: ' + newEtag);
    console.log('source: ' + resource);
    // responses are one-time use so clone
    await cache.put(request, response.clone());
    await requestRefresh(response.clone());
  }
  // return response;
}

async function requestRefresh(response) {
  // console.log(`[Service Worker] post cache refresh message ${response.url}`);
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    const message = {
      type: 'refresh',
      url: response.url,
      eTag: response.headers.get('ETag')
    };
    client.postMessage(JSON.stringify(message));
  });
}
// async function requestReload() {
//   console.log(`[Service Worker] post cache reload message`);
//   const clients = await self.clients.matchAll();
//   clients.forEach(client => {
//     const message = { type: 'reload', url: '/whole/site' };
//     client.postMessage(JSON.stringify(message));
//   });
// }

