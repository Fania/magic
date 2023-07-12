'use strict';

document.body.classList.add("order4");
const lengths = [];
const lengthsdropdown = document.querySelector("#lengths");



const defaults = { 
  "length-filter": true,
  "class-filter": false,
  "lengths-index": 0,
  "unique": false,
  "dayMode": false,
  "MH": false,
  "MV": false,
  "MD1": false,
  "MD2": false,
  "R1": false,
  "R2": false,
  "R3": false,
  "ELARA": false,
  "ASTERIA": false,
  "HESTIA": false,
  "HERA": false,
  "DEMETER": false,
  "NIOBE": false,
  "THAUMAS": false,
  "NEMESIS": false,
  "ARGES": false,
  "ERIS": false,
  "MOROS": false,
  "COTTUS": false,
  "PANDIAGONAL": false,
  "ASSOCIATIVE": false,
  "SELF-COMPL": false
};

// FIRST LOAD
const params = location.search;
if(params) { loadBookmark(params); }
else {
  // clean load, possibly from memory
  populateLengthOptions();
  loadSettings();
  getData();
}





async function populateLengthOptions() {
  // console.log('populateOrderOptions');
  try {
    // const data = await getOrders();
    const lengthsdropdown = document.querySelector("#lengths");
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
          <svg class="rot-left" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><title>Rotate Left</title><path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"/></svg>
          <svg class="refl-up-down" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 256 512"><title>Reflect Up and Down</title><path d="M145.6 7.7C141 2.8 134.7 0 128 0s-13 2.8-17.6 7.7l-104 112c-6.5 7-8.2 17.2-4.4 25.9S14.5 160 24 160H80V352H24c-9.5 0-18.2 5.7-22 14.4s-2.1 18.9 4.4 25.9l104 112c4.5 4.9 10.9 7.7 17.6 7.7s13-2.8 17.6-7.7l104-112c6.5-7 8.2-17.2 4.4-25.9s-12.5-14.4-22-14.4H176V160h56c9.5 0 18.2-5.7 22-14.4s2.1-18.9-4.4-25.9l-104-112z"/></svg>
          <svg class="refl-diag-left-right" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><title>Reflect Left and Right Diagonally</title><path d="M344 0H488c13.3 0 24 10.7 24 24V168c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512H24c-13.3 0-24-10.7-24-24V344c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z"/></svg>
          <svg class="identity" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><title>Identity</title><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm192-96H320c17.7 0 32 14.3 32 32V320c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V192c0-17.7 14.3-32 32-32z"/></svg>
          <svg class="refl-diag-right-left" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" transform="scale(-1,1)"><title>Reflect Right and Left Diagonally</title><path d="M344 0H488c13.3 0 24 10.7 24 24V168c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512H24c-13.3 0-24-10.7-24-24V344c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z"/></svg>
          <svg class="refl-left-right" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><title>Reflect Left and Right</title><path d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22l0 56-192 0 0-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22l0-56 192 0 0 56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"/></svg>
          <svg class="hide-svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z"/></svg>
        </div>
        <figcaption>
          <!-- <p>#${elemID}:</p> -->
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
    await addRotationButtons();

    // // MUTATION OBSERVER BABY
    // // Select the node that will be observed for mutations
    // const targetNode = document.getElementById('squares');
    // // Options for the observer (which mutations to observe)
    // const config = { childList: true };
    // // Callback function to execute when mutations are observed
    // // a mutation is a magic square figure being added into the targetNode
    // const callback = (mutationList, observer) => {
    //   const [...listValues] = targetNode.children;
    //   console.log(listValues);
    //   mutationList.forEach(async mutation => {
    //     if (mutation.type === "childList") {
    //       console.log("Mutation Observer witnessed change in childList.");
    //       await addRotationButtons();
    //     }
    //   });
    // };
    // // Create an observer instance linked to the callback function
    // const observer = new MutationObserver(callback);
    // // Start observing the target node for configured mutations
    // observer.observe(targetNode, config);
    // // Later, you can stop observing
    // // observer.disconnect();
  } // end of finally
} // end of getData








// Lengths dropdown
// filter display of squares based on selection of dropdown
// const lengthsdropdown = document.querySelector("#lengths");
lengthsdropdown.addEventListener("change", async event => {
  // console.log("lengths dropdown");
  const fromIndex = lengthsdropdown.selectedIndex;
  const selectedLength = event.target[fromIndex].value;
  await changeSelectedLength(selectedLength);
});



async function changeSelectedLength(selectedLength) {
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
  adjust('lengths-index');
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
  // console.log("valuesArray", valuesArray);
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

async function createNumberSVGs(order=4,coordsObject,id,classes) {
  // console.log(`preparing number matrix svg for square ${counter}`);
  let texts;
  let w = parseInt(order) * sizeInc;
  for (let a in coordsObject) {
    texts += `<text x='${coordsObject[a][0] * 100}' y='${coordsObject[a][1] * 100}'>${a.padStart(2, '0')}</text>`;
  }
  // 0 -50 380 370 for order 4
  return `<svg id='numbers-${order}-${id}' class='${classes}' viewBox='${0} ${-50} ${w-sizeInc+50+30} ${w-sizeInc+50+20}'>${texts}</svg>`;
}

let datanumcnt = 0;

async function createPolyline(order=4,coordsObject,id,classes) {
  // console.log(`preparing straight polyline svg for square ${counter}`);
  let w = parseInt(order) * sizeInc;
  let coords = "M";
  for (let i in coordsObject) {
    coords += `${coordsObject[i][0] * sizeInc},${coordsObject[i][1] * sizeInc} `;
  }
  coords += `${coordsObject[1][0] * sizeInc},${coordsObject[1][1] * sizeInc} `;

  // const properties = new path.svgPathProperties(coords);
  const properties = new svgPathProperties.svgPathProperties(coords);
  // console.log(properties)
  // const totalLength = Math.ceil(properties.getTotalLength())
  const totalLength = properties.getTotalLength();

  // return `<svg id="num-${num+1}" class="order-x pad" viewBox="${-2} ${-2} ${w-sizeInc+4} ${w-sizeInc+4}"><polyline id="square-${counter}" class="lines" points="${coords}"/></svg>`;
  return `<svg id='straight-${order}-${id}' data-num='${datanumcnt+1}' class='${classes} l${totalLength}' viewBox='${-2} ${-2} ${w-sizeInc+4} ${w-sizeInc+4}'><path d='${coords}'></path></svg>`;
}
















async function addRotationButtons() {
  // console.log("triggered addRotationButtons function");
  // can't be ids - need to be classes!
  const [...identities] = document.querySelectorAll('.identity');
  const [...hide_svgs] = document.querySelectorAll('.hide-svg');
  const [...rot_lefts] = document.querySelectorAll('.rot-left');
  const [...rot_rights] = document.querySelectorAll('.rot-right');
  const [...refl_up_downs] = document.querySelectorAll('.refl-up-down');
  const [...refl_left_rights] = document.querySelectorAll('.refl-left-right');
  const [...refl_diag_left_rights] = document.querySelectorAll('.refl-diag-left-right');
  const [...refl_diag_right_lefts] = document.querySelectorAll('.refl-diag-right-left');

  // let identity_count = 0;
  let rot_left_count = 0;
  let rot_right_count = 0;
  let refl_up_down_count = 0;
  let refl_left_right_count = 0;
  let refl_diag_left_right_count = 0;
  let refl_diag_right_left_count = 0;

  rot_lefts.forEach(rl => {
    rl.addEventListener("click", async () => {
      // console.dir(rl);
      //                   svg  div.orient      div               [svg,svg]
      const old_line_svg = rl.parentElement.previousElementSibling.children[0];
      const old_num_svg = rl.parentElement.previousElementSibling.children[1];
      //               svg  div.orient      figcaption       [p,p]
      const id = rl.parentElement.nextElementSibling.children[0].innerText.substring(1, 33);
      const str_nums = rl.parentElement.nextElementSibling.children[1].innerText.split(" ");
      const parsed_nums = str_nums.map(sn => Number(sn));
      // console.log('parsed_nums',parsed_nums);
      let rot_numbers = [];
      if(rot_left_count == 0){
        rot_numbers = rotate90(parsed_nums);
      }
      if(rot_left_count == 1){
        rot_numbers = rotate180(parsed_nums);
      }
      if(rot_left_count == 2){
        rot_numbers = rotate270(parsed_nums);
      }
      if(rot_left_count == 3){
        rot_numbers = parsed_nums;
        rot_left_count = -1;
      }
      // console.log('rot_numbers',rot_numbers);
      const rot_coords = await getCoords(4,rot_numbers);
      const new_rot_line_svg = await createPolyline(4,rot_coords,id,"");
      const new_rot_num_svg = await createNumberSVGs(4,rot_coords,id,"");
      // console.log(new_rot_line_svg);
      // console.log(new_rot_num_svg);
      old_line_svg.outerHTML = new_rot_line_svg;
      old_num_svg.outerHTML = new_rot_num_svg;
      rot_left_count += 1;
      // const new_old_svg = document.
      // console.log('after',old_line_svg.outerHTML);
      // console.log('after',old_num_svg.outerHTML);
      // rl.style.fill = 'white';
    });
  });
  hide_svgs.forEach(hs => {
    hs.addEventListener("click", async () => {
      const parentFig = hs.parentElement.parentElement;
      parentFig.remove();
    });
  });
  refl_up_downs.forEach(rud => {
    rud.addEventListener("click", async () => {
      const old_line_svg = rud.parentElement.previousElementSibling.children[0];
      const old_num_svg = rud.parentElement.previousElementSibling.children[1];
      const id = rud.parentElement.nextElementSibling.children[0].innerText.substring(1, 33);
      const str_nums = rud.parentElement.nextElementSibling.children[1].innerText.split(" ");
      const parsed_nums = str_nums.map(sn => Number(sn));
      let refl_numbers = [];
      if(refl_up_down_count == 0){
        refl_numbers = reflectH(parsed_nums);
      }
      if(refl_up_down_count == 1){
        refl_numbers = parsed_nums;
        refl_up_down_count = -1;
      }
      const refl_coords = await getCoords(4,refl_numbers);
      const new_refl_line_svg = await createPolyline(4,refl_coords,id,"");
      const new_refl_num_svg = await createNumberSVGs(4,refl_coords,id,"");
      old_line_svg.outerHTML = new_refl_line_svg;
      old_num_svg.outerHTML = new_refl_num_svg;
      refl_up_down_count += 1;
    });
  });
  refl_left_rights.forEach(rlr => {
    rlr.addEventListener("click", async () => {
      const old_line_svg = rlr.parentElement.previousElementSibling.children[0];
      const old_num_svg = rlr.parentElement.previousElementSibling.children[1];
      const id = rlr.parentElement.nextElementSibling.children[0].innerText.substring(1, 33);
      const str_nums = rlr.parentElement.nextElementSibling.children[1].innerText.split(" ");
      const parsed_nums = str_nums.map(sn => Number(sn));
      let refl_numbers = [];
      if(refl_left_right_count == 0){
        refl_numbers = reflectV(parsed_nums);
      }
      if(refl_left_right_count == 1){
        refl_numbers = parsed_nums;
        refl_left_right_count = -1;
      }
      const refl_coords = await getCoords(4,refl_numbers);
      const new_refl_line_svg = await createPolyline(4,refl_coords,id,"");
      const new_refl_num_svg = await createNumberSVGs(4,refl_coords,id,"");
      old_line_svg.outerHTML = new_refl_line_svg;
      old_num_svg.outerHTML = new_refl_num_svg;
      refl_left_right_count += 1;
    });
  });
  identities.forEach(i => {
    i.addEventListener("click", async () => {
      const old_line_svg = i.parentElement.previousElementSibling.children[0];
      const old_num_svg = i.parentElement.previousElementSibling.children[1];
      const id = i.parentElement.nextElementSibling.children[0].innerText.substring(1, 33);
      const str_nums = i.parentElement.nextElementSibling.children[1].innerText.split(" ");
      const parsed_nums = str_nums.map(sn => Number(sn));
      let refl_numbers = [];
      refl_numbers = parsed_nums;
      const refl_coords = await getCoords(4,refl_numbers);
      const new_refl_line_svg = await createPolyline(4,refl_coords,id,"");
      const new_refl_num_svg = await createNumberSVGs(4,refl_coords,id,"");
      old_line_svg.outerHTML = new_refl_line_svg;
      old_num_svg.outerHTML = new_refl_num_svg;
    });
  });
  refl_diag_left_rights.forEach(rdlr => {
    rdlr.addEventListener("click", async () => {
      const old_line_svg = rdlr.parentElement.previousElementSibling.children[0];
      const old_num_svg = rdlr.parentElement.previousElementSibling.children[1];
      const id = rdlr.parentElement.nextElementSibling.children[0].innerText.substring(1, 33);
      const str_nums = rdlr.parentElement.nextElementSibling.children[1].innerText.split(" ");
      const parsed_nums = str_nums.map(sn => Number(sn));
      let refl_numbers = [];
      if(refl_diag_left_right_count == 0){
        // 1 2 3         1 4 7
        // 4 5 6  ---->  2 5 8
        // 7 8 9         3 6 9
        refl_numbers = reflectD1(parsed_nums);
      }
      if(refl_diag_left_right_count == 1){
        refl_numbers = parsed_nums;
        refl_diag_left_right_count = -1;
      }
      const refl_coords = await getCoords(4,refl_numbers);
      const new_refl_line_svg = await createPolyline(4,refl_coords,id,"");
      const new_refl_num_svg = await createNumberSVGs(4,refl_coords,id,"");
      old_line_svg.outerHTML = new_refl_line_svg;
      old_num_svg.outerHTML = new_refl_num_svg;
      refl_diag_left_right_count += 1;
    });
  });
  refl_diag_right_lefts.forEach(rdrl => {
    rdrl.addEventListener("click", async () => {
      const old_line_svg = rdrl.parentElement.previousElementSibling.children[0];
      const old_num_svg = rdrl.parentElement.previousElementSibling.children[1];
      const id = rdrl.parentElement.nextElementSibling.children[0].innerText.substring(1, 33);
      const str_nums = rdrl.parentElement.nextElementSibling.children[1].innerText.split(" ");
      const parsed_nums = str_nums.map(sn => Number(sn));
      let refl_numbers = [];
      if(refl_diag_right_left_count == 0){
        // 1 2 3         9 6 3
        // 4 5 6  ---->  8 5 2
        // 7 8 9         7 4 1
        refl_numbers = reflectD2(parsed_nums);
      }
      if(refl_diag_right_left_count == 1){
        refl_numbers = parsed_nums;
        refl_diag_right_left_count = -1;
      }
      const refl_coords = await getCoords(4,refl_numbers);
      const new_refl_line_svg = await createPolyline(4,refl_coords,id,"");
      const new_refl_num_svg = await createNumberSVGs(4,refl_coords,id,"");
      old_line_svg.outerHTML = new_refl_line_svg;
      old_num_svg.outerHTML = new_refl_num_svg;
      refl_diag_right_left_count += 1;
    });
  });
}





function rotateSVG() {

  const test = [1,2,3,4,5,6,7,8,9];
  console.log(rotate90(test)); // [7, 4, 1, 8, 5, 2, 9, 6, 3]
  console.log(rotate180(test)); // [9, 8, 7, 6, 5, 4, 3, 2, 1]
  console.log(rotate270(test)); // [3, 6, 9, 2, 5, 8, 1, 4, 7]
  console.log(reflectV(test)); // [3, 2, 1, 6, 5, 4, 9, 8, 7]
  console.log(reflectH(test)); // [7, 8, 9, 4, 5, 6, 1, 2, 3]
  console.log(reflectD1(test)); // [1, 4, 7, 2, 5, 8, 3, 6, 9]
  console.log(reflectD2(test)); // [9, 6, 3, 8, 5, 2, 7, 4, 1]

}

// rotateSVG();












// D4 TRANSFORMATIONS

// valuesArray = e.g. [1,2,3,4,5,6,7,8,9]


function getSize(valuesArray) {
  return Math.sqrt(valuesArray.length)
}

function rotate90(valuesArray) {
  // 1 2 3         7 4 1
  // 4 5 6  ---->  8 5 2
  // 7 8 9         9 6 3
  const s = getSize(valuesArray)
  const rows = _.chunk(valuesArray,s)
  const cols = _.zip.apply(_, rows)
  const output = cols.map(c => _.reverse(c))
  return _.flatten(output)
}

function rotate180(valuesArray) {
  // 1 2 3         9 8 7
  // 4 5 6  ---->  6 5 4
  // 7 8 9         3 2 1
  const s = getSize(valuesArray)
  const rows = _.chunk(valuesArray,s)
  const tmp = _.reverse(rows)
  const output = tmp.map(r => _.reverse(r))
  return _.flatten(output)
}

function rotate270(valuesArray) {
  // 1 2 3         3 6 9
  // 4 5 6  ---->  2 5 8
  // 7 8 9         1 4 7
  const s = getSize(valuesArray)
  const rows = _.chunk(valuesArray,s)
  const cols = _.zip.apply(_, rows)
  const output = _.reverse(cols)
  return _.flatten(output)
}

function reflectV(valuesArray) {
  // 1 2 3         3 2 1
  // 4 5 6  ---->  6 5 4
  // 7 8 9         9 8 7
  const s = getSize(valuesArray)
  const rows = _.chunk(valuesArray,s)
  const output = rows.map(r => _.reverse(r))
  return _.flatten(output)
}

function reflectH(valuesArray) {
  // 1 2 3         7 8 9
  // 4 5 6  ---->  4 5 6
  // 7 8 9         1 2 3
  const s = getSize(valuesArray)
  const rows = _.chunk(valuesArray,s)
  const output = _.reverse(rows)
  return _.flatten(output)
}

function reflectD1(valuesArray) {
  // 1 2 3         1 4 7
  // 4 5 6  ---->  2 5 8
  // 7 8 9         3 6 9
  const s = getSize(valuesArray)
  const rows = _.chunk(valuesArray,s)
  const output = _.zip.apply(_, rows)
  return _.flatten(output)
}

function reflectD2(valuesArray) {
  // 1 2 3         9 6 3
  // 4 5 6  ---->  8 5 2
  // 7 8 9         7 4 1
  const s = getSize(valuesArray)
  const rows = _.chunk(valuesArray,s)
  const cols = _.zip.apply(_, rows)
  const tmp = _.reverse(cols)
  const output = tmp.map(t => _.reverse(t))
  return _.flatten(output)
}







// SHARE OPTION
const share = document.getElementById('share');
share.addEventListener('click', ()=> { 
  const settings = getSettings();
  const params = new URLSearchParams(settings);
  // const bookmark = location.origin + '?' + params.toString();
  const bookmark = location.origin + '/research' + '?' + params.toString();

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



function getSettings() {
  console.log('getSettings');
  const settingsString = localStorage.getItem("researchSettings");
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


function saveSettings(settingsJSON) {
  console.log('saveSettings to localStorage');
  const settingsString = JSON.stringify(settingsJSON);
  // console.log(settingsString);
  localStorage.setItem("researchSettings", settingsString);
  loadSettings();
  // applyStyles();
  // console.log("saving", settingsJSON);
  // updateCache(settingsJSON);
  // saveSettingsDB(settingsJSON);
}




async function loadSettings() {
  console.log('loadSettings');
  const settings = getSettings();
  console.log(settings);

  document.querySelector(`#lengthRadio`).checked = settings['length-filter'];
  document.querySelector(`#classesRadio`).checked = settings['class-filter'];
  document.querySelector('#lengths').selectedIndex = settings['lengths-index'];
  document.querySelector('#day').checked = settings['dayMode'];
  document.querySelector('#night').checked = !settings['dayMode'];
  document.querySelector('#unique').checked = settings['unique'];
  document.querySelector('#MH').checked = settings['MH'];
  document.querySelector('#MV').checked = settings['MV'];
  document.querySelector('#MD1').checked = settings['MD1'];
  document.querySelector('#MD2').checked = settings['MD2'];
  document.querySelector('#R1').checked = settings['R1'];
  document.querySelector('#R2').checked = settings['R2'];
  document.querySelector('#R3').checked = settings['R3'];
  document.querySelector('#elara').checked = settings['ELARA'];
  document.querySelector('#asteria').checked = settings['ASTERIA'];
  document.querySelector('#hestia').checked = settings['HESTIA'];
  document.querySelector('#hera').checked = settings['HERA'];
  document.querySelector('#demeter').checked = settings['DEMETER'];
  document.querySelector('#niobe').checked = settings['NIOBE'];
  document.querySelector('#thaumas').checked = settings['THAUMAS'];
  document.querySelector('#nemesis').checked = settings['NEMESIS'];
  document.querySelector('#arges').checked = settings['ARGES'];
  document.querySelector('#eris').checked = settings['ERIS'];
  document.querySelector('#moros').checked = settings['MOROS'];
  document.querySelector('#cottus').checked = settings['COTTUS'];
  document.querySelector('#pandiag').checked = settings['PANDIAGONAL'];
  document.querySelector('#symmetric').checked = settings['ASSOCIATIVE'];
  document.querySelector('#self-compl').checked = settings['SELF-COMPL'];

//   if(settings._id) {
//     const displayTheme = document.getElementById('themes');
//     const themeIndex = displayTheme[displayTheme.selectedIndex].value;
//     displayTheme.selectedIndex = parseInt(settings._id);
//   }
//   // applyStyles();
//   // handleAnimationRadios();
//   // triggerAnimationPause();
}





function adjust(thing) {
  // console.log(`adjust ${thing}`);
  const settings = getSettings();
  // loading.classList.add('show');
  document.body.style.cursor = 'wait !important';
  let x = "";
  switch(thing) {
    case 'length-filter':
      // bool
      x = document.querySelector('#lengthRadio').checked;
      break;
    case 'class-filter':
      // bool
      x = document.querySelector('#classesRadio').checked;
      break;
    case 'lengths-index':
      // number
      x = document.querySelector('#lengths').selectedIndex;
      break;
    case 'dayMode':
      x = document.getElementById('day').checked;
      break;
    default:
      const y = document.getElementById(thing).value;
      x = Number.isNaN(parseInt(y)) ? y : parseInt(y);
  }
  settings[thing] = x;
  saveSettings(settings);
  // if(['order','style','amount'].includes(thing)) {
  //   getData();
  //   populateLengthOptions();
  //   // handleAnimationRadios();
  //   // triggerAnimationPause();
  // }
}




function loadBookmark(params) {
  console.log('loading from BOOKMARK');
  const keyValueStrings = (params.slice(1)).split('&');
  console.log(keyValueStrings);
  const settings = {};
  const checkBool = ['dayMode','length-filter','class-filter','unique','MH','MV','MD1','MD2','R1','R2','R3','ELARA','ASTERIA','HESTIA','HERA','DEMETER','NIOBE','THAUMAS','NEMESIS','ARGES','ERIS','MOROS','COTTUS','PANDIAGONAL','ASSOCIATIVE','SELF-COMPL'];
  const checkNum = ['lengths-index'];
  keyValueStrings.forEach(x => {
    const pair = x.split('=');
    let value = pair[1].replace('%23','#');
    if(checkNum.includes(pair[0])) {
      value = parseInt(value);
    }
    if(checkBool.includes(pair[0])) {
      value = value === 'true';
    }
    settings[pair[0]] = value;
    // if(pair[0] == 'interface' && value == 'hidden') {
    //   toggleInterface();
    // }
    // if(pair[0] == 'gallery' && value == 'true') {
    //   handleGalleryMode();
    // }
  });
  saveSettings(settings);
  populateLengthOptions();
  loadSettings();
  getData();
  // populateOrderOptions();
  // handleAnimationRadios();
  // triggerAnimationPause();
}












night.addEventListener("click", () => {
  document.body.classList.remove("dayMode");
  document.body.style.background = "#222222";
  // document.getElementById('background').value = "#222222";
  // document.getElementById('stroke').value = "#EEEEEE";
  // adjust("background");
  // adjust("stroke");
  adjust("dayMode");
});
day.addEventListener("click", () => {
  document.body.classList.add("dayMode");
  document.body.style.background = "#FFFFFF";
  // document.getElementById('background').value = "#FFFFFF";
  // document.getElementById('stroke').value = "#000000";
  // adjust("background");
  // adjust("stroke");
  adjust("dayMode");
});






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