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
    for (let i in data) {
      // console.log(data[i]);
      const elem = data[i].svg;
      squares.insertAdjacentHTML('beforeend',elem);
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
  }
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
      // showClass(fl.id);
      (fl.id == "unique") ? showClass("identity") : showClass(fl.id);
    } else {
      // hideClass(fl.id);
      (fl.id == "unique") ? hideClass("identity") : hideClass(fl.id);
    }
  });
})



// 7,14,4,9,15,6,12,1,2,3,13,16,10,11,5,8
// "<svg id='straight-4-2b133453f4f02a667910db1ef7cd6c88' class='identity l3659' viewBox='-2 -2 304 304'><path d='M300,100 0,200 100,200 200,0 200,300 100,100 0,0 300,300 300,0 0,300 100,300 200,100 200,200 100,0 0,100 300,200 300,100 '></path></svg>"

polygon_length();
console.log("test");

function polygon_length() {
  console.log("inside polygon length");
  // let points = el.attr('points');
  // points = points.split(' ');
  let points = '300,100 0,200 100,200 200,0 200,300 100,100 0,0 300,300 300,0 0,300 100,300 200,100 200,200 100,0 0,100 300,200 300,100'.split(' ');
  console.log(points);
  if (points.length > 1) {
    let len = 0;
    console.log("points len > 1", len);
    // measure polygon
    if (points.length > 2) {
      console.log("points len > 2", len);
      for (let i=0; i<points.length-1; i++) {
        console.log(points[i], points[i+1], len);
        len += distance(coord(points[i]), coord(points[i+1]));
      }
    }
    // measure line or measure polygon close line
    len += distance(coord(points[0]), coord(points[points.length-1]));
    console.log("points len end", len);
    return len;
  } else {
    return 0;
  }
}

// distance between two coordinates (vector points)
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