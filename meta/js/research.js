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
    const countlen = _.countBy(lengths);
    for (let i in countlen) {
      const itemLen = i;
      const itemCount= countlen[i];
      const option = document.createElement('option');
      option.value = itemLen;
      option.innerText = `(${itemCount}) ${itemLen}`;
      // if(countlen[i] == 0) option.selected = true;
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
    const dataSorted = _.sortBy(data, [(d)=> { return d.length }]); 
    // console.log(dataSorted);
    for (let i in dataSorted) {
      // console.log(dataSorted[i]);
      const elemSVG = dataSorted[i].svg;
      const elemNums = dataSorted[i].array;
      const elemNumsClean = elemNums.toString().replace(/,/g,' ');
      const elemID = dataSorted[i].id;
      const elemFlags = dataSorted[i].flags;
      const elemLen = dataSorted[i].length;
      // display curved line as well as straight line?
      const elemCoords = await getCoords(4,elemNums);
      const elemNumSVG = await createNumberSVGs(4,elemCoords,elemID,elemFlags);
      const elemText = `
      <figure data-length="${elemLen}">
        <div>${elemSVG}${elemNumSVG}</div>
        <div class="orient">
          <svg id="rot-left" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"/></svg>
          <svg id="refl-up-down" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 256 512"><path d="M145.6 7.7C141 2.8 134.7 0 128 0s-13 2.8-17.6 7.7l-104 112c-6.5 7-8.2 17.2-4.4 25.9S14.5 160 24 160H80V352H24c-9.5 0-18.2 5.7-22 14.4s-2.1 18.9 4.4 25.9l104 112c4.5 4.9 10.9 7.7 17.6 7.7s13-2.8 17.6-7.7l104-112c6.5-7 8.2-17.2 4.4-25.9s-12.5-14.4-22-14.4H176V160h56c9.5 0 18.2-5.7 22-14.4s2.1-18.9-4.4-25.9l-104-112z"/></svg>
          <svg id="refl-left-right" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22l0 56-192 0 0-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22l0-56 192 0 0 56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"/></svg>
          <svg id="rot-right" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M125.7 160H176c17.7 0 32 14.3 32 32s-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32v51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z"/></svg>
        </div>
        <figcaption>
          <p>#${elemID}:</p>
          <p>${elemNumsClean}</p>
        </figcaption>
      </figure>
      `
      // squares.insertAdjacentHTML('beforeend',elemSVG);
      squares.insertAdjacentHTML('beforeend',elemText);
      // calculate new lengths for straight lines
      const polylen = await polygon_length(dataSorted[i].svg);
      // polygon_length(dataSorted[i].svg);
      lengths.push(polylen);
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
    await populateLengthOptions();
  }
}








// Lengths dropdown
// filter display of squares based on selection of dropdown
// const lengthsdropdown = document.querySelector("#lengths");
lengthsdropdown.addEventListener("change", event => {
  // console.log("lengths dropdown");
  const fromIndex = lengthsdropdown.selectedIndex;
  const selectedLength = event.target[fromIndex].value;
  // console.log(selectedLength);
  const [...squaresSVGs] = document.querySelectorAll(`#squares figure`);
  squaresSVGs.forEach(sq => {
    // console.log(sq);
    const len = sq.getAttribute("data-length");
    // console.log(len);
    if(len != selectedLength) {
      sq.style.display = "none";
    } else {
      sq.style.display = "block";
    }
  });
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

async function polygon_length(svg_str) {
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
    return len;
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
async function getCoords(order=4, valuesArray) {
  // console.log(`creating coordinate system for square ${c}`);
  const coordsObject = {};
  let offset = 0;
  for (let row=0; row < order; row++) {
    for (let col=0; col < order; col++) {
      coordsObject[valuesArray[col+offset]] = [col,row];  // x,y
    }
    offset += order;  // increase offset by one row every 4(order) columns
  }
  return await coordsObject;
}

async function createNumberSVGs(order=4,coordsObject,id,classes) {
  // console.log(`preparing number matrix svg for square ${counter}`);
  let texts;
  let w = parseInt(order) * sizeInc;
  for (let a in coordsObject) {
    texts += `<text x='${coordsObject[a][0] * 100}' y='${coordsObject[a][1] * 100}'>${a.padStart(2, '0')}</text>`;
  }
  // 0 -50 380 370 for order 4
  return await `<svg id='numbers-${order}-${id}' class='${classes}' viewBox='${0} ${-50} ${w-sizeInc+50+30} ${w-sizeInc+50+20}'>${texts}</svg>`;
}




// async function reorient(direction) {
//   try {
//     console.log('reorient main part');
//     // document.addEventListener('DOMContentLoaded', function(e){
//     if (document.readyState === 'complete') {
// console.log('reorient inside if part');
// console.log(`state: ${document.readyState}`);
// const rot_left = document.getElementById('rot-left');
// console.log(rot_left);
// const rot_right = document.getElementById('rot-right');
// console.log(rot_right);
// const refl_up_down = document.getElementById('refl-up-down');
// console.log(refl_up_down);
// const refl_left_right = document.getElementById('refl-left-right');
// console.log(refl_left_right);

// rot_left.addEventListener("click", () => {
//   console.log(rot_left);
// });
// rot_right.addEventListener("click", () => {
//   console.log(rot_right);
// });
// refl_up_down.addEventListener("click", () => {
//   console.log(refl_up_down);
// });
// refl_left_right.addEventListener("click", () => {
//   console.log(refl_left_right);
// });





// can't be ids - need to be classes!

// MUTATION OBSERVER BABY
// Select the node that will be observed for mutations
const targetNode = document.getElementById('squares');
// Options for the observer (which mutations to observe)
const config = { childList: true };
// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      console.log("Mutation Observer witnessed a change in childList.");

      const listValues = Array.from(targetNode.children)
          .map(node => node.innerHTML)
          .filter(html => html !== '<br>');
      console.log(listValues);

      const rot_left = document.getElementById('rot-left');
      console.log(rot_left);
      const rot_right = document.getElementById('rot-right');
      console.log(rot_right);
      const refl_up_down = document.getElementById('refl-up-down');
      console.log(refl_up_down);
      const refl_left_right = document.getElementById('refl-left-right');
      console.log(refl_left_right);

      rot_left.addEventListener("click", () => {
        console.log(rot_left);
      });
      rot_right.addEventListener("click", () => {
        console.log(rot_right);
      });
      refl_up_down.addEventListener("click", () => {
        console.log(refl_up_down);
      });
      refl_left_right.addEventListener("click", () => {
        console.log(refl_left_right);
      });


    }
  }
};
// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);
// Start observing the target node for configured mutations
observer.observe(targetNode, config);
// Later, you can stop observing
// observer.disconnect();








// document.addEventListener('readystatechange', e => {
//   if(document.readyState === "complete"){
//     console.log(e);
//     // console.log(e);
//     console.log(`state: ${document.readyState}`);
//     console.log('inside readystatechange part');
//     const rot_left = document.getElementById('rot-left');
//     console.log(rot_left);
//     const rot_right = document.getElementById('rot-right');
//     console.log(rot_right);
//     const refl_up_down = document.getElementById('refl-up-down');
//     console.log(refl_up_down);
//     const refl_left_right = document.getElementById('refl-left-right');
//     console.log(refl_left_right);

//   } else {
//     console.log('still loading');
//   }
// });




// const rot_left = document.getElementById('rot-left');
// console.log(rot_left);

// rot_left.addEventListener("click", () => {
//   console.log(rot_left);
// });
















// updown reflect
// {/* <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 256 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M145.6 7.7C141 2.8 134.7 0 128 0s-13 2.8-17.6 7.7l-104 112c-6.5 7-8.2 17.2-4.4 25.9S14.5 160 24 160H80V352H24c-9.5 0-18.2 5.7-22 14.4s-2.1 18.9 4.4 25.9l104 112c4.5 4.9 10.9 7.7 17.6 7.7s13-2.8 17.6-7.7l104-112c6.5-7 8.2-17.2 4.4-25.9s-12.5-14.4-22-14.4H176V160h56c9.5 0 18.2-5.7 22-14.4s2.1-18.9-4.4-25.9l-104-112z"/></svg> */}
// {/* <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/></svg> */}


// right-left refletc
// {/* <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22l0 56-192 0 0-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22l0-56 192 0 0 56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"/></svg> */}
// {/* <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M32 96l320 0V32c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l96 96c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-96 96c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160L32 160c-17.7 0-32-14.3-32-32s14.3-32 32-32zM480 352c17.7 0 32 14.3 32 32s-14.3 32-32 32H160v64c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-96-96c-6-6-9.4-14.1-9.4-22.6s3.4-16.6 9.4-22.6l96-96c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 64H480z"/></svg> */}


// arrow right
// {/* <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"/></svg> */}


// arrow left
// {/* <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M125.7 160H176c17.7 0 32 14.3 32 32s-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32v51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z"/></svg> */}













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