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
const extraStyles = document.getElementById('extraStyles');


// LOADING ICON TRIGGERS

loadingTriggers.forEach( lt => 
  lt.addEventListener('change', () => loading.classList.add('show') )
);



// FIRST LOAD

updateOptions();
loadSVGs(getCurrent('order'),getCurrent('style'));
adjustSize();








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
  const settings = getSettings();
  settings.order = parseInt(displayOrder[displayOrder.selectedIndex].value);
  saveSettings(settings);
  loadSVGs(getCurrent('order'),getCurrent('style'));
  event.preventDefault();
})






// STYLE OPTIONS

displayTriggers.forEach( ds => {
  ds.addEventListener('change', () => { 
    const settings = getSettings();
    settings.style = document.querySelector('input[name="displayStyle"]:checked').id;
    saveSettings(settings);
    loadSVGs(getCurrent('order'),getCurrent('style'));
  });
});

async function loadSVGs(order,style) {
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
size.addEventListener('input', adjustSize);
function adjustSize() {
  const settings = getSettings();
  settings.size = parseInt(document.getElementById('size').value);
  saveSettings(settings);
  updateStyles();
  // extraStyles.innerText = `svg { width: ${settings.size}% }`;
}


function updateStyles() {

  const [...rules] = document.styleSheets[0].cssRules;
  // const svgRule = [...rules].find(rule => rule.selectorText === "svg");
  // console.log('svgRule', svgRule)
  const svgRuleIndex = rules.findIndex(rule => rule.selectorText === "svg");
  console.log('svgRuleIndex', svgRuleIndex);
  document.styleSheets[0].deleteRule(svgRuleIndex)

  // update all setting styles here
  // 
  const text = `svg {
    stroke: red;
    width: ${getCurrent('size')}%;
  }`;

  document.styleSheets[0].insertRule(text, document.styleSheets[0].cssRules.length)

}









//  GAP OPTIONS

// const space = document.getElementById('space');
// space.addEventListener('input', adjustSpace);
// function adjustSpace() {
//   const settings = getSettings();
//   settings.size = document.getElementById('size').value;
//   saveSettings(settings);
//   extraStyles.innerText = `svg { width: ${settings.size}% }`;
// }

















// UTILITY

function getCurrent(thing) {
  const settings = getSettings();
  switch (thing) {
    case 'order':
      return settings.order;
    case 'style':
      return settings.style;
    case 'amount':
      return settings.amount;
    case 'size':
      return settings.size;
    case 'settings':
      return settings;
  }
}



function updateOptions() {
  // order
  displayOrder.selectedIndex = parseInt(getCurrent('order')) - 3;
  // style
  document.querySelector(`#${getCurrent('style')}`).checked = true;
  // size
  document.getElementById('size').value = getCurrent('size');
}




function saveSettings(settingsJSON) {
  const settingsString = JSON.stringify(settingsJSON);
  localStorage.setItem("magicSettings", settingsString);
  // console.log("saving", settingsJSON);
}

function getSettings() {
  const settingsString = localStorage.getItem("magicSettings");
  let settingsJSON = {};
  if (settingsString === null) {
    settingsJSON = { 
      "order":      4,
      "style":      "blocks",
      "amount":     383,
      "size":       "20",
      "gap":        20,
      "background": "#000000",
      "stroke":     "#FFFFFF",
      "salpha":     1,
      "fill":       "#666666",
      "falpha":     0,
      "animation":  "off",
      "speed":      50
    }
    saveSettings(settingsJSON);
    // console.log("first-time setup");
  } else {
    settingsJSON = JSON.parse(settingsString);
    // console.log("retrieving", settingsJSON);
  }
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