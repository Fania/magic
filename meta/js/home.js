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
  "order":         4,
  "amount":        "unique",
  "style":         "quadvertex",
  "size":          "16",
  "gap":           "20",
  "overlap":       false,
  "overlapAmount": "overlap200",
  "background":    "#222222",
  "stroke":        "#FFFFFF",
  "strokeWidth":   "2",
  "salpha":        "255",
  "fill":          "#666666",
  "falpha":        "0",
  "animation":     "off",
  "speed":         50
};





// FIRST LOAD

loadSettings();
// loadSVGs();
getData();
// adjustSize();






// OK FROM HERE

displayOrder.addEventListener('wheel', () => {
  console.log('ORDER wheel triggered');
  const totalOptions = displayOrder.length;
  let fromIndex = displayOrder.selectedIndex;
  if (Math.sign(event.wheelDeltaY) === -1) { // DOWN
    let toIndex = (fromIndex + 1) % totalOptions;
    displayOrder.selectedIndex = toIndex;
  }
  if (Math.sign(event.wheelDeltaY) === 1) { // UP
    if (fromIndex === 0) fromIndex = 18;
    let toIndex = (fromIndex - 1) % totalOptions;
    displayOrder.selectedIndex = toIndex;
  }
  adjust('order');
  event.preventDefault();
});
displayOrder.addEventListener('change', () => {
  console.log('ORDER change triggered');
  adjust('order');
});

displayAmounts.forEach( da => {
  da.addEventListener('change', () => { 
    console.log('AMOUNT change triggered');
    adjust('amount');
  });
});

displayStyles.forEach( ds => {
  ds.addEventListener('change', () => { 
    console.log('STYLE change triggered');
    adjust('style');
  });
});

const size = document.getElementById('size');
size.addEventListener('input', ()=> { 
  console.log('SIZE input triggered');
  adjust('size');
});
size.addEventListener('wheel', ()=> { 
  console.log('SIZE wheel triggered');
  const old = parseInt(size.value);
  if (Math.sign(event.wheelDeltaY) === -1) { // DOWN
    if(old > 5) { size.value = old - 5; } 
    else        { size.value = 1; }
  }
  if (Math.sign(event.wheelDeltaY) === 1) { // UP
    if(old < 95) { size.value = old + 5; } 
    else         { size.value = 100; }
  }
  adjust('size');
  event.preventDefault();
});

const gap = document.getElementById('gap');
gap.addEventListener('input', ()=> { 
  console.log('GAP input triggered');
  adjust('gap');
});
gap.addEventListener('wheel', ()=> { 
  console.log('GAP wheel triggered');
  const old = parseInt(gap.value);
  if (Math.sign(event.wheelDeltaY) === -1) { // DOWN
    if(old >= 5) { gap.value = old - 5; } 
    else         { gap.value = 0; }
  }
  if (Math.sign(event.wheelDeltaY) === 1) { // UP
    if(old <= 95) { gap.value = old + 5; } 
    else          { gap.value = 100; }
  }
  adjust('gap');
  event.preventDefault();
});

const strokeWidth = document.getElementById('strokeWidth');
strokeWidth.addEventListener('input', ()=> { 
  console.log('LINE-WIDTH input triggered');
  adjust('strokeWidth');
});
strokeWidth.addEventListener('wheel', ()=> { 
  console.log('LINE-WIDTH wheel triggered');
  const old = parseInt(strokeWidth.value);
  if (Math.sign(event.wheelDeltaY) === -1) { // DOWN
    if(old > 2) { strokeWidth.value = old - 2; } 
    else        { strokeWidth.value = 1; }
  }
  if (Math.sign(event.wheelDeltaY) === 1) { // UP
    if(old <= 28) { strokeWidth.value = old + 2; } 
    else          { strokeWidth.value = 30; }
  }
  adjust('strokeWidth');
  event.preventDefault();
});

