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





const settings = {
  "order":      "4",
  "style":      "blocks",
  "size":       "200px",
  "gap":        "20px",
  "background": "#666666",
  "stroke":     "#FFFFFF",
  "salpha":     "1",
  "fill":       "#000000",
  "falpha":     "0",
  "animation":  "off",
  "speed":      "50"
}






// ORDER OPTIONS

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
  loading.classList.add('show')
  displaySVGs(getCurrent('order'),getCurrent('style'));
  settings.order = getCurrent('order');
  saveSettings(settings);
  event.preventDefault();
})






// STYLE OPTIONS

displayTriggers.forEach( ds => {
  ds.addEventListener('change', () => { 
    displaySVGs(getCurrent('order'),getCurrent('style'));
  });
});

displaySVGs( getCurrent('order'),getCurrent('style') );

async function displaySVGs(order,style) {
  try {
    let offset = 0;
    squares.innerHTML = '';
    await getData(order,style,offset);
  } catch (error) { console.log(error) }
  finally { 
    loading.classList.remove('show');
  }
}

async function getData(order,style,offset) {
  try {
    // console.log(`Loading squares ${offset} - ${offset + 200}`);
    // fix order 4 unique/all choice subsubmenu
    if (order === '4' && style === 'quadvertex' && unique.checked) 
      style = 'unique';
    if (order === '4' && style === 'quadvertex' && all.checked) 
      style = 'quadvertex';
    (order === '4' && (style === 'quadvertex' || style === 'unique'))
      ? opt.classList.remove('hide')
      : opt.classList.add('hide');
    const url = `http://localhost:3000/data/${order}/${style}/${offset}`;
    const rawData = await fetch(url);
    const data = await rawData.json();
    for (let i in data.rows) {
      const elem = data.rows[i].value.svg;
      squares.insertAdjacentHTML('beforeend',elem);
    }
    // only add sentinel if we have more results left
    if(data.rows.length === 200) {
      const io = new IntersectionObserver(
        entries => {
          if(entries[0].isIntersecting) {
            // console.log(entries[0].target, entries[0]);
            offset += 200;
            getData(getCurrent('order'),getCurrent('style'),offset);
            io.unobserve(entries[0].target);
          }
        },{}
      );
      const sentinel = document.createElement('div');
      sentinel.classList.add(`sentinel${offset}`);
      squares.appendChild(sentinel);
      io.observe(sentinel);
    }
  } catch (error) { console.log(error) }
}




//  SIZE OPTIONS

const size = document.getElementById('size');
const space = document.getElementById('space');





















// UTILITY

function getCurrent(thing) {
  switch (thing) {
    case 'order':
      return displayOrder[displayOrder.selectedIndex].value;
    case 'style':
      return document.querySelector('input[name="displayStyle"]:checked').id;
    case 'amount':
      return document.querySelector('input[name="displayAmount"]:checked').id;
  }
}





function saveSettings(settingsJSON) {

  const settingsString = JSON.stringify(settingsJSON);
  localStorage.setItem("magicSettings", settingsString);
  console.log("saving", settingsJSON);

}

function getSettings() {

  const settingsString = localStorage.getItem("magicSettings");
  const settingsJSON = JSON.parse(settingsString);
  console.log("retrieving", settingsJSON);
  return settingsJSON;

}












// setTimeout(function(){




//   const x = document.getElementsByTagName('circle');
//   // console.dir(x);

//   // console.log(x.children);
//   for (let child of x) {

//     console.dir(child);
//     console.log(child.attributes.fill.value);
//     // console.log(child.attributes.x.value);
//     // console.log(child.attributes.y.value);
//     // console.log(child.innerHTML);

//     if( child.attributes.fill.value !== '#091540' ) {

//       child.attributes.fill.value = 'none'

//     }





//   };



// }, 500); 