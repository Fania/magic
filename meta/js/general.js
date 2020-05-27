'use strict';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => {
        // console.log('Service worker registered! 😎', reg);
        // console.log('SW scope:', reg.scope);
      })
      .catch(err => {
        // console.log('😥 Service worker registration failed: ', err);
      });
  });
}


// CACHE THEN NETWORK approach
// https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker
// let networkDataReceived = false;
// // startSpinner();

// // fetch fresh data
// let networkUpdate = fetch('/data.json').then(function(response) {
//   return response.json();
// }).then(function(data) {
//   networkDataReceived = true;
//   updatePage(data);
// });

// // fetch cached data
// caches.match('magic-v1').then(function(response) {
//   if (!response) throw Error("No data");
//   return response.json();
// }).then(function(data) {
//   // don't overwrite newer network data
//   if (!networkDataReceived) {
//     updatePage(data);
//   }
// }).catch(function() {
//   // we didn't get cached data, the network is our last hope:
//   return networkUpdate;
// }).catch(showErrorMessage).then(stopSpinner());




hamburger.addEventListener('click', ()=> {
  mainnav.classList.toggle('show');
})
subway.addEventListener('click', ()=> {
  const subnav = document.querySelector('.submenu');
  subnav.classList.toggle('show');
})