const overlap = document.getElementById('overlap');
const overlapAll = document.getElementById('overlapAll');
const overlap200 = document.getElementById('overlap200');
overlap.addEventListener('change', () => { 
  console.log('OVERLAP change triggered');
  adjust('overlap');
  applyOverlap(overlap.checked);
});
[overlapAll,overlap200].forEach( oa => {
  oa.addEventListener('change', ()=> { 
    console.log('OVERLAP-AMOUNT change triggered');
    adjust('overlapAmount');
    if(event.target.value === 'overlap200') {
      squares.classList.add('few');
    }
    else { 
      squares.classList.remove('few'); 
    }
  });
});

const background = document.getElementById('background');
background.addEventListener('input', ()=> { 
  console.log('BACKGROUND input triggered');
  adjust('background');
});

const stroke = document.getElementById('stroke');
stroke.addEventListener('input', ()=> { 
  console.log('STROKE input triggered');
  adjust('stroke');
});

// STROKE-ALPHA OPTION
const salpha = document.getElementById('salpha');
salpha.addEventListener('input', ()=> { 
  console.log('STROKE-ALPHA input triggered');
  adjust('salpha');
});
salpha.addEventListener('wheel', ()=> { 
  console.log('STROKE-ALPHA wheel triggered');
  const old = parseInt(salpha.value);
  if (Math.sign(event.wheelDeltaY) === -1) { // DOWN
    if(old >= 5) { salpha.value = old - 5; } 
    else        { salpha.value = 0; }
  }
  if (Math.sign(event.wheelDeltaY) === 1) { // UP
    if(old <= 250) { salpha.value = old + 5; } 
    else          { salpha.value = 255; }
  }
  adjust('salpha');
  event.preventDefault();
});

// FILL OPTION
const fill = document.getElementById('fill');
fill.addEventListener('input', ()=> { 
  console.log('FILL input triggered');
  adjust('fill');
});

// FILL-ALPHA OPTION
const falpha = document.getElementById('falpha');
falpha.addEventListener('input', ()=> { 
  console.log('FILL-ALPHA input triggered');
  adjust('falpha');
});
falpha.addEventListener('wheel', ()=> { 
  console.log('FILL-ALPHA wheel triggered');
  const old = parseInt(falpha.value);
  if (Math.sign(event.wheelDeltaY) === -1) { // DOWN
    if(old >= 5) { falpha.value = old - 5; } 
    else        { falpha.value = 0; }
  }
  if (Math.sign(event.wheelDeltaY) === 1) { // UP
    if(old <= 250) { falpha.value = old + 5; } 
    else          { falpha.value = 255; }
  }
  adjust('falpha');
  event.preventDefault();
});

// ANIMATION OPTIONS

// RESET OPTION
const reset = document.getElementById('reset');
reset.addEventListener('click', ()=> { 
  console.log('RESET click triggered');
  saveSettings(defaults);
});

// RANDOM OPTION
const random = document.getElementById('random');
random.addEventListener('click', ()=> { 
  console.log('RANDOM click triggered');
  const settings = getSettings();
  settings.size = getRandomInt(1, 50);
  settings.gap = getRandomInt(0, 50);
  settings.background = getRandomColour();
  settings.stroke = getRandomColour();
  settings.strokeWidth = getRandomInt(1, 30);
  settings.salpha = getRandomInt(0, 255);
  settings.fill = getRandomColour();
  settings.falpha = getRandomInt(0, 255);
  saveSettings(settings);
});



// OK TO HERE






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
    // loadSVGs();
    getData();
    loadSettings();
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

function adjust(thing) {
  console.log(`adjust ${thing}`);
  const settings = getSettings();
  loading.classList.add('show'); 
  let x = "";
  switch(thing) {
    case 'order':
      x = parseInt(displayOrder[displayOrder.selectedIndex].value);
      break;
    case 'style':
      x = document.querySelector('[name="style"]:checked').value;
      break;
    case 'amount':
      x = document.querySelector('[name="amount"]:checked').value;
      break;
    case 'overlap':
      x = document.getElementById('overlap').checked;
      break;
    case 'overlapAmount':
      x = document.querySelector('[name="overlapAmount"]:checked').value;
      break;
    case 'animation':
      x = document.querySelector('[name="animation"]:checked').value;
      break;
    default:
      x = document.getElementById(thing).value;
  }
  settings[thing] = x;
  saveSettings(settings);
  if(['order','style','amount'].includes(thing)) getData();
}



function loadSettings() {
  console.log('loadSettings');
  const settings = getSettings();
  displayOrder.selectedIndex = parseInt(settings.order) - 3;
  document.querySelector(`#${settings.amount}`).checked = true;
  document.querySelector(`#${settings.style}`).checked = true;
  document.getElementById('size').value = settings.size;
  document.getElementById('gap').value = settings.gap;
  document.getElementById('strokeWidth').value = settings.strokeWidth;
  document.getElementById('overlap').checked = settings.overlap;
  document.querySelector(`#${settings.overlapAmount}`).checked = true;
  document.getElementById('background').value = settings.background;
  document.getElementById('stroke').value = settings.stroke;
  document.getElementById('salpha').value = settings.salpha;
  document.getElementById('fill').value = settings.fill;
  document.getElementById('falpha').value = settings.falpha;
  document.querySelector(`#${settings.animation}`).checked = true;
  document.getElementById('speed').value = settings.speed;
  applyStyles();
}



function applyStyles() {
  console.log('applyStyles');
  const settings = getSettings();
  const sheet = document.styleSheets[0];
  const [...rules] = sheet.cssRules;
  const svgRuleIndex = rules.findIndex(rule => rule.selectorText === "svg");
  sheet.deleteRule(svgRuleIndex)
  const text = `
  svg {
    stroke: ${settings.stroke}${getHex(settings.salpha)};
    fill: ${settings.fill}${getHex(settings.falpha)};
    stroke-width: ${settings.strokeWidth}px;
    width: ${settings.size}%;
    margin: ${settings.gap}px;
  }`;
  sheet.insertRule(text, sheet.cssRules.length);
  document.body.style.background = settings.background;
  loading.classList.remove('show');
}


async function getData(offset = 0) {
  try {
    let order = getSettings().order;
    let style = getSettings().style;
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
    console.log(`getData ${order} ${style} ${offset}`);
    if(offset === 0) squares.innerHTML = '';
    loading.classList.add('show'); 
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
            getData(offset);
            io.unobserve(entries[0].target);
          }
        },{}
      );
      const sentinel = document.createElement('div');
      sentinel.classList.add(`sentinel${offset}`);
      squares.appendChild(sentinel);
      io.observe(sentinel);
    }
    applyOverlap(getSettings().overlap);
  } 
  catch (error) { console.log(error) }
  finally { loading.classList.remove('show'); }
}

function saveSettings(settingsJSON) {
  console.log('saveSettings');
  const settingsString = JSON.stringify(settingsJSON);
  localStorage.setItem("magicSettings", settingsString);
  loadSettings();
  // applyStyles();
  // console.log("saving", settingsJSON);
}

function getSettings() {
  console.log('getSettings');
  const settingsString = localStorage.getItem("magicSettings");
  let settingsJSON = {};
  if (settingsString === null) {
    settingsJSON = defaults;
    saveSettings(settingsJSON);
    console.log("first-time setup");
  } else {
    settingsJSON = JSON.parse(settingsString);
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
  // maximum and minimum inclusive 
}
function getRandomColour() {
  return `#${getHex(getRandomInt(0, 255))}${getHex(getRandomInt(0, 255))}${getHex(getRandomInt(0, 255))}`;
}



function applyOverlap(state) {
  if (state) { // true
    squares.classList.add('overlap');
    if(overlap200.checked) {
      squares.classList.add('few')
    }
    else {
      squares.classList.remove('few'); 
    }
  } else { // false
    squares.classList.remove('overlap');
  }
}

