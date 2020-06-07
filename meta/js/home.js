'use strict';

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
const params = location.search;
if(params) { loadBookmark(params); }
else {
  // clean load, possibly from memory
  loadSettings();
  getData();
}



function loadBookmark(params) {
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
const syncA = document.getElementById('sync');
const asyncA = document.getElementById('async');
const offA = document.getElementById('off');
[syncA,asyncA,offA].forEach( a => {
  a.addEventListener('change', ()=> { 
    console.log(`ANIMATION change triggered by ${a.id}`);
    if(a.id === 'sync') { 
      squares.classList.add('animate'); 
      squares.classList.add('animateEvenly'); 
    }
    if(a.id === 'async') { 
      squares.classList.add('animate'); 
      squares.classList.add('animateOddly'); 
    }
    if(a.id === 'off') {
      squares.classList.remove('animate');
      squares.classList.remove('animateOddly');
      squares.classList.remove('animateEvenly');
    }
    adjust('animation');
  });
});

// ANIMATION SPEED OPTION
const speed = document.getElementById('speed');
speed.addEventListener('input', ()=> { 
  console.log('SPEED input triggered');
  console.log('speed', speed.value);
  const sheet = document.styleSheets[0];
  const [...rules] = sheet.cssRules;
  const animType = document.querySelector('[name="animation"]:checked').value;
  let text = '';
  if(animType === 'sync') {
    const evenRuleIndex = rules.findIndex(rule => 
      rule.selectorText === "#squares.animateEvenly svg .lines");
    sheet.deleteRule(evenRuleIndex);
    text = `#squares.animateEvenly svg .lines { animation: dash ${speed.value}s ease-in-out alternate infinite }`;
  } 
  if(animType === 'async') {
    const oddRuleIndex = rules.findIndex(rule => 
      rule.selectorText === "#squares.animateOddly");
    sheet.deleteRule(oddRuleIndex);
    text = `#squares.animateOddly { --speed: ${speed.value / 2} }`;
  }
  sheet.insertRule(text, sheet.cssRules.length);
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
    loadSettings();
  } catch (error) { console.log(error) }
}

const settings = document.getElementById('settings');
const themeName = document.getElementById('themeName');
settings.addEventListener('submit', async ()=> {
  const name = prompt('What do you want to call this theme?\nPlease enter a single word name below.');
  themeName.value = name;
});





// OK TO HERE







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
  document.getElementById('overlap').checked = settings.overlap === 'true';
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
  applyOverlap(settings.overlap === 'true');
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
    applyOverlap(getSettings().overlap === 'true');
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

  saveSettingsDB(settingsJSON);
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
    if(overlap200.checked) { squares.classList.add('few'); }
    else { squares.classList.remove('few'); }
  } else { // false
    squares.classList.remove('overlap');
  }
}







// #quadvertex-3-1 .lines { stroke-dasharray: 1040; stroke-dashoffset: 1040; }
// #quadvertex-3-1 .lines { animation: dash 2.08s ease-in-out alternate infinite; }

function animationCSS(id, order, style, len) {
  // console.log(id, order, style, len);

  const sheet = document.styleSheets[0];
  // const [...rules] = sheet.cssRules;
  // const syncRuleIndex = rules.findIndex(rule => rule.selectorText === "svg");
  // sheet.deleteRule(syncRuleIndex);
  const styleName = style === 'unique' ? 'quadvertex' : style
  const syncName = `#squares.animate #${styleName}-${order}-${id} .lines`;
  const syncText = `${syncName}{stroke-dasharray:${len};stroke-dashoffset:${len}}`;
  sheet.insertRule(syncText, sheet.cssRules.length);

  const sheetNew = document.styleSheets[0];
  const asyncName = `#squares.animateOddly #${styleName}-${order}-${id} .lines`;
  const asyncText = `
  ${asyncName}{
    animation-name: dash;
    animation-duration: calc(${len}/1000 * var(--speed));
    animation-timing-function: ease-in-out;
    animation-direction: alternate; 
    animation-iteration-count: infinite; 
  }`;
  // console.log(asyncText);
  sheetNew.insertRule(asyncText, sheetNew.cssRules.length);
  // const more = `#squares.animateEvenly svg .lines { animation: dash ${speed}s ease-in-out alternate infinite }`;

//   let output = '';
//   orders.forEach( order => {
//     output += `\n\n/* Order-${order} ${style} ${sync ? 'lengths' : 'speeds'} */`;
//     const index = indices[order];
//     index.forEach( idx => {
//       const len = Object.keys(idx[style])[0];
//       if (sync) {
//         const lengths = `
// #${style}-${order}-${idx.id} .lines { stroke-dasharray: ${len}; stroke-dashoffset: ${len}; }`;
//         output += lengths;
//       } else {
//         const speeds = `
// #${style}-${order}-${idx.id} .lines { animation: dash ${len/1000 * 2}s ease-in-out alternate infinite; }`;
//         output += speeds;
//       }
//     });
//   });
//   download.href = makeTextFile( output );
//   download.innerText = `Download css for ${style} ${sync ? 'lengths' : 'speeds'}`;
//   download.setAttribute('download', `${style}${sync ? 'Lengths' : 'Speeds'}.css`);
}








// IndexedDB

// const idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

// //check for support
// if (!('indexedDB' in window)) {
//   console.log("This browser doesn't support IndexedDB");
//   // return;
// }
// console.log('test hello IDB??');

// // let dbPromise = idb.open('magic', 1);
// let dbPromise = idb.open('magic', 2, (upgradeDb) => {
//   console.log('making a new object store');
//   if (!upgradeDb.objectStoreNames.contains('settings')) {
//     upgradeDb.createObjectStore('settings');
//   }
// });


// function saveSettingsDB(db,settingsJSON) {
//   console.log('adding settings to store in IDB');
//   let tx = db.transaction('settings', 'readwrite');
//   let store = tx.objectStore('settings');
//   return store.add(settingsJSON);
// }

// function doDatabaseStuff(things) {
//   // const db = await openDB(…);
//   idb.open('magic', 1, (upgradeDB) => {
//     let store = upgradeDB.createObjectStore('settings', { keyPath: 'id' });
//     store.put(things);
//   })
// }
// doDatabaseStuff(things);




// window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB;
// const IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction;
// const dbVersion = 1;
// let request = indexedDB.open("magic", dbVersion);
// let idb;
// request.onerror = (event) => {
//   console.error('Indexed DB problem' + event.target.errorCode);
// };
// request.onsuccess = (event) => {
//   console.log('Indexed DB worked');
//   idb = event.target.result;
// };
// request.onupgradeneeded = (event) => { 
//   console.log('Indexed DB add object store');
//   idb = event.target.result;
//   let objectStore = db.createObjectStore("settings", {'key': 'value'});
// };


function saveSettingsDB(setts) {
  console.log('... saving to DB');
  const dbName = "magic";
  let version = 1;
  let request = indexedDB.open(dbName, version);
  request.onerror = event => console.error(event);
  request.onupgradeneeded = event => {
    let db = event.target.result;
    let os = db.createObjectStore("settings", { 
      keyPath: 'id',                                                autoIncrement: true 
    });
    // objectStore.createIndex("style", "style", { unique: true });
    // objectStore.createIndex("order", "order", { unique: true });
    os.transaction.oncomplete = (event) => {
      let store = db.transaction("magic", "readwrite").os("settings");
      console.log('store', store);

      if(store) {
        console.log('store exists');
        var request = store.get(1);
        request.onerror = event => console.error(event);
        request.onsuccess = event => {
          var data = event.target.result;
          console.log('from DB', data);
          // update the value(s) in the object that you want to change
          data.age = 42;

          var requestUpdate = store.put(data);
          requestUpdate.onerror = function(event) {
            // Do something with the error
          };
          requestUpdate.onsuccess = function(event) {
            // Success - the data is updated!
          };
        };

      } else {
        console.log("store doesn't exist");
        store.add( setts );
      }



      // customerData.forEach( customer => customerObjectStore.add(customer) );
    };
  };

}

function updateSettingsDB(setts) {
  const dbName = "magic";
  let version = 1;
  let request = indexedDB.open(dbName, version);
  request.onerror = event => console.error(event);
  request.onupgradeneeded = event => {
    let db = event.target.result;
    var objectStore = db.transaction("magic", "readwrite").objectStore("settings");
    var request = objectStore.get(1);
    request.onerror = event => console.error(event);
    request.onsuccess = event => {
      var data = event.target.result;
      
      // update the value(s) in the object that you want to change
      data.age = 42;

      var requestUpdate = objectStore.put(data);
      requestUpdate.onerror = function(event) {
        // Do something with the error
      };
      requestUpdate.onsuccess = function(event) {
        // Success - the data is updated!
      };
    };

  };

}