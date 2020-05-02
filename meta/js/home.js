'use strict';

const [...menuTriggers] = document.querySelectorAll('nav a');
const [...displayStyles] = document.getElementsByName('displayStyle');
const [...displayAmounts] = document.getElementsByName('displayAmount');
const displayOrder = document.getElementById('order');
const loadingTriggers = (menuTriggers.concat(displayStyles,displayOrder,displayAmounts)).flat(Infinity);
const displayTriggers = (displayStyles.concat(displayOrder,displayAmounts)).flat(Infinity);
const unique = document.getElementById('unique');
const all = document.getElementById('all');
const opt = document.getElementById('order4quadOptions');


// LOADING ICON TRIGGERS
loadingTriggers.forEach( lt => 
  lt.addEventListener('change', () => loading.classList.add('show') )
);

// DISPLAY TRIGGERS
displayTriggers.forEach( ds => {
  ds.addEventListener('change', () => { 
    displaySVGs(getCurrent('order'),getCurrent('style'));
  });
});


// default
displaySVGs( '4', 'quadvertex' );
// DISPLAY DATA
async function displaySVGs(order,style) {
  try {
    if (order === '4' && style === 'quadvertex' && unique.checked) 
      style = 'unique';
    if (order === '4' && style === 'quadvertex' && all.checked) 
      style = 'quadvertex';
    (order === '4' && (style === 'quadvertex' || style === 'unique'))
      ? opt.classList.remove('hide')
      : opt.classList.add('hide');
    squares.innerHTML = '';
    const url = `http://localhost:3000/data/${order}/${style}`;
    const rawData = await fetch(url);
    const data = await rawData.json();
    for (let i in data.rows) {
      const elem = data.rows[i].value.svg;
      squares.insertAdjacentHTML('beforeend',elem);
    }
  } catch (error) { console.log(error) }
  finally { 
    loading.classList.remove('show');
  }
}




function getCurrent(thing) {
  switch (thing) {
    case 'style':
      return document.querySelector('input[name="displayStyle"]:checked').id;
    case 'order':
      return displayOrder[displayOrder.selectedIndex].value;
    case 'amount':
      return document.querySelector('input[name="displayAmount"]:checked').id;
  }
}








displayOrder.addEventListener('wheel', () => {
  const totalOptions = displayOrder.length;
  let fromIndex = displayOrder.selectedIndex;
  if (Math.sign(event.deltaY) === 1) {
    let toIndex = (fromIndex + 1) % totalOptions;
    displayOrder.selectedIndex = toIndex;
  } else {
    if (fromIndex === 0) fromIndex = 18;
    let toIndex = (fromIndex - 1) % totalOptions;
    displayOrder.selectedIndex = toIndex;
  }
  event.preventDefault();
})