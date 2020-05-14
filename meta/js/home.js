'use strict';

const [...menuTriggers] = document.querySelectorAll('nav a');
const [...displayStyles] = document.getElementsByName('style');
const [...displayAmounts] = document.getElementsByName('amount');
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




const defaults = { 
  "order":       4,
  "amount":      383,
  "style":       "blocks",
  "size":        "20",
  "gap":         "20",
  "overlap":     false,
  "background":  "#222222",
  "stroke":      "#FFFFFF",
  "strokeWidth": "2",
  "salpha":      "255",
  "fill":        "#666666",
  "falpha":      "0",
  "animation":   "off",
  "speed":       50
};





// FIRST LOAD

updateOptions();
loadSVGs();
// adjustSize();








// ORDER OPTIONS

displayOrder.addEventListener('wheel', () => {
  console.log('order wheel triggered');
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
  loading.classList.add('show');
  adjust('order');
  loadSVGs();
  event.preventDefault();
})
displayOrder.addEventListener('change', () => {
  console.log('order change triggered');
  loading.classList.add('show');
  adjust('order');
  loadSVGs();
  event.preventDefault();
})





// STYLE OPTIONS
displayTriggers.forEach( ds => {
  ds.addEventListener('change', () => { 
    console.log('style change triggered');
    const settings = getSettings();
    settings.style = document.querySelector('input[name="style"]:checked').id;
    saveSettings(settings);
    // adjust('style');
    loadSVGs();
  });
});
async function loadSVGs() {
  console.log('loadSVGs');
  try {
    let offset = 0;
    squares.innerHTML = '';
    await getData(getCurrent('order'),getCurrent('style'),offset);
  } catch (error) { console.log(error) }
  finally { 
    loading.classList.remove('show');
  }
}
async function getData(order,style,offset) {
  console.log(`getData ${order} ${style} ${offset}`);
  try {
    // console.log(`Loading squares ${offset} - ${offset + 200}`);
    // fix order 4 unique/all choice subsubmenu
    const unique = document.getElementById('unique');
    const all = document.getElementById('all');
    if (order === 4 && style === 'quadvertex' && unique.checked) 
      style = 'unique';
    if (order === 4 && style === 'quadvertex' && all.checked) 
      style = 'quadvertex';

    (order === 4 && (style === 'quadvertex' || style === 'unique'))
      ? document.getElementById('order4quadOptions').classList.remove('hide')
      : document.getElementById('order4quadOptions').classList.add('hide');

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
size.addEventListener('input', ()=> { adjust('size') });
const gap = document.getElementById('gap');
gap.addEventListener('input', ()=> { adjust('gap') });
const strokeWidth = document.getElementById('strokeWidth');
strokeWidth.addEventListener('input', ()=> { adjust('strokeWidth') });
const overlap = document.getElementById('overlap');
overlap.addEventListener('change', ()=> { 
   squares.classList.toggle('overlap');
});

//  COLOUR OPTIONS
const background = document.getElementById('background');
background.addEventListener('input', ()=> { adjust('background') });
const stroke = document.getElementById('stroke');
stroke.addEventListener('input', ()=> { adjust('stroke') });
const salpha = document.getElementById('salpha');
salpha.addEventListener('input', ()=> { adjust('salpha') });
const fill = document.getElementById('fill');
fill.addEventListener('input', ()=> { adjust('fill') });
const falpha = document.getElementById('falpha');
falpha.addEventListener('input', ()=> { adjust('falpha') });

// ANIMATION OPTIONS


// PRESET OPTIONS
const reset = document.getElementById('reset');
reset.addEventListener('click', ()=> { saveSettings(defaults); });
const random = document.getElementById('random');
random.addEventListener('click', ()=> { 
  const settings = getSettings();
  settings['order'] = parseInt(displayOrder[displayOrder.selectedIndex].value);
  settings['style'] = document.querySelector('input[name="style"]:checked').id;
  settings['amount'] = document.querySelector('input[name="amount"]:checked').id;
  settings['size'] = getRandomInt(1, 50);
  settings['gap'] = getRandomInt(0, 50);
  settings['background'] = getRandomColour();
  settings['stroke'] = getRandomColour();
  settings['strokeWidth'] = getRandomInt(1, 30);
  settings['salpha'] = getRandomInt(0, 255);
  settings['fill'] = getRandomColour();
  settings['falpha'] = getRandomInt(0, 255);
  settings['animation'] = "off";
  settings['speed'] = 50;
  saveSettings(settings);
});


// POPULATE THEME OPTIONS
const themes = document.getElementById('themes');

populateThemeOptions();
async function populateThemeOptions() {
  console.log('populateThemeOptions');
  try {
    const url = `http://localhost:3000/data/themes`;
    const rawData = await fetch(url);
    const data = await rawData.json();
    themes.innerHTML = '<option value="">Choose</option>';
    for (let i in data.rows) {
      const name = data.rows[i].id;
      const capName = name[0].toUpperCase() + name.slice(1);
      const option = document.createElement('option');
      option.value = name;
      option.innerText = capName;
      themes.appendChild(option);
    }
  } catch (error) { console.log(error) }
}

themes.addEventListener('change', ()=> { 
  getTheme(event.target.value);
});

async function getTheme(name) {
  console.log(`getTheme ${name}`);
  try {
    const url = `http://localhost:3000/data/themes`;
    const rawData = await fetch(url);
    const data = await rawData.json();
    const theme = data.rows.find(item => item.id === name).doc;
    saveSettings(theme);
    loadSVGs();
    updateOptions();
  } catch (error) { console.log(error) }
}

const settings = document.getElementById('settings');
const saveTheme = document.getElementById('saveTheme');
const themeName = document.getElementById('themeName');
settings.addEventListener('submit', async ()=> {
  const name = prompt('What do you want to call this theme?\nPlease enter a single word name below.');
  themeName.value = name;
  // location.reload();
  // const option = document.createElement('option');
  // option.value = name;
  // option.innerText = name;
  // themes.appendChild(option);
});








// UTILITY

function getCurrent(thing) {
  console.log(`getCurrent ${thing}`);
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
    case 'gap':
      return settings.gap;
    case 'overlap':
      return settings.overlap;
    case 'strokeWidth':
      return settings.strokeWidth;
    case 'background':
      return settings.background;
    case 'stroke':
      return settings.stroke;
    case 'salpha':
      return settings.salpha;
    case 'fill':
      return settings.fill;
    case 'falpha':
      return settings.falpha;
    case 'settings':
      return settings;
  }
}


function adjust(thing) {
  console.log(`adjust ${thing}`);
  const settings = getSettings();
  let x = "";
  switch(thing) {
    case 'order': 
      x = parseInt(displayOrder[displayOrder.selectedIndex].value);
    case 'style':
      x = document.querySelector('[name="style"]:checked').value;
    case 'amount':
      x = document.querySelector('[name="amount"]:checked').value;
    default:
      x = document.getElementById(thing).value;
  }
  settings[thing] = x;
  // settings[thing] = document.getElementById(thing).value;
  saveSettings(settings);
}



function updateOptions() {
  console.log('updateOptions');
  displayOrder.selectedIndex = parseInt(getCurrent('order')) - 3;
  document.querySelector(`#${getCurrent('style')}`).checked = true;
  document.getElementById('size').value = getCurrent('size');
  document.getElementById('gap').value = getCurrent('gap');
  document.getElementById('overlap').checked = getCurrent('overlap');
  document.getElementById('strokeWidth').value = getCurrent('strokeWidth');
  document.getElementById('background').value = getCurrent('background');
  document.getElementById('stroke').value = getCurrent('stroke');
  document.getElementById('salpha').value = getCurrent('salpha');
  document.getElementById('fill').value = getCurrent('fill');
  document.getElementById('falpha').value = getCurrent('falpha');
  applyStyles();
}



function applyStyles() {
  console.log('applyStyles');
  const [...rules] = document.styleSheets[0].cssRules;
  const svgRuleIndex = rules.findIndex(rule => rule.selectorText === "svg");
  // console.log('svgRuleIndex', svgRuleIndex);
  document.styleSheets[0].deleteRule(svgRuleIndex)
  const text = `svg {
    stroke: ${getCurrent('stroke')}${getHex(getCurrent('salpha'))};
    fill: ${getCurrent('fill')}${getHex(getCurrent('falpha'))};
    stroke-width: ${getCurrent('strokeWidth')}px;
    width: ${getCurrent('size')}%;
    margin: ${getCurrent('gap')}px;
  }`;
  document.styleSheets[0].insertRule(text, document.styleSheets[0].cssRules.length);
  document.body.style.background = getCurrent('background');

}



function saveSettings(settingsJSON) {
  console.log('saveSettings');
  const settingsString = JSON.stringify(settingsJSON);
  localStorage.setItem("magicSettings", settingsString);
  updateOptions();
  // applyStyles();
  // console.log("saving", settingsJSON);
}

function getSettings() {
  // console.log('getSettings');
  const settingsString = localStorage.getItem("magicSettings");
  let settingsJSON = {};
  if (settingsString === null) {
    settingsJSON = defaults;
    saveSettings(settingsJSON);
    console.log("first-time setup");
  } else {
    settingsJSON = JSON.parse(settingsString);
    // console.log("retrieving", settingsJSON);
  }
  return settingsJSON;
}


function getHex(dec) {
  return (parseInt(dec) + 0x10000).toString(16).substr(-2).toUpperCase();
}
function getDec(hex) { 
  return parseInt(hex,16); 
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
  //The maximum is inclusive and the minimum is inclusive 
}
function getRandomColour() {
  return `#${getHex(getRandomInt(0, 255))}${getHex(getRandomInt(0, 255))}${getHex(getRandomInt(0, 255))}`;
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