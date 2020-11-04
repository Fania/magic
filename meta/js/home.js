'use strict';

navigator.serviceWorker.register('sw.js');


const CACHE = 'magic-v2.1.21';



const [...menuTriggers] = document.querySelectorAll('nav a');
const [...displayStyles] = document.getElementsByName('style');
const [...displayAmounts] = document.getElementsByName('amount');
const displayOrder = document.getElementById('order');
const loadingTriggers = (menuTriggers.concat(displayStyles,displayOrder,displayAmounts)).flat(Infinity);
// const displayTriggers = (displayStyles.concat(displayOrder,displayAmounts)).flat(Infinity);
// const unique = document.getElementById('unique');
// const all = document.getElementById('all');
// const opt = document.getElementById('order4quadOptions');


// LOADING ICON TRIGGERS

// loadingTriggers.forEach( lt => 
//   lt.addEventListener('change', () => loading.classList.add('show') )
// );



// OK FROM HERE


const defaults = { 
  "order":         4,
  "amount":        "unique",
  "style":         "quadvertex",
  "size":          16,
  "gap":           20,
  "overlap":       false,
  "overlapAmount": "overlap200",
  "background":    "#222222",
  "stroke":        "#FFFFFF",
  "strokeWidth":   2,
  "salpha":        255,
  "fill":          "#666666",
  "falpha":        0,
  "animation":     "off",
  "speed":         50,
  "dayMode":       false
};





// FIRST LOAD
const params = location.search;
if(params) { loadBookmark(params); }
else {
  // clean load, possibly from memory
  populateOrderOptions();
  loadSettings();
  getData();
  triggerAnimation();

  // populateLengthOptions();
}





function loadBookmark(params) {
  console.log('loading from BOOKMARK');
  const keyValueStrings = (params.slice(1)).split('&');
  const settings = {};
  keyValueStrings.forEach(x => {
    const pair = x.split('=');
    const value = pair[1].replace('%23','#');
    settings[pair[0]] = value;
  });
  // console.log(settings);
  saveSettings(settings);
  loadSettings();
  getData();
  triggerAnimation();
  // populateLengthOptions();
}


displayOrder.addEventListener('wheel', () => {
  // console.log('ORDER wheel triggered');
  const orderSelects = document.querySelector('#order');
  const totalOptions = orderSelects.length;
  const maxIndex = totalOptions;
  let fromIndex = orderSelects.selectedIndex;
  if (Math.sign(event.wheelDeltaY) === -1) { // DOWN (e.g. 4 to 5)
    // console.log(`down from (i): ${fromIndex}, (v): ${orderSelects[fromIndex].value}`);
    if (fromIndex === maxIndex) fromIndex = 0;
    let toIndex = (fromIndex + 1) % totalOptions;
    orderSelects.selectedIndex = toIndex;
    // console.log(`down to (i): ${orderSelects.selectedIndex}, (v): ${orderSelects[orderSelects.selectedIndex].value}`);
  }
  if (Math.sign(event.wheelDeltaY) === 1) { // UP (e.g. 5 to 4)
    // console.log(`up from (i): ${fromIndex}, (v): ${orderSelects[fromIndex].value}`);
    if (fromIndex === 0) fromIndex = maxIndex;
    let toIndex = (fromIndex - 1) % totalOptions;
    orderSelects.selectedIndex = toIndex;
    // console.log(`up to (i): ${orderSelects.selectedIndex}, (v): ${orderSelects[orderSelects.selectedIndex].value}`);
  }
  adjust('order');
  event.preventDefault();
});
displayOrder.addEventListener('change', () => {
  // console.log('ORDER change triggered');
  adjust('order');
});

displayAmounts.forEach( da => {
  da.addEventListener('change', () => { 
    // console.log('AMOUNT change triggered');
    adjust('amount');
  });
});

displayStyles.forEach( ds => {
  ds.addEventListener('change', () => { 
    // console.log('STYLE change triggered');
    adjust('style');
  });
});

const size = document.getElementById('size');
size.addEventListener('input', ()=> { 
  // console.log('SIZE input triggered');
  adjust('size');
});
size.addEventListener('wheel', ()=> { 
  // console.log('SIZE wheel triggered');
  const old = parseInt(size.value);
  if (Math.sign(event.wheelDeltaY) === -1) { // DOWN
    if(old > 1) { size.value = old - 1; } 
    else        { size.value = 1; }
  }
  if (Math.sign(event.wheelDeltaY) === 1) { // UP
    if(old < 69) { size.value = old + 1; } 
    else         { size.value = 70; }
  }
  adjust('size');
  event.preventDefault();
});

const gap = document.getElementById('gap');
gap.addEventListener('input', ()=> { 
  // console.log('GAP input triggered');
  adjust('gap');
});
gap.addEventListener('wheel', ()=> { 
  // console.log('GAP wheel triggered');
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
  // console.log('LINE-WIDTH input triggered');
  adjust('strokeWidth');
});
strokeWidth.addEventListener('wheel', ()=> { 
  // console.log('LINE-WIDTH wheel triggered');
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
  // console.log('OVERLAP change triggered');
  adjust('overlap');
  applyOverlap(document.getElementById('overlap').checked);
});
[overlapAll,overlap200].forEach( oa => {
  oa.addEventListener('change', ()=> { 
    // console.log('OVERLAP-AMOUNT change triggered');
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
  // console.log('BACKGROUND input triggered');
  adjust('background');
});

const stroke = document.getElementById('stroke');
stroke.addEventListener('input', ()=> { 
  // console.log('STROKE input triggered');
  adjust('stroke');
});

// STROKE-ALPHA OPTION
const salpha = document.getElementById('salpha');
salpha.addEventListener('input', ()=> { 
  // console.log('STROKE-ALPHA input triggered');
  adjust('salpha');
});
salpha.addEventListener('wheel', ()=> { 
  // console.log('STROKE-ALPHA wheel triggered');
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
  // console.log('FILL input triggered');
  adjust('fill');
});

// FILL-ALPHA OPTION
const falpha = document.getElementById('falpha');
falpha.addEventListener('input', ()=> { 
  // console.log('FILL-ALPHA input triggered');
  adjust('falpha');
});
falpha.addEventListener('wheel', ()=> { 
  // console.log('FILL-ALPHA wheel triggered');
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
const syncA = document.getElementById('sync');
const asyncA = document.getElementById('async');
const offA = document.getElementById('off');
if(offA.checked || asyncA.checked) {
  document.getElementById('speed').disabled = true;
} else {
  document.getElementById('speed').disabled = false;
}
[syncA,asyncA,offA].forEach( a => {
  a.addEventListener('change', ()=> { 
    // console.log(`ANIMATION change triggered by ${a.id}`);
    triggerAnimation();
    adjust('animation');
  });
});
function triggerAnimation() {
  if(document.getElementById('sync').checked) { 
    squares.classList.add('animate'); 
    squares.classList.add('animateEvenly');
    squares.classList.remove('animateOddly'); 
    document.getElementById('speed').disabled = false;
  }
  if(document.getElementById('async').checked) { 
    squares.classList.add('animate'); 
    squares.classList.add('animateOddly');
    squares.classList.remove('animateEvenly');
    document.getElementById('speed').disabled = true;
  }
  if(document.getElementById('off').checked) {
    squares.classList.remove('animate');
    squares.classList.remove('animateOddly');
    squares.classList.remove('animateEvenly');
    document.getElementById('speed').disabled = true;
  }
}

// ANIMATION SPEED OPTION
const speed = document.getElementById('speed');
speed.addEventListener('input', ()=> { 
  // console.log('SPEED input triggered');
  // console.log('speed', speed.value);
  const sheet = document.styleSheets[0];
  const [...rules] = sheet.cssRules;
  const animType = document.querySelector('[name="animation"]:checked').value;
  if(animType === 'sync') {
    const evenRuleIndex = rules.findIndex(rule => 
      // rule.selectorText === "#squares.animateEvenly svg .lines");
      rule.selectorText === "#squares.animateEvenly svg path");
    sheet.deleteRule(evenRuleIndex);
    // const text = `#squares.animateEvenly svg .lines { animation: dash ${speed.value}s ease-in-out alternate infinite }`;
    const text = `#squares.animateEvenly svg path { animation: dash ${speed.value}s ease-in-out alternate infinite }`;
    sheet.insertRule(text, sheet.cssRules.length);
  } 
  if(animType === 'async') {
    const oddRuleIndex = rules.findIndex(rule => 
      rule.selectorText === "#squares.animateOddly");
    sheet.deleteRule(oddRuleIndex);
    const speedValue = parseInt(speed.value) / 2;
    const text = `#squares.animateOddly { --speed: ${speedValue} }`;
    sheet.insertRule(text, sheet.cssRules.length);
  }
  adjust('speed');
});
speed.addEventListener('wheel', ()=> { 
  // console.log('SPEED wheel triggered');
  const old = parseInt(speed.value);
  if (Math.sign(event.wheelDeltaY) === -1) { // DOWN
    if(old > 5) { speed.value = old - 5; } 
    else        { speed.value = 1; }
  }
  if (Math.sign(event.wheelDeltaY) === 1) { // UP
    if(old <= 95) { speed.value = old + 5; } 
    else          { speed.value = 100; }
  }
  adjust('speed');
  event.preventDefault();
});






// RESET OPTION
const reset = document.getElementById('reset');
reset.addEventListener('click', ()=> { 
  // console.log('RESET click triggered');
  saveSettings(defaults);
  getData();
  triggerAnimation();
});

// RANDOM OPTION
const random = document.getElementById('random');
random.addEventListener('click', async ()=> { 
  // console.log('RANDOM click triggered');
  const settings = getSettings();
  const orders = await getOrders();
  const orderIndex = getRandomInt(0, (orders.length - 1));
  const orderSelect = document.getElementById('order');
  settings.order = orderSelect[orderIndex].value;
  settings.size = getRandomInt(1, 50);
  settings.gap = getRandomInt(0, 50);
  settings.background = getRandomColour();
  settings.stroke = getRandomColour();
  settings.strokeWidth = getRandomInt(1, 30);
  settings.salpha = getRandomInt(0, 255);
  settings.fill = getRandomColour();
  settings.falpha = getRandomInt(0, 255);
  settings.animation = ['sync','async','off'][getRandomInt(0, 2)];
  settings.speed = getRandomInt(0, 100);
  settings.overlap = [true,false][getRandomInt(0, 1)];
  saveSettings(settings);
  getData();
  triggerAnimation();
});

// SHARE OPTION
const share = document.getElementById('share');
share.addEventListener('click', ()=> { 
  const settings = getSettings();
  const params = new URLSearchParams(settings);
  const bookmark = location + '?' + params.toString();
  console.log(bookmark);

  if (navigator.share) {
    navigator.share({
      title: 'squares.cubelife.org',
      text: 'Magic Squares',
      url: bookmark,
    })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error));
  } else { console.log('no sharing possible'); }

  location = bookmark;
  // bookmark.select();
  // document.execCommand("copy");
  // alert('Added URL to clipboard.');
});


// POPULATE ORDER OPTIONS
async function getOrders() {
  const remoteOrdersURL = '/data/orders';
  const remoteOrdersRawData = await fetch(remoteOrdersURL);
  const remoteOrders = await remoteOrdersRawData.json();
  return remoteOrders;
}

const orders = document.getElementById('order');
async function populateOrderOptions() {
  // console.log('populateOrderOptions');
  try {
    const data = await getOrders();
    orders.innerHTML = '';
    for (let i in data) {
      const order = data[i];
      const option = document.createElement('option');
      option.value = order;
      option.innerText = order;
      if(data[i] == 4) option.selected = true;
      orders.appendChild(option);
    }
  // console.log('total order choices',document.querySelector('#order').length);
  } catch (error) { console.log(error) }
}


// POPULATE THEME OPTIONS
const themes = document.getElementById('themes');
populateThemeOptions();
async function populateThemeOptions() {
  // console.log('populateThemeOptions');
  try {
    const url = '/data/themes';
    const rawData = await fetch(url);
    const data = await rawData.json();
    themes.innerHTML = '<option value="">Choose</option>';
    for (let i in data) {
      const name = data[i].id;
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
    const url = '/data/themes';
    const rawData = await fetch(url);
    const data = await rawData.json();
    const theme = data.find(item => item.id === name).doc;
    saveSettings(theme);
    getData();
    triggerAnimation();
  } catch (error) { console.log(error) }
}

const settings = document.getElementById('settings');
const themeName = document.getElementById('themeName');
settings.addEventListener('submit', async ()=> {
  const name = prompt('What do you want to call this theme?\nPlease enter a single word name below.');
  themeName.value = name;
});



// OK TO HERE


// POPULATE LENGTHS OPTIONS
const lengths = document.getElementById('lengths');
// populateLengthOptions();
async function populateLengthOptions() {
  // console.log('populateLengthOptions');
  try {
    const settings = getSettings();
    const order = settings.order;
    const style = settings.style;
    const url = `/data/lengths/${order}/${style}`;
    const rawData = await fetch(url);
    const data = await rawData.json();
    lengths.innerHTML = '<option value="">Choose</option>';
    for (let i in data.rows) {
      const len = data.rows[i].key;
      const num = data.rows[i].value.length;
      const option = document.createElement('option');
      option.value = len;
      option.innerText = `${len} (${num})`;
      lengths.appendChild(option);
    }
    // updateCache(settings);
  } catch (error) { console.log(error) }
}
async function prepareLengthOptions() {
  // console.log('prepareLengthOptions');
  try {
    for (let i in data.rows) {
      const len = data.rows[i].key;
      const num = data.rows[i].value.length;
      const option = document.createElement('option');
      option.value = len;
      option.innerText = `${len} (${num})`;
      lengths.appendChild(option);
    }
    // updateCache(settings);
  } catch (error) { console.log(error) }
}








// function filterSquares(c) {

//   const squares = document.querySelectorAll(`#squares svg`);
//   const matches = document.querySelectorAll(`#squares svg.${c}`);

//   squares.forEach( sq => { sq.classList.add('hide') });
//   matches.forEach( sq => { sq.classList.remove('hide') });

//   if (c == 'all') squares.forEach( sq => { sq.classList.remove('hide') });

// }









// UTILITY

function adjust(thing) {
  // console.log(`adjust ${thing}`);
  const settings = getSettings();
  // loading.classList.add('show');
  document.body.style.cursor = 'wait !important';
  let x = "";
  switch(thing) {
    case 'order':
      const orderSelect = document.querySelector('#order');
      x = parseInt(orderSelect[orderSelect.selectedIndex].value);
      // console.log(`adjust ${x}`);
      break;
    // case 'classification':
    //   x = classification[classification.selectedIndex].value;
    //   break;
    case 'style':
      x = document.querySelector('[name="style"]:checked').value;
      break;
    case 'amount':
      x = document.querySelector('[name="amount"]:checked').value;
      break;
    case 'overlap':
      x = document.getElementById('overlap').checked;
      break;
    case 'dayMode':
      x = document.getElementById('day').checked;
      break;
    case 'overlapAmount':
      x = document.querySelector('[name="overlapAmount"]:checked').value;
      break;
    case 'animation':
      x = document.querySelector('[name="animation"]:checked').value;
      break;
    default:
      const y = document.getElementById(thing).value;
      // console.log(`adjusting ${y}, ${parseInt(y)}, ${x}`);
      x = Number.isNaN(parseInt(y)) ? y : parseInt(y);
      // console.log(`adjusting ${x}, ${y}`);
  }
  // console.log(`adjusting ${x}`);
  settings[thing] = x;
  saveSettings(settings);
  if(['order','style','amount'].includes(thing)) {
    getData();
    // populateLengthOptions();
  }
}



async function loadSettings() {
  // console.log('loadSettings');
  const settings = getSettings();
  const rOrders = await getOrders();
  document.querySelector('#order').selectedIndex = rOrders.indexOf(settings.order);
  document.querySelector(`#${settings.amount}`).checked = true;
  document.querySelector(`#${settings.style}`).checked = true;
  document.getElementById('size').value = settings.size;
  document.getElementById('gap').value = settings.gap;
  document.getElementById('strokeWidth').value = settings.strokeWidth;
  document.getElementById('overlap').checked = settings.overlap === true;
  document.querySelector(`#${settings.overlapAmount}`).checked = true;
  document.getElementById('background').value = settings.background;
  document.getElementById('stroke').value = settings.stroke;
  document.getElementById('salpha').value = settings.salpha;
  document.getElementById('fill').value = settings.fill;
  document.getElementById('falpha').value = settings.falpha;
  document.querySelector(`#${settings.animation}`).checked = true;
  document.getElementById('speed').value = settings.speed;
  document.getElementById('day').checked = settings.dayMode;
  document.getElementById('night').checked = !settings.dayMode;
  if(settings._id) {
    const displayTheme = document.getElementById('themes');
    const themeIndex = displayTheme[displayTheme.selectedIndex].value;
    displayTheme.selectedIndex = parseInt(settings._id);
  }
  applyStyles();
  // TODO: also apply animation styles?
  // add class to body for printing
  document.body.removeAttribute("class");
  const orderClass = 
    settings.amount == "unique" 
    && settings.order == 4 
    && settings.style == 'quadvertex'
    ? `order4U` 
    : `order${settings.order}`;

  document.body.classList.add(orderClass);
  if(day.checked) {
    document.body.classList.add("dayMode");
  } else {
    document.body.classList.remove("dayMode");
  }
}



function applyStyles() {
  // console.log('applyStyles');
  const settings = getSettings();
  const sheet = document.styleSheets[0];
  const [...rules] = sheet.cssRules;
  const svgRuleIndex = rules.findIndex(rule => rule.selectorText === "#squares svg");
  sheet.deleteRule(svgRuleIndex)
  const text = `
  #squares svg {
    stroke: ${settings.stroke}${getHex(settings.salpha)};
    fill: ${settings.fill}${getHex(settings.falpha)};
    stroke-width: ${settings.strokeWidth}px;
    width: ${settings.size}%;
    max-height: 70vh; 
    margin: ${settings.gap}px;
  }`;
  sheet.insertRule(text, sheet.cssRules.length);

  const sheet2 = document.styleSheets[0];
  const [...rules2] = sheet2.cssRules;
  const modalRuleIndex = rules2.findIndex(rule => rule.selectorText === "#modal svg");
  sheet.deleteRule(modalRuleIndex)
  const modaltext = `
  #modal svg {
    stroke: ${settings.stroke}${getHex(settings.salpha)};
    fill: ${settings.fill}${getHex(settings.falpha)};
    stroke-width: ${settings.strokeWidth}px;
    object-fit: contain; 
    width: 60vw; height: 60vh; 
  }`;
  sheet2.insertRule(modaltext, sheet.cssRules.length);

  document.body.style.background = settings.background;
  applyOverlap(settings.overlap === 'true' || settings.overlap);
  // loading.classList.remove('show');
  document.body.style.cursor = 'default !important';
  if(day.checked) {
    document.body.classList.add("dayMode");
  } else {
    document.body.classList.remove("dayMode");
  }
}




async function getData(offset = 0) {
  try {
    let order = getSettings().order;
    let style = getSettings().style;
    // TODO fix order 4 unique/all choice subsubmenu
    const unique = document.getElementById('unique');
    const all = document.getElementById('all');
    if (order === 4 && style === 'quadvertex' && unique.checked) 
      style = 'unique';
    if (order === 4 && style === 'quadvertex' && all.checked) 
      style = 'quadvertex';
    (order === 4 && (style === 'quadvertex' || style === 'unique'))
      ? document.getElementById('order4quadOptions').classList.remove('hide')
      : document.getElementById('order4quadOptions').classList.add('hide');
    // console.log(`getData ${order} ${style} ${offset}`);
    if(offset === 0) squares.innerHTML = '';
    // loading.classList.add('show'); 
    document.body.style.cursor = 'wait !important';
    // debugger;
    const url = `/data/${order}/${style}/${offset}`;
    // console.log(url);
    if (url !== '/data/4/unique/0') updateCache(url);
    const rawData = await fetch(url);
    const data = await rawData.json();
    for (let i in data) {
      // console.log(i);
      const elem = data[i].svg;
      squares.insertAdjacentHTML('beforeend',elem);
      if(!['numbers','blocks','circles','tetromino'].includes(style)) {
        animationCSS(data[i]['id'], order, style, 
                             data[i]['length']);
      }
    }
    // recalc bounding box for arc and altarc styles
    if(style === 'arc' || style === 'altarc') {
      const [...sqs] = document.querySelectorAll("#squares svg");
      sqs.forEach(sq => {
        const p = sq.querySelector("path");
        const bbx = p.getBBox();
        sq.setAttribute('viewBox', `${bbx.x} ${bbx.y} ${bbx.width} ${bbx.height}`);
      });
    }
    // TODO add sntinel earlier, at 150 or so
    // only add sentinel if we have more results left
    if(data.length === 200) {
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
      // enable overlap for new squares if checked
      applyOverlap(getSettings().overlap === 'true' || getSettings().overlap);
    }
  } 
  catch (error) { console.log('getData', error) }
  finally { 
    // loading.classList.remove('show'); 
    document.body.style.cursor = 'default !important'; 
    addModalListeners();
  }
}

function saveSettings(settingsJSON) {
  // console.log('saveSettings to localStorage');
  const settingsString = JSON.stringify(settingsJSON);
  localStorage.setItem("magicSettings", settingsString);
  loadSettings();
  // applyStyles();
  // console.log("saving", settingsJSON);
  // updateCache(settingsJSON);
  // saveSettingsDB(settingsJSON);
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
  }
  return settingsJSON;
}



async function updateCache(url) {
  // console.log('updating cache from front end');
  try {
    // loading.classList.add('show'); 
    // TODO reenable cache of lengths
    const cache = await caches.open(CACHE);
    cache.add(url);
    // cache.add(lenurl);
  }
  catch (error) { console.log('updateCache', error) }
  finally { 
    // console.log('finished updating cache');
    // loading.classList.remove('show'); 
  }
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
    // console.log('enable overlap');
    squares.classList.add('overlap');
    document.body.style.cursor = 'wait !important';
    if(document.getElementById('overlap200').checked) { squares.classList.add('few'); }
    else { squares.classList.remove('few'); }
  } else { // false
    // console.log('disable overlap');
    squares.classList.remove('overlap');
    document.body.style.cursor = 'default !important';
  }
}







// #quadvertex-3-1 .lines { stroke-dasharray: 1040; stroke-dashoffset: 1040; }
// #quadvertex-3-1 .lines { animation: dash 2.08s ease-in-out alternate infinite; }

// called when grapping new data via api and intersection observer
function animationCSS(id, order, style, len) {
  // console.log(id, order, style, len);

  const sheet = document.styleSheets[0];
  const [...rules] = sheet.cssRules;
  // const [...rules] = sheet.cssRules;
  // const syncRuleIndex = rules.findIndex(rule => rule.selectorText === "svg");
  // sheet.deleteRule(syncRuleIndex);
  const styleName = style === 'unique' ? 'quadvertex' : style
  const syncName = `#squares.animate #${styleName}-${order}-${id} path`;
  const syncText = `${syncName}{stroke-dasharray:${len};stroke-dashoffset:${len}}`;
  sheet.insertRule(syncText, sheet.cssRules.length);

  const sheetNew = document.styleSheets[0];
  const asyncName = `#squares.animateOddly #${styleName}-${order}-${id} path`;
  
  // TODO find fix
  // need to do speed calculation here, not in CSS
  // don't ask why. I guess the CSSOM inserted rules can't do calc
  const asyncSpeedIndex = rules.findIndex(rule => 
      rule.selectorText === "#squares.animateOddly");
  const cssTextpre = rules[asyncSpeedIndex].style.cssText;
  // problem: does not update speed vairable multiplier dynamically,
  // only reads it at first load (via getData)
  const asyncSpeed = cssTextpre.split(' ')[1].replace(';','');
  const speedValue = (len/1000) * asyncSpeed;
  const asyncText = `
  ${asyncName}{
    animation-name: dash;
    animation-duration: ${speedValue}s;
    animation-timing-function: ease-in-out;
    animation-direction: alternate; 
    animation-iteration-count: infinite; 
  }`;
  // console.log(asyncText);
  sheetNew.insertRule(asyncText, sheetNew.cssRules.length);
  // const more = `#squares.animateEvenly svg .lines { animation: dash ${speed}s ease-in-out alternate infinite }`;

}





// FULLSCREEN OPTIONS
// for live display screens
document.addEventListener("keydown", event => {
  if (event.key === "i") {
    const elems = document.querySelectorAll("header, footer");
    elems.forEach(e => {
      e.classList.toggle('hide');
    });
  }
  if (event.key === "p") {
    togglePrintStyles();
  }
});


function togglePrintStyles() {
  const mainStyles = document.getElementById("mainStyles");
  const printLink = document.getElementById("printStyle");
  if (printLink) { 
    printLink.remove();

  } else {
    mainStyles.insertAdjacentHTML('afterend', `
      <link id="printStyle" rel="stylesheet" href="meta/css/print.css">
    `)
  }
}




// modals for all images and printing of singles
function addModalListeners() {
  const [...images] = document.querySelectorAll("#squares svg");
  images.forEach( i => i.addEventListener("dblclick", () => addModal(i)) );
}
function addModal(image) {
  // console.log(`toggle modal by`,event.target);
  let modal = document.createElement("div");
  modal.id = "modal";
  const squares = document.querySelector("#squares");
  squares.classList.add("modalShowing");
  const foot = document.querySelector("footer");
  const clone = image.cloneNode(true);
  const fig = document.createElement("figure");
  let figcap = document.createElement("figcaption");
  const idArray = (clone.id).split("-");
  const classArray = ([...clone.classList]).join(", ");
  figcap.innerHTML = `ID: <strong>${idArray[2]}</strong><br>Order: ${idArray[1]}  Style: ${idArray[0]}`;
  if(classArray.includes("pandiag") || classArray.includes("symmetric") || classArray.includes("self-compl")) figcap.innerHTML += `<br>Classification: `
  if(classArray.includes("pandiag")) figcap.innerHTML += `Pandiagonal `
  if(classArray.includes("symmetric")) figcap.innerHTML += `Associative `
  if(classArray.includes("self-compl")) figcap.innerHTML += `Self-complementary`
  fig.appendChild(clone);
  fig.appendChild(figcap);
  modal.appendChild(fig);
  foot.insertAdjacentElement("beforebegin", modal);
  modal.addEventListener("dblclick", () => {
    // document.body.removeChild(modal);
    const [...modals] = document.querySelectorAll('[id^="modal"]');
    modals.forEach(m => m.remove());
    squares.classList.remove("modalShowing");
  });
}
/* <svg id="quadvertex-4-53db433d34ec8adecc3d7d192ad7eb7c" class="order-x pad unique self-compl l1918" viewBox="-2 -2 304 304"><path class="lines" d="M 150,100 Q 300,200 200,100 Q 100,0 150,50 Q 200,100 200,200 Q 200,300 150,250 Q 100,200 200,150 Q 300,100 150,200 Q 0,300 150,300 Q 300,300 150,200 Q 0,100 100,150 Q 200,200 150,250 Q 100,300 100,200 Q 100,100 150,50 Q 200,0 100,100 Q 0,200 150,100 Q 300,0 150,0 Q 0,0 150,100 "></path></svg> */






night.addEventListener("click", () => {
  document.body.classList.remove("dayMode");
  // document.body.style.background = "#222222";
  document.getElementById('background').value = "#222222";
  document.getElementById('stroke').value = "#EEEEEE";
  adjust("background");
  adjust("stroke");
  adjust("dayMode");
});
day.addEventListener("click", () => {
  document.body.classList.add("dayMode");
  // document.body.style.background = "#FFFFFF";
  document.getElementById('background').value = "#FFFFFF";
  document.getElementById('stroke').value = "#000000";
  adjust("background");
  adjust("stroke");
  adjust("dayMode");
});
