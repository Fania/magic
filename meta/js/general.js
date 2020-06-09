'use strict';

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', async () => {
//     await navigator.serviceWorker.register('sw.js');
//     // const resp = await navigator.serviceWorker.ready;
//     // resp.sync.register('update-assets');





//   });
// }




hamburger.addEventListener('click', ()=> {
  mainnav.classList.toggle('show');
  hamburger.classList.toggle('rotate');
})
subway.addEventListener('click', ()=> {
  const subnav = document.querySelector('.submenu');
  subnav.classList.toggle('show');
  subway.classList.toggle('rotate');
})

