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



// FIRST LOAD

updateOptions();
loadSVGs(getCurrent('order'),getCurrent('style'));
// adjustSize();








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
    settings.style = document.querySelector('input[name="style"]:checked').id;
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
size.addEventListener('input', ()=> { adjust('size') });
const gap = document.getElementById('gap');
gap.addEventListener('input', ()=> { adjust('gap') });
const strokeWidth = document.getElementById('strokeWidth');
strokeWidth.addEventListener('input', ()=> { adjust('strokeWidth') });

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
reset.addEventListener('click', ()=> { 
  const settings = getSettings();
  settings['order'] = parseInt(displayOrder[displayOrder.selectedIndex].value);
  settings['style'] = document.querySelector('input[name="style"]:checked').id;
  settings['amount'] = document.querySelector('input[name="amount"]:checked').id;
  settings['size'] = "20";
  settings['gap'] = "20";
  settings['background'] = "#222222";
  settings['stroke'] = "#FFFFFF";
  settings['strokeWidth'] = "2";
  settings['salpha'] = "255";
  settings['fill'] = "#666666";
  settings['falpha'] = "0";
  settings['animation'] = "off";
  settings['speed'] = 50;
  saveSettings(settings);
});
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



function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
  //The maximum is inclusive and the minimum is inclusive 
}
function getRandomColour() {
  return `#${getHex(getRandomInt(0, 255))}${getHex(getRandomInt(0, 255))}${getHex(getRandomInt(0, 255))}`;
}








// POPULATE THEME OPTIONS
const themes = document.getElementById('themes');

populateThemeOptions();
async function populateThemeOptions() {
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
  try {
    const url = `http://localhost:3000/data/themes`;
    const rawData = await fetch(url);
    const data = await rawData.json();
    const theme = data.rows.find(item => item.id === name).doc;
    console.log(theme);

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
  const settings = getSettings();
  settings[thing] = document.getElementById(thing).value;
  saveSettings(settings);
}



function updateOptions() {
  displayOrder.selectedIndex = parseInt(getCurrent('order')) - 3;
  document.querySelector(`#${getCurrent('style')}`).checked = true;
  document.getElementById('size').value = getCurrent('size');
  document.getElementById('gap').value = getCurrent('gap');
  document.getElementById('strokeWidth').value = getCurrent('strokeWidth');
  document.getElementById('background').value = getCurrent('background');
  document.getElementById('stroke').value = getCurrent('stroke');
  document.getElementById('salpha').value = getCurrent('salpha');
  document.getElementById('fill').value = getCurrent('fill');
  document.getElementById('falpha').value = getCurrent('falpha');
  updateStyles();
}



function updateStyles() {
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
  const settingsString = JSON.stringify(settingsJSON);
  localStorage.setItem("magicSettings", settingsString);
  updateOptions();
  updateStyles();
  // console.log("saving", settingsJSON);
}

function getSettings() {
  const settingsString = localStorage.getItem("magicSettings");
  let settingsJSON = {};
  if (settingsString === null) {
    settingsJSON = { 
      "order":       4,
      "style":       "blocks",
      "amount":      383,
      "size":        "20",
      "gap":         "20",
      "background":  "#222222",
      "stroke":      "#FFFFFF",
      "strokeWidth": "2",
      "salpha":      "255",
      "fill":        "#666666",
      "falpha":      "0",
      "animation":   "off",
      "speed":       50
    }
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