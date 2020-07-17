"use strict";

// LOADING ICON
const manualTrigger = document.querySelector('#manual');
manualTrigger.addEventListener('submit', () => {
  console.log('contribute submit triggered');


  const manualInput = document.querySelector('#manualInput').value;
  const resultOrder = document.querySelector('#resultOrder').value;
  console.log(manualInput);
  console.log(resultOrder);
  // console.log(JSON.parse(`[${manualInput}]`));
  // TODO finish this stuff, but only if the square is actually new!!

  const syncText = `contribution-${resultOrder}`;
  console.log(syncText);

  navigator.serviceWorker.ready.then(swRegistration => {
    return swRegistration.sync.register(syncText);
  });

  loading.classList.add('show');
});
