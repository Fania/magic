'use strict';

document.body.classList.add("order4");


let lengths = [];
let defaultsquares = {};

getData("i");

async function getData(filter) {
  // console.log(filter);
  try {
    const squares = document.querySelector(`#squares`);
    squares.innerHTML = "";
    lengths = [];
    document.body.style.cursor = 'wait !important';
    const url = `/data/flags/${filter}`;
    // const url = `/data/4/straight/0`;
    const rawData = await fetch(url);
    const data = await rawData.json();
    const dataSorted = _.sortBy(data, [function(d) { return d.length }]); 
    for (let i in dataSorted) {
      // console.log(data[i]);
      const elem = dataSorted[i].svg;
      const elemID = dataSorted[i].id;
      const elemLenLong = dataSorted[i].length;
      // const elemLen = parseFloat(elemLenLong).toFixed(6);
      const elemNums = dataSorted[i].array;
      const elemNumsClean = elemNums.toString().replace(/,/g,' ');
      const elemFlags = dataSorted[i].flags;
      const elemCoords = await getCoords(4,elemNums);
      const elemNumSVG = await createNumberSVGs(4,elemCoords,elemID,elemFlags);

      const elemText = `
      <figure data-length="${elemLenLong}">
        <div>${elem}${elemNumSVG}</div>
        <div class="orient">
          <svg class="rot-right" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><title>Rotate Right</title><path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"/></svg>
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
          <p>${elemLenLong}</p>
        </figcaption>
      </figure>
      `
      squares.insertAdjacentHTML('beforeend',elemText);
      // calculate new lengths for straight lines
      // await polygon_length(dataSorted[i].svg);
      lengths.push(elemLenLong);
      defaultsquares[elemID] = elemNumsClean;

    }
    // console.log(lengths);
  } 
  catch (error) { console.log('getData', error) }
  finally { 
    // loading.classList.remove('show'); 
    document.body.style.cursor = 'default !important'; 
    await populateLengthOptions();
    await addRotationButtons();
  }
}

async function getSuzukiData() {
  // console.log('getSuzukiData');
  try {
    const squares = document.querySelector(`#squares`);
    squares.innerHTML = "";
    lengths = [];
    document.body.style.cursor = 'wait !important';
    // const url = `/data/flags/${filter}`;
    const url = `/data/suzuki`;
    const rawData = await fetch(url);
    const data = await rawData.json();
    const dataSorted = _.sortBy(data, [function(d) { return d.length }]); 
    for (let i in dataSorted) {
      // console.log(data[i]);
      const elem = dataSorted[i].svg;
      const elemID = dataSorted[i].id;
      const elemLenLong = dataSorted[i].length;
      const elemLen = parseFloat(elemLenLong).toFixed(6);
      const elemNums = dataSorted[i].array;
      const elemNumsClean = elemNums.toString().replace(/,/g,' ');
      const elemFlags = dataSorted[i].flags;
      const elemCoords = await getCoords(4,elemNums);
      const elemNumSVG = await createNumberSVGs(4,elemCoords,elemID,elemFlags);

      const elemText = `
      <figure data-length="${elemLenLong}">
        <div>${elem}${elemNumSVG}</div>
        <div class="orient">
          <svg class="rot-right" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><title>Rotate Right</title><path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"/></svg>
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
          <p>${elemLenLong}</p>
        </figcaption>
      </figure>
      `
      squares.insertAdjacentHTML('beforeend',elemText);
      // calculate new lengths for straight lines
      // await polygon_length(dataSorted[i].svg);
      lengths.push(elemLenLong);
      defaultsquares[elemID] = elemNumsClean;
    }
    // console.log(lengths);
  } 
  catch (error) { console.log('getSuzukiData', error) }
  finally { 
    // loading.classList.remove('show'); 
    document.body.style.cursor = 'default !important'; 
    await populateLengthOptions();
    await addRotationButtons();
  }
}



// Lengths dropdown
const lengthsdropdown = document.querySelector("#lengths");
lengthsdropdown.addEventListener("change", event => {
  
  const fromIndex = lengthsdropdown.selectedIndex;
  const selectedLen = lengthsdropdown[fromIndex].value;
  const [...squaresSVGs] = document.querySelectorAll(`#squares figure`);
  squaresSVGs.forEach(sq => {
    const len = sq.getAttribute("data-length");
    if(len != selectedLen) {
      sq.style.display = "none";
    } else {
      sq.style.display = "block";
    }
  });
});



async function populateLengthOptions() {
  // console.log('populateOrderOptions');
  try {
    // const data = await getOrders();
    const lengthsdropdown = document.querySelector("#lengths");
    lengthsdropdown.innerHTML = '';
    // console.log(lengths);
    const uniqlen = _.uniq(lengths);
    const countlen = _.countBy(lengths);
    let cnt = 0;
    for (let i in countlen) {
      // i == length
      // console.log(cnt);
      const itemLen = i;
      const itemCount= countlen[i];
      const option = document.createElement('option');
      option.value = itemLen;
      if(cnt==0){
        option.innerText = `(${itemCount}) ${itemLen}`;
        // console.log("inside 0");
        // console.log(option.selected);
        option.selected = true;
      } else {
        // console.log("inside else");
        option.innerText = `(${itemCount}) ${itemLen}`;
      }
      cnt++;
      // if(countlen[i] == 0) option.selected = true;
      lengthsdropdown.appendChild(option);
    }
  // console.log('total order choices',document.querySelector('#order').length);
  } catch (error) { console.log(error) }
}








const raczRad = document.getElementById('raczinskiRadio');
raczRad.addEventListener('change', ()=> { 
  if(raczRad.checked) { 
    // console.log(`change triggered by`, raczRad);
    getData('i');
    // do stuff
  }
});
const suzRad = document.getElementById('suzukiRadio');
suzRad.addEventListener('change', ()=> { 
  if(suzRad.checked) { 
    // console.log(`change triggered by`, suzRad);
    getSuzukiData();
    // do stuff
  }
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

[lenButt,classButt].forEach( b => {
  b.addEventListener('change', ()=> { 
    console.log(`change triggered by ${b.id}`);
    
    if(lenButt.checked) {
      lenOptButt.classList.remove('hide');
      ourOptButt.classList.add('hide');
      moranOptButt.classList.add('hide');
      filterOptButt.classList.add('hide');
    } else {
      lenOptButt.classList.add('hide');
      ourOptButt.classList.remove('hide');
      moranOptButt.classList.remove('hide');
      filterOptButt.classList.remove('hide');
    }

  });
});










async function addRotationButtons() {
  // console.log("triggered addRotationButtons function");
  // can't be ids - need to be classes!
  const [...identities] = document.querySelectorAll('.identity');
  const [...hide_svgs] = document.querySelectorAll('.hide-svg');
  const [...rot_rights] = document.querySelectorAll('.rot-right');
  const [...refl_up_downs] = document.querySelectorAll('.refl-up-down');
  const [...refl_left_rights] = document.querySelectorAll('.refl-left-right');
  const [...refl_diag_left_rights] = document.querySelectorAll('.refl-diag-left-right');
  const [...refl_diag_right_lefts] = document.querySelectorAll('.refl-diag-right-left');

  const defaults = defaultsquares;
  let rot_right_count = 0;
  let refl_up_down_count = 0;
  let refl_left_right_count = 0;
  let refl_diag_left_right_count = 0;
  let refl_diag_right_left_count = 0;

  rot_rights.forEach(rr => {
    rr.addEventListener("click", async () => {
      //                   svg  div.orient      div               [svg,svg]
      const old_line_svg = rr.parentElement.previousElementSibling.children[0];
      const old_num_svg = rr.parentElement.previousElementSibling.children[1];
      const old_str_nums = rr.parentElement.nextElementSibling.children[0];
      const id_before_trim = old_line_svg.attributes[0].value;
      const id = id_before_trim.substring(11);
      const str_nums = old_str_nums.innerText.split(" ");
      const parsed_nums = str_nums.map(sn => Number(sn));
      let rot_numbers = [];
      if(rot_right_count == 0){
        rot_numbers = rotate90(parsed_nums);
      }
      if(rot_right_count == 1){
        rot_numbers = rotate90(parsed_nums);
        rot_right_count = -1;
      }
      const rot_nums_string = rot_numbers.join(' ');
      const rot_coords = await getCoords(4,rot_numbers);
      const new_rot_line_svg = await createPolyline(4,rot_coords,id,"");
      const new_rot_num_svg = await createNumberSVGs(4,rot_coords,id,"");
      old_line_svg.outerHTML = new_rot_line_svg;
      old_num_svg.outerHTML = new_rot_num_svg;
      old_str_nums.innerHTML = rot_nums_string;
      rot_right_count += 1;
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
      const old_str_nums = rud.parentElement.nextElementSibling.children[0];
      const id_before_trim = old_line_svg.attributes[0].value;
      const id = id_before_trim.substring(11);
      const str_nums = old_str_nums.innerText.split(" ");
      const parsed_nums = str_nums.map(sn => Number(sn));
      let refl_numbers = [];
      if(refl_up_down_count == 0){
        refl_numbers = reflectH(parsed_nums);
      }
      if(refl_up_down_count == 1){
        refl_numbers = reflectH(parsed_nums);
        refl_up_down_count = -1;
      }
      const refl_nums_string = refl_numbers.join(' ');
      const refl_coords = await getCoords(4,refl_numbers);
      const new_refl_line_svg = await createPolyline(4,refl_coords,id,"");
      const new_refl_num_svg = await createNumberSVGs(4,refl_coords,id,"");
      old_line_svg.outerHTML = new_refl_line_svg;
      old_num_svg.outerHTML = new_refl_num_svg;
      old_str_nums.innerHTML = refl_nums_string;
      refl_up_down_count += 1;
    });
  });
  refl_left_rights.forEach(rlr => {
    rlr.addEventListener("click", async () => {
      const old_line_svg = rlr.parentElement.previousElementSibling.children[0];
      const old_num_svg = rlr.parentElement.previousElementSibling.children[1];
      const old_str_nums = rlr.parentElement.nextElementSibling.children[0];
      const id_before_trim = old_line_svg.attributes[0].value;
      const id = id_before_trim.substring(11);
      const str_nums = old_str_nums.innerText.split(" ");
      const parsed_nums = str_nums.map(sn => Number(sn));
      let refl_numbers = [];
      if(refl_left_right_count == 0){
        refl_numbers = reflectV(parsed_nums);
      }
      if(refl_left_right_count == 1){
        refl_numbers = reflectV(parsed_nums);
        refl_left_right_count = -1;
      }
      const refl_nums_string = refl_numbers.join(' ');
      const refl_coords = await getCoords(4,refl_numbers);
      const new_refl_line_svg = await createPolyline(4,refl_coords,id,"");
      const new_refl_num_svg = await createNumberSVGs(4,refl_coords,id,"");
      old_line_svg.outerHTML = new_refl_line_svg;
      old_num_svg.outerHTML = new_refl_num_svg;
      old_str_nums.innerHTML = refl_nums_string;
      refl_left_right_count += 1;
    });
  });
  identities.forEach(i => {
    i.addEventListener("click", async () => {
      const old_line_svg = i.parentElement.previousElementSibling.children[0];
      const old_num_svg = i.parentElement.previousElementSibling.children[1];
      const old_str_nums = i.parentElement.nextElementSibling.children[0];
      const id_before_trim = old_line_svg.attributes[0].value;
      const id = id_before_trim.substring(11);
      let id_numbers = [];
      id_numbers = defaults[id].split(' ');
      const new_id_str = defaults[id];
      const id_coords = await getCoords(4,id_numbers);
      const new_id_line_svg = await createPolyline(4,id_coords,id,"");
      const new_id_num_svg = await createNumberSVGs(4,id_coords,id,"");
      old_line_svg.outerHTML = new_id_line_svg;
      old_num_svg.outerHTML = new_id_num_svg;
      old_str_nums.innerHTML = new_id_str;
    });
  });
  refl_diag_left_rights.forEach(rdlr => {
    rdlr.addEventListener("click", async () => {
      const old_line_svg = rdlr.parentElement.previousElementSibling.children[0];
      const old_num_svg = rdlr.parentElement.previousElementSibling.children[1];
      const old_str_nums = rdlr.parentElement.nextElementSibling.children[0];
      const id_before_trim = old_line_svg.attributes[0].value;
      const id = id_before_trim.substring(11);
      const str_nums = old_str_nums.innerText.split(" ");
      const parsed_nums = str_nums.map(sn => Number(sn));
      let refl_numbers = [];
      if(refl_diag_left_right_count == 0){
        // 1 2 3         1 4 7
        // 4 5 6  ---->  2 5 8
        // 7 8 9         3 6 9
        refl_numbers = reflectD1(parsed_nums);
      }
      if(refl_diag_left_right_count == 1){
        refl_numbers = reflectD1(parsed_nums);
        refl_diag_left_right_count = -1;
      }
      const new_refl_nums_string = refl_numbers.join(' ');
      const refl_coords = await getCoords(4,refl_numbers);
      const new_refl_line_svg = await createPolyline(4,refl_coords,id,"");
      const new_refl_num_svg = await createNumberSVGs(4,refl_coords,id,"");
      old_line_svg.outerHTML = new_refl_line_svg;
      old_num_svg.outerHTML = new_refl_num_svg;
      old_str_nums.innerHTML = new_refl_nums_string;
      refl_diag_left_right_count += 1;
    });
  });
  refl_diag_right_lefts.forEach(rdrl => {
    rdrl.addEventListener("click", async () => {
      const old_line_svg = rdrl.parentElement.previousElementSibling.children[0];
      const old_num_svg = rdrl.parentElement.previousElementSibling.children[1];
      const old_str_nums = rdrl.parentElement.nextElementSibling.children[0];
      const id_before_trim = old_line_svg.attributes[0].value;
      const id = id_before_trim.substring(11);
      const str_nums = old_str_nums.innerText.split(" ");
      const parsed_nums = str_nums.map(sn => Number(sn));
      let refl_numbers = [];
      if(refl_diag_right_left_count == 0){
        // 1 2 3         9 6 3
        // 4 5 6  ---->  8 5 2
        // 7 8 9         7 4 1
        refl_numbers = reflectD2(parsed_nums);
      }
      if(refl_diag_right_left_count == 1){
        refl_numbers = reflectD2(parsed_nums);
        refl_diag_right_left_count = -1;
      }
      const new_refl_nums_string = refl_numbers.join(' ');
      const refl_coords = await getCoords(4,refl_numbers);
      const new_refl_line_svg = await createPolyline(4,refl_coords,id,"");
      const new_refl_num_svg = await createNumberSVGs(4,refl_coords,id,"");
      old_line_svg.outerHTML = new_refl_line_svg;
      old_num_svg.outerHTML = new_refl_num_svg;
      old_str_nums.innerHTML = new_refl_nums_string;
      refl_diag_right_left_count += 1;
    });
  });
}















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
    // console.log(len);
    const lenInt = parseFloat(len).toFixed(6);
    lengths.push(lenInt);
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

