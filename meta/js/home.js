'use strict';

navigator.serviceWorker.register('sw.js');


const CACHE = 'magic-v0.2';





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

loadingTriggers.forEach( lt => 
  lt.addEventListener('change', () => loading.classList.add('show') )
);



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
  "speed":         50
};





// FIRST LOAD
const params = location.search;
if(params) { loadBookmark(params); }
else {
  // clean load, possibly from memory
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
    // console.log('AMOUNT change triggered');
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
  applyOverlap(document.getElementById('overlap').checked);
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
    console.log(`ANIMATION change triggered by ${a.id}`);
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
  console.log('SPEED input triggered');
  console.log('speed', speed.value);
  const sheet = document.styleSheets[0];
  const [...rules] = sheet.cssRules;
  const animType = document.querySelector('[name="animation"]:checked').value;
  if(animType === 'sync') {
    const evenRuleIndex = rules.findIndex(rule => 
      rule.selectorText === "#squares.animateEvenly svg .lines");
    sheet.deleteRule(evenRuleIndex);
    const text = `#squares.animateEvenly svg .lines { animation: dash ${speed.value}s ease-in-out alternate infinite }`;
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
  console.log('SPEED wheel triggered');
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
  console.log('RESET click triggered');
  saveSettings(defaults);
  getData();
  triggerAnimation();
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


// POPULATE THEME OPTIONS
const themes = document.getElementById('themes');
populateThemeOptions();
async function populateThemeOptions() {
  console.log('populateThemeOptions');
  try {
    const url = '/data/themes';
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
    const url = '/data/themes';
    const rawData = await fetch(url);
    const data = await rawData.json();
    const theme = data.rows.find(item => item.id === name).doc;
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
  console.log('populateLengthOptions');
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
    updateCache(settings);
  } catch (error) { console.log(error) }
}
async function prepareLengthOptions() {
  console.log('prepareLengthOptions');
  try {
    for (let i in data.rows) {
      const len = data.rows[i].key;
      const num = data.rows[i].value.length;
      const option = document.createElement('option');
      option.value = len;
      option.innerText = `${len} (${num})`;
      lengths.appendChild(option);
    }
    updateCache(settings);
  } catch (error) { console.log(error) }
}


















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
      const y = document.getElementById(thing).value;
      console.log(`adjusting ${y}, ${parseInt(y)}, ${x}`);
      x = Number.isNaN(parseInt(y)) ? y : parseInt(y);
      console.log(`adjusting ${x}, ${y}`);
  }
  console.log(`adjusting ${x}`);
  settings[thing] = x;
  saveSettings(settings);
  if(['order','style','amount'].includes(thing)) {
    getData();
    // populateLengthOptions();
  }
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
  document.getElementById('overlap').checked = settings.overlap === true;
  document.querySelector(`#${settings.overlapAmount}`).checked = true;
  document.getElementById('background').value = settings.background;
  document.getElementById('stroke').value = settings.stroke;
  document.getElementById('salpha').value = settings.salpha;
  document.getElementById('fill').value = settings.fill;
  document.getElementById('falpha').value = settings.falpha;
  document.querySelector(`#${settings.animation}`).checked = true;
  document.getElementById('speed').value = settings.speed;
  if(settings._id) {
    const displayTheme = document.getElementById('themes');
    const themeIndex = displayTheme[displayTheme.selectedIndex].value;
    displayTheme.selectedIndex = parseInt(settings._id);
  }
  applyStyles();
  // TODO: also apply animation styles?
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
  applyOverlap(settings.overlap === 'true' || settings.overlap);
  loading.classList.remove('show');
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
    console.log(`getData ${order} ${style} ${offset}`);
    if(offset === 0) squares.innerHTML = '';
    loading.classList.add('show'); 
    const url = `/data/${order}/${style}/${offset}`;
    const rawData = await fetch(url);
    const data = await rawData.json();
    for (let i in data.rows) {
      const elem = data.rows[i].value.svg;
      squares.insertAdjacentHTML('beforeend',elem);
      if(!['numbers','blocks','circles','tetromino'].includes(style)) {
        animationCSS(data.rows[i].id, order, style, 
                             data.rows[i].value['length']);
      }
    }
    // TODO add sntinel earlier, at 150 or so
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
      // enable overlap for new squares if checked
      applyOverlap(getSettings().overlap === 'true' || getSettings().overlap);
    }
  } 
  catch (error) { console.log(error) }
  finally { loading.classList.remove('show'); }
}

function saveSettings(settingsJSON) {
  console.log('saveSettings to localStorage');
  const settingsString = JSON.stringify(settingsJSON);
  localStorage.setItem("magicSettings", settingsString);
  loadSettings();
  // applyStyles();
  // console.log("saving", settingsJSON);
  updateCache(settingsJSON);
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


// IndexedDB
// function saveSettingsDB(settings) {
//   console.log('saveSettings to IDB via front end');
//   const request = indexedDB.open('magic', 1);
//   request.onerror = event => console.error(event.target.errorCode);
//   request.onupgradeneeded = event => {
//     const db = event.target.result;
//     db.createObjectStore('settings');
//   };
//   request.onsuccess = event => {
//     const db = event.target.result;
//     updateData(db, settings);
//   };
// }
// function updateData(db, settings) {
//   let tx = db.transaction(['settings'], 'readwrite');
//   let store = tx.objectStore('settings');
//   store.put(settings,1);
//   tx.oncomplete = () => { console.log('Updated settings in IDB') }
//   tx.onerror = event => console.error(event.target.errorCode);
// }
async function updateCache(settings) {
  console.log('updating cache from front end');
  try {
    loading.classList.add('show'); 
    const sty = settings.amount === 'unique' 
                && settings.style === 'quadvertex'
                && settings.order === 4
                ? 'unique' : settings.style;
    const url = `/data/${settings.order}/${sty}/0`;
    // TODO reenable cache of lengths
    // const lenurl = `/data/lengths/${settings.order}/${sty}`;
    const cache = await caches.open(CACHE);
    cache.add(url);
    // cache.add(lenurl);
  }
  catch (error) { console.log('updateCache', error) }
  finally { 
    console.log('finished updating cache');
    loading.classList.remove('show'); }
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
    if(document.getElementById('overlap200').checked) { squares.classList.add('few'); }
    else { squares.classList.remove('few'); }
  } else { // false
    // console.log('disable overlap');
    squares.classList.remove('overlap');
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
  const syncName = `#squares.animate #${styleName}-${order}-${id} .lines`;
  const syncText = `${syncName}{stroke-dasharray:${len};stroke-dashoffset:${len}}`;
  sheet.insertRule(syncText, sheet.cssRules.length);

  const sheetNew = document.styleSheets[0];
  const asyncName = `#squares.animateOddly #${styleName}-${order}-${id} .lines`;
  
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

document.addEventListener("keydown", event => {
  if (event.key === "i") {
    const elems = document.querySelectorAll("header, footer");
    elems.forEach(e => {
      e.classList.toggle('hide');
    });
  }
});
