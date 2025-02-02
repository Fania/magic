'use strict'

const path = require('svg-path-properties')
const randomColor = require('randomcolor')


module.exports = {
  getCoords,
  prepareSVG
}



const sizeInc = 100; // scale (line weight hack) 100 is optimal



function getSize(coordsObject) {
  return Math.sqrt(Object.keys(coordsObject).length);
}



// order, valuesArray
// export function getCoords(order, valuesArray) {
function getCoords(order, valuesArray) {
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



// style, coordsObject, id
// export function prepareSVG(order, style, coordsObject, id) {
function prepareSVG(order,style,coordsObject,id,classesArray) {
  // console.log(`preparing ${style} SVG for square ${c}`);
  // console.log(classesArray)
  // console.log(typeof classesArray)
  // console.log(classesArray)
  const classes = classesArray.join(" ");
  // console.log(classes)

  switch(style) {
    case "numbers":
      return createNumberSVGs(order,coordsObject,id,classes);
    case "straight":
      return createPolyline(order,coordsObject,id,classes);
    case "quadvertex":
      return createQuadraticCurveVertices(order,coordsObject,id,classes);
    case "quadline":
      return createQuadraticCurveLines(order,coordsObject,id,classes);
    case "arc":
      return createArc(order,coordsObject,id,classes);
    case "altarc":
      return createArcAlt(order,coordsObject,id,classes);
    case "circles":
      return createCirclesSVGs(order,coordsObject,id,classes);
    case "blocks":
      return createBlocksSVGs(order,coordsObject,id,classes);
    case "tetromino":
      return createTetrominoSVGs(order,coordsObject,id,classes);
    default:
      return createQuadraticCurveVertices(order,coordsObject,id,classes);
  }
}




function createNumberSVGs(order,coordsObject,id,classes) {
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

function createPolyline(order,coordsObject,id,classes) {
  // console.log(`preparing straight polyline svg for square ${counter}`);
  let w = parseInt(order) * sizeInc;
  let coords = "M";
  for (let i in coordsObject) {
    coords += `${coordsObject[i][0] * sizeInc},${coordsObject[i][1] * sizeInc} `;
  }
  coords += `${coordsObject[1][0] * sizeInc},${coordsObject[1][1] * sizeInc} `;

  const properties = new path.svgPathProperties(coords)
  // console.log(properties)
  // const totalLength = Math.ceil(properties.getTotalLength())
  const totalLength = properties.getTotalLength()

  // return `<svg id="num-${num+1}" class="order-x pad" viewBox="${-2} ${-2} ${w-sizeInc+4} ${w-sizeInc+4}"><polyline id="square-${counter}" class="lines" points="${coords}"/></svg>`;
  return `<svg id='straight-${order}-${id}' data-num='${datanumcnt+1}' class='${classes} l${totalLength}' viewBox='${-2} ${-2} ${w-sizeInc+4} ${w-sizeInc+4}'><path d='${coords}'></path></svg>`;
}


// quadratic bezier curves
// this function generates the vertices needed
function createQuadraticCurveVertices(order,coordsObject,id,classes) {
  // console.log(`preparing quadratic curve on vertices svg for square ${counter}`);
  let w = parseInt(order) * sizeInc;
  // console.log(order, parseInt(order), w);

  let fstx = coordsObject[1][0] * sizeInc;
  let fsty = coordsObject[1][1] * sizeInc;
  let sndx = coordsObject[2][0] * sizeInc;
  let sndy = coordsObject[2][1] * sizeInc;
  let fstmx = (fstx + sndx) / 2;
  let fstmy = (fsty + sndy) / 2;
  
  let coords = `M ${fstmx},${fstmy} `;

  for (let a=1; a <= Object.keys(coordsObject).length; a++) {
    let c1x = coordsObject[a][0] * sizeInc;
    let c1y = coordsObject[a][1] * sizeInc;
    let c2x, c2y, c3x, c3y;

    // next to last
    if (a == (Object.keys(coordsObject).length)) {
      c2x = coordsObject[1][0] * sizeInc;
      c2y = coordsObject[1][1] * sizeInc;
      c3x = coordsObject[2][0] * sizeInc;
      c3y = coordsObject[2][1] * sizeInc;

    // last
    } else if (a == (Object.keys(coordsObject).length - 1)) {
      c2x = coordsObject[a+1][0] * sizeInc;
      c2y = coordsObject[a+1][1] * sizeInc;
      c3x = coordsObject[1][0] * sizeInc;
      c3y = coordsObject[1][1] * sizeInc;

    // all previous
    } else {
      c2x = coordsObject[a+1][0] * sizeInc;
      c2y = coordsObject[a+1][1] * sizeInc;
      c3x = coordsObject[a+2][0] * sizeInc;
      c3y = coordsObject[a+2][1] * sizeInc;
    }

    let m1x = (c1x + c2x) / 2;
    let m1y = (c1y + c2y) / 2;
    let m2x = (c2x + c3x) / 2;
    let m2y = (c2y + c3y) / 2;

    // console.log(c1x, c1y, m1x, m1y, c2x, c2y, m2x, m2y, c3x, c3y);
    coords += `Q ${c2x},${c2y} ${m2x},${m2y} `;
  }

  const properties = new path.svgPathProperties(coords)
  // const totalLength = Math.ceil(properties.getTotalLength())
  const totalLength = properties.getTotalLength()

  return `<svg id='quadvertex-${order}-${id}' class='${classes} l${totalLength}' viewBox='${-2} ${-2} ${w-sizeInc+4} ${w-sizeInc+4}'><path d='${coords}'></path></svg>`;
}


// quadratic bezier curves
// this function creates bezier curves 
function createQuadraticCurveLines(order,coordsObject,id,classes) {
  // console.log(`preparing quadratic curve on lines svg for square ${counter}`);
  let w = parseInt(order) * sizeInc;
  let len = Object.keys(coordsObject).length;
  let coords = `M ${coordsObject[1][0] * sizeInc},${coordsObject[1][1] * sizeInc} `;
  // for (let a=2; a <= (len - 1); a = a+2) {
  for (let a=2; a <= (len - 1); a = a+2) {
    coords += `Q ${coordsObject[a][0] * sizeInc},${coordsObject[a][1] * sizeInc} ${coordsObject[a+1][0] * sizeInc},${coordsObject[a+1][1] * sizeInc} `;
  }
  coords += `Q ${coordsObject[len][0] * sizeInc},${coordsObject[len][1] * sizeInc} ${coordsObject[1][0] * sizeInc},${coordsObject[1][1] * sizeInc} `;  // loop back

  const properties = new path.svgPathProperties(coords)
  // const totalLength = Math.ceil(properties.getTotalLength())
  const totalLength = properties.getTotalLength()

  return `<svg id='quadline-${order}-${id}' class='${classes} l${totalLength}' viewBox='${-2} ${-2} ${w-sizeInc+4} ${w-sizeInc+4}'><path d='${coords}'></path></svg>`;
}


function createArc(order,coordsObject,id,classes) {
  // console.log(`preparing arc experiment svg for square ${counter}`);
  let w = parseInt(order) * sizeInc;
  let coords = `M${coordsObject[1][0] * sizeInc},${coordsObject[1][1] * sizeInc} `;
  for (let a=1; a <= (Object.keys(coordsObject).length); a++) {
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#Arcs
    coords += `A 50,50 0 1 1 ${coordsObject[a][0] * sizeInc},${coordsObject[a][1] * sizeInc} `;
  }
  coords += `A 50,50 0 1 1 ${coordsObject[1][0] * sizeInc},${coordsObject[1][1] * sizeInc} `;

  const properties = new path.svgPathProperties(coords)
  // const totalLength = Math.ceil(properties.getTotalLength())
  const totalLength = properties.getTotalLength()

  return `<svg id='arc-${order}-${id}' class='${classes} l${totalLength}' viewBox='${-200} ${-170} ${w-sizeInc+380} ${w-sizeInc+380}'><path d='${coords}'></path></svg>`;
}


function createArcAlt(order,coordsObject,id,classes) {
  // console.log(`preparing arc experiment svg for square ${counter}`);
  let w = parseInt(order) * sizeInc;
  let coords = `M${coordsObject[1][0] * sizeInc},${coordsObject[1][1] * sizeInc} `;
  for (let a=2; a <= (Object.keys(coordsObject).length - 1); a = a+2) {
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#Arcs
    coords += `A 10,10 0 1 1 ${coordsObject[a][0] * sizeInc},${coordsObject[a][1] * sizeInc} `;
  }
  coords += `A 10,10 0 1 1 ${coordsObject[1][0] * sizeInc},${coordsObject[1][1] * sizeInc} `;

  const properties = new path.svgPathProperties(coords)
  // const totalLength = Math.ceil(properties.getTotalLength())
  const totalLength = properties.getTotalLength()

  return `<svg id='altarc-${order}-${id}' class='${classes} l${totalLength}' viewBox='${-200} ${-170} ${w-sizeInc+380} ${w-sizeInc+380}'><path d='${coords}'></path></svg>`;
}



// const nums = [1,2,15,16,12,14,3,5,13,7,10,4,8,11,6,9]
// const coords = getCoords(4, nums) 
// // const svg1 = createNumColoursSVGs(4, coords, 0)
// const svg2 = createColourBlocksSVGs(4, coords, 0)
// // console.log( svg1 )
// console.log( svg2 )

function createCirclesSVGs(order,coordsObject,id,classes) {
  // console.log(`preparing number matrix svg for square ${counter}`);
  let blobs;
  let w = parseInt(order) * sizeInc;
  for (let a in coordsObject) {
    let randCol = randomColor();
    blobs += `<circle cx='${coordsObject[a][0] * 100}' cy='${coordsObject[a][1] * 100}' r='40' fill='${randCol}' stroke='${randCol}'></circle>`;
  }
  return `<svg id='circles-${order}-${id}' class='${classes}' viewBox='${-50} ${-50} ${w} ${w}'>${blobs}</svg>`;
}

function createTetrominoSVGs(order,coordsObject,id,classes) {
  // console.log(`preparing number matrix svg for square ${counter}`);
  let blobs
  let w = parseInt(order) * sizeInc
  // console.log(w)
  
  for (let a in coordsObject) {
    const dRoot = digitalRoot( parseInt(a) )
    blobs += tetromino(a, dRoot, coordsObject);
  }
  // return `<svg id='colours-${order}-${id}' class='order-xt pad' viewBox='${-200} ${-170} ${w-sizeInc+380} ${w-sizeInc+380}'>${blobs}</svg>`;
  return `<svg id='tetromino-${order}-${id}' class='${classes}' viewBox='${-50} ${-50} ${w+50} ${w+50}'>${blobs}</svg>`;
}


function createBlocksSVGs(order,coordsObject,id,classes) {
  // console.log(`preparing number matrix svg for square ${counter}`);
  let blobs
  let w = parseInt(order) * sizeInc
  // console.log(w)
  for (let a in coordsObject) {
    const dRoot = digitalRoot( parseInt(a) )
    blobs += `<path class='num-${dRoot}' d='M${coordsObject[a][0] * 100},${coordsObject[a][1] * 100} h100 v100 h-100 z'></path>`
  }
  // return `<svg id='colours-${order}-${id}' class='order-xt pad' viewBox='${-200} ${-170} ${w-sizeInc+380} ${w-sizeInc+380}'>${blobs}</svg>`;
  return `<svg id='blocks-${order}-${id}' class='${classes}' viewBox='${0} ${0} ${w} ${w}'>${blobs}</svg>`;
}





// HELPERS
let tetroCols = randomColor({
  count: 9
});
function tetromino(n,dRoot,coordsObject) {
  switch(dRoot) {
    case 1:
      return `<path stroke='${tetroCols[0]}' fill='${tetroCols[0]}' d='M${coordsObject[n][0] * 100},${coordsObject[n][1] * 100} h50 v50 h-50 z'></path>`
    case 2:
      return `<path stroke='${tetroCols[1]}' fill='${tetroCols[1]}' d='M${coordsObject[n][0] * 100},${coordsObject[n][1] * 100} h100 v50 h-100 z'></path>`
    case 3:
      return `<path stroke='${tetroCols[2]}' fill='${tetroCols[2]}' d='M${coordsObject[n][0] * 100},${coordsObject[n][1] * 100} h50 v100 h-50 z'></path>`
    case 4:
      return `<path stroke='${tetroCols[3]}' fill='${tetroCols[3]}' d='M${(coordsObject[n][0] * 100)-50},${(coordsObject[n][1] * 100)-50} h100 v50 h-50 v50 h-50 z'></path>`
    case 5:
      return `<path stroke='${tetroCols[4]}' fill='${tetroCols[4]}' d='M${(coordsObject[n][0] * 100)},${(coordsObject[n][1] * 100)-50} h50 v50 h50 v100 h-50 v-50 h-50 z'></path>`
    case 6:
      return `<path stroke='${tetroCols[5]}' fill='${tetroCols[5]}' d='M${(coordsObject[n][0] * 100)},${(coordsObject[n][1] * 100)} v-50 h100 v50 h-50 v50 h-100 v-50 z'></path>`
    case 7:
      return `<path stroke='${tetroCols[6]}' fill='${tetroCols[6]}' d='M${(coordsObject[n][0] * 100)-50},${(coordsObject[n][1] * 100)} h100 v-50 h50 v100 h-150 z'></path>`
    case 8:
      return `<path stroke='${tetroCols[7]}' fill='${tetroCols[7]}' d='M${(coordsObject[n][0] * 100)},${(coordsObject[n][1] * 100)} h100 v100 h-100 z'></path>`
    case 9:
      return `<path stroke='${tetroCols[8]}' fill='${tetroCols[8]}' d='M${(coordsObject[n][0] * 100)-50},${(coordsObject[n][1] * 100)-50} h100 v50 h-50 v50 h-50 z'></path>`
  }

}



function digitalRoot(n) {
  if( n < 10 ) {
    return n;
  } else {
    return digitalRoot( n % 10 + Math.floor(digitalRoot( n / 10 )) );
  }
}