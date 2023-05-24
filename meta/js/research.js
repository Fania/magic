'use strict';

document.body.classList.add("order4");

// const classification = document.getElementById('classification');
// classification.addEventListener('change', () => {
//   console.log('classification change triggered');
//   let x = classification[classification.selectedIndex].value;
//   console.log(x);
//   // filterSquares(x);
//   getData(x);
// });




// function filterSquares(c) {

//   const squares = document.querySelectorAll(`#squares svg`);
//   const matches = document.querySelectorAll(`#squares svg.${c}`);

//   squares.forEach( sq => { sq.classList.add('hide') });
//   matches.forEach( sq => { sq.classList.remove('hide') });

//   if (c == 'all') squares.forEach( sq => { sq.classList.remove('hide') });

// }

const lengths = [];


const lengthsdropdown = document.querySelector("#lengths");
async function populateLengthOptions() {
  // console.log('populateOrderOptions');
  try {
    // const data = await getOrders();
    lengthsdropdown.innerHTML = '';

    // console.log(lengths);
    const uniqlen = _.uniq(lengths);
    // console.log("uniqlen",uniqlen);
    const countlen = _.countBy(lengths);
    console.log("countlen",countlen);


    // same as above ??
    // const difflen = _.intersection(lengths,uniqlen);
    // const difflen = _.difference(lengths,uniqlen);
    // const grouplen = _.groupBy(lengths, Math.round(12));
    // console.log("grouplen",grouplen);
    // console.log("difflen",difflen);
    // console.log(uniqlen === difflen);
    // console.log(uniqlen == difflen);

    for (let i in countlen) {
      const itemLen = i;
      const itemCount= countlen[i];
      const option = document.createElement('option');
      option.value = itemLen;
      option.innerText = `(${itemCount}) ${itemLen}`;
      if(countlen[i] == 4) option.selected = true;
      lengthsdropdown.appendChild(option);
    }
  // console.log('total order choices',document.querySelector('#order').length);
  } catch (error) { console.log(error) }
}


getData("i");

async function getData(filter) {
  // console.log(filter);
  try {
    const squares = document.querySelector(`#squares`);
    squares.innerHTML = "";
    document.body.style.cursor = 'wait !important';
    const url = `/data/flags/${filter}`;
    const rawData = await fetch(url);
    const data = await rawData.json();
    const dataSorted = _.sortBy(data, [function(d) { return d.length }]); 
    for (let i in dataSorted) {
      const elemSVG = dataSorted[i].svg;
      const elemNums = dataSorted[i].array;
      const elemNumsClean = elemNums.toString().replace(/,/g,' ');
      const elemID = dataSorted[i].id;
      const elemFlags = dataSorted[i].flags;
      // display curved line as well as straight line?
      const elemCoords = getCoords(4,elemNums);
      const elemNumSVG = createNumberSVGs(4,elemCoords,elemID,elemFlags);

      const elemText = `
      <figure>
        <div>${elemSVG}${elemNumSVG}</div>
        <figcaption>
          <p>#${elemID}:</p>
          <p>${elemNumsClean}</p>
        </figcaption>
      </figure>
      `

      // squares.insertAdjacentHTML('beforeend',elemSVG);
      squares.insertAdjacentHTML('beforeend',elemText);

      // calculate new lengths for straight lines
      const polylen = polygon_length(dataSorted[i].svg);
      // console.log(polylen);
      lengths.push(polylen);
      // console.log(lengthsdropdown);
      // console.log(dataSorted[i].array);
      // console.log(dataSorted[i].length);
      // console.log(dataSorted[i].svg);
    }
    // if(data.length === 200) {
      // const io = new IntersectionObserver(
      //   entries => {
      //     if(entries[0].isIntersecting) {
      //       offset += 200;
      //       getData(offset);
      //       io.unobserve(entries[0].target);
      //     }
      //   },{}
      // );
      // const sentinel = document.createElement('div');
      // sentinel.classList.add(`sentinel${offset}`);
      // squares.appendChild(sentinel);
      // io.observe(sentinel);
    // }
  } 
  catch (error) { console.log('getData', error) }
  finally { 
    // loading.classList.remove('show'); 
    document.body.style.cursor = 'default !important'; 

    // console.log(lengths.length);
    populateLengthOptions();

  }
}








// Lengths dropdown
// const lengthsdropdown = document.querySelector("#lengths");
lengthsdropdown.addEventListener("change", event => {
  console.log("lengths dropdown");

  // squares.innerHTML = ""
  // getData("i");
  // CHANGE THE CSS

  // data/:n/:s/:o
  // data/order/style/offset


  const fromIndex = lengthsdropdown.selectedIndex;
  const selectedLength = event.target[fromIndex].value;
  console.log(selectedLength);








});














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
    // document.body.classList.toggle("order4");
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









// first check before any change is done
showClass("identity");

const fillabs = document.querySelectorAll("input[class^=filter]");

function showClass(thing) {
  // console.log("show", thing);
  const sheet = document.styleSheets[0];
  const text = `
  .research svg[class*="${thing}"] {
    display: block;
  }`;
  sheet.insertRule(text, sheet.cssRules.length);
}

function hideClass(thing) {
  // console.log("hide", thing);
  const sheet = document.styleSheets[0];
  const [...rules] = sheet.cssRules;
  const svgRuleIndex = rules.findIndex(rule => rule.selectorText === `.research svg[class*="${thing}"]`);
  // console.log(svgRuleIndex);
  sheet.deleteRule(svgRuleIndex);
}

fillabs.forEach(fl => {
  // any subsequent changes
  fl.addEventListener("change", () => { 
    if(fl.checked) {
      (fl.id == "unique") ? showClass("identity") : showClass(fl.id);
    } else {
      (fl.id == "unique") ? hideClass("identity") : hideClass(fl.id);
    }
  });
})




// const noneButt = document.querySelector("#none");
// console.log(noneButt);
// noneButt.addEventListener("change", () => { 

//   const [...sqsvgs] = document.querySelectorAll("#squares svg");
//   sqsvgs.forEach(sq => {

//     sq.classList.add("none");

//   });

// });




const lenButt = document.getElementById('lengthRadio');
const classButt = document.getElementById('classesRadio');
const lenOptButt = document.getElementById('lenOptions');
const ourOptButt = document.getElementById('ourOptions');
const moranOptButt = document.getElementById('moranOptions');
const filterOptButt = document.getElementById('filterOptions');
const mainElem = document.querySelector("main.research");
[lenButt,classButt].forEach( b => {
  b.addEventListener('change', ()=> { 
    console.log(`change triggered by ${b.id}`);
    
    if(lenButt.checked) {
      lenOptButt.classList.remove('hide');
      ourOptButt.classList.add('hide');
      moranOptButt.classList.add('hide');
      filterOptButt.classList.add('hide');
      mainElem.classList.add("lengthClass");
    } else {
      lenOptButt.classList.add('hide');
      ourOptButt.classList.remove('hide');
      moranOptButt.classList.remove('hide');
      filterOptButt.classList.remove('hide');
      mainElem.classList.remove("lengthClass");
    }

  });
});








// 7,14,4,9,15,6,12,1,2,3,13,16,10,11,5,8
// "<svg id='straight-4-2b133453f4f02a667910db1ef7cd6c88' class='identity l3659' viewBox='-2 -2 304 304'><path d='M300,100 0,200 100,200 200,0 200,300 100,100 0,0 300,300 300,0 0,300 100,300 200,100 200,200 100,0 0,100 300,200 300,100 '></path></svg>"

function polygon_length(svg_str) {
  const re = /(\d+,\d+\s)+/g;
  let points = svg_str.match(re);
  points = points[0].trim();
  points = points.split(' ');
  if (points.length > 1) {
    let len = 0;
    if (points.length > 2) {
      for (let i=0; i<points.length-1; i++) {
        len += distance(coord(points[i]), coord(points[i+1]));
      }
    }
    // measure line or measure polygon close line
    len += distance(coord(points[0]), coord(points[points.length-1]));
    // lengths.push(Math.round(len));
    lengths.push(len);
    // console.log("final polygon length", Math.round(len));
    return len;
    // return Math.round(len);
  } else {
    return 0;
  }
}

// distance between two coordinates (vector points)
// remember SVG coords have origin in top left corner
function distance(c1, c2) {
  if (c1 != undefined && c2 != undefined) {
    return Math.sqrt(Math.pow((c2[0]-c1[0]), 2) + Math.pow((c2[1]-c1[1]), 2));
  } else {
    return 0;
  }
}

// parse a pair of string-floats as actual floats
function coord(c_str) {
  let c = c_str.split(',');
  if (c.length != 2) {
    return; // return undefined
  }
  if (isNaN(c[0]) || isNaN(c[1])) {
    return;
  }
  return [parseFloat(c[0]), parseFloat(c[1])];
}



const sizeInc = 100; // scale (line weight hack) 100 is optimal

// order, valuesArray
// export function getCoords(order, valuesArray) {
function getCoords(order=4, valuesArray) {
  // console.log(`creating coordinate system for square ${c}`);
  const coordsObject = {};
  let offset = 0;
  for (let row=0; row < order; row++) {
    for (let col=0; col < order; col++) {
      coordsObject[valuesArray[col+offset]] = [col,row];  // x,y
    }
    offset += order;  // increase offset by one row every 4(order) columns
  }
  return coordsObject;
}

function createNumberSVGs(order=4,coordsObject,id,classes) {
  // console.log(`preparing number matrix svg for square ${counter}`);
  let texts;
  let w = parseInt(order) * sizeInc;
  for (let a in coordsObject) {
    texts += `<text x='${coordsObject[a][0] * 100}' y='${coordsObject[a][1] * 100}'>${a.padStart(2, '0')}</text>`;
  }
  // 0 -50 380 370 for order 4
  return `<svg id='numbers-${order}-${id}' class='${classes}' viewBox='${0} ${-50} ${w-sizeInc+50+30} ${w-sizeInc+50+20}'>${texts}</svg>`;
}
























// https://stackoverflow.com/questions/30355241/get-the-length-of-a-svg-line-rect-polygon-and-circle-tags

// function polygon_length(el) {
//   var points = el.attr('points');
//   points = points.split(' ');
//   if (points.length > 1) {
//     function coord(c_str) {
//       var c = c_str.split(',');
//       if (c.length != 2) {
//         return; // return undefined
//       }
//       if (isNaN(c[0]) || isNaN(c[1])) {
//         return;
//       }
//       return [parseFloat(c[0]), parseFloat(c[1])];
//     }

//     function dist(c1, c2) {
//       if (c1 != undefined && c2 != undefined) {
//         return Math.sqrt(Math.pow((c2[0]-c1[0]), 2) + Math.pow((c2[1]-c1[1]), 2));
//       } else {
//         return 0;
//       }
//     }

//     var len = 0;
//     // measure polygon
//     if (points.length > 2) {
//       for (var i=0; i<points.length-1; i++) {
//         len += dist(coord(points[i]), coord(points[i+1]));
//       }
//     }
//     // measure line or measure polygon close line
//     len += dist(coord(points[0]), coord(points[points.length-1]));
//     return len;
//   } else {
//     return 0;
//   }
// }





// --------------------------------------
// code from original magic-SVG prototype
// --------------------------------------
// function populateOptions(order,style) {
//   // console.log(order, style);
//   lenOptions.innerHTML = "";
//   if(style !== "numbers") {
//     const allLengths = indices[order].map(o => `${Object.keys(o[style])[0]} (${o[style][Object.keys(o[style])[0]].length + 1})`);
//     const list = [...new Set(allLengths.sort())];
//     lenOptions.disabled = false;
//     for (let l in list) {
//       // console.log(list[l]);
//       // let rgx = /\d+/;
//       // const match = list[l].match(/\d+/);
//       const opt = document.createElement("option");
//       // opt.value = list[l].slice(0,4);
//       opt.value = list[l].match(/\d+/);
//       opt.innerText = list[l];
//       // console.log(list[l]);
//       lenOptions.appendChild(opt);
//     }
//   } else {
//     lenOptions.disabled = true;
//   }
// }