'use strict'
const fs = require('fs')
// import fs from 'fs'
const fetch = require('node-fetch')
// import fetch from 'node-fetch'
const DomParser = require('dom-parser')
// import DomParser from 'dom-parser'
const parser = new DomParser()

const point = require('point-at-length')
// import point from 'point-at-length'

// import { getCoords, prepareSVG } from './draw.js'
require('./draw.js')



module.exports = {
  initialIndex
}



const styles = ['numbers','straight','quadvertex','quadline','arc','altarc'];
const orders = ['3','4','4R','4RA','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'];




// STEP 1
// create master index with lengths and svg data
// export async function initialIndex(order) {
async function initialIndex(order) {

  let output = '['
  let lengths = {}

  const rawData = await fetch(`http://localhost:3000/data/${order}/source`)
  const data = await rawData.json()

  for (let i in data.rows) {
    const elem = data.rows[i].doc
    const valuesArray = elem.numbers
  
    styles.forEach( style => {
      const size = parseInt(order)
      const coordsObject = getCoords(size,valuesArray)
      const svgString = prepareSVG(order,style,coordsObject,parseInt(i)+1)
      const svg = parser.parseFromString(svgString, 'text/html')
      const path = svg.getElementsByClassName('lines')[0]
      const len = style == 'numbers' ? 0
                  : Math.ceil(point(path.getAttribute('d')).length())
      lengths[style] = [len,svgString]
    })

    const txt = `
    { "id":         ${parseInt(i) + 1},
      "numbers":    { "array": [${valuesArray}],
                      "svg": "${lengths.numbers[1]}" },
      "straight":   { "length": ${lengths.straight[0]},
                      "shared": [], 
                      "svg": "${lengths.straight[1]}" },
      "quadvertex": { "length": ${lengths.quadvertex[0]},
                      "shared": [],
                      "type": "",
                      "svg": "${lengths.quadvertex[1]}" },
      "quadline":   { "length": ${lengths.quadline[0]},
                      "shared": [], 
                      "svg": "${lengths.quadline[1]}" },
      "arc":        { "length": ${lengths.arc[0]},
                      "shared": [], 
                      "svg": "${lengths.arc[1]}" },
      "altarc":     { "length": ${lengths.altarc[0]},
                      "shared": [], 
                      "svg": "${lengths.altarc[1]}" }
    }${ (parseInt(i) !== ((data.rows).length -1)) ? ',' : '' }`
    output += txt
  }
  output += ']'

  const withShared = await generateSharedLengths(output)

  saveFile('data/outputs.json', withShared)

}

// generateInitialIndex(order)


function saveFile(fileName, contents) {
  fs.writeFile(fileName, contents, (err) => {
    if (err) return console.log(err)
    console.log(`Saved ${fileName}!`)
  })
}



async function generateSharedLengths(jsonString) {
  let index = JSON.parse(jsonString)
  styles.forEach( style => {
    if (style != 'numbers') {
      console.log(`generating shared ids for ${style}`)
      const lengths = index.map(idx => idx[style]['length'])
      // console.log(lengths)
      let output = {}
      lengths.forEach( len => {
        const matches = index.filter(idx => idx[style]['length'] === len)
        const similarIDs = matches.map(m => m.id)
        output[len] = similarIDs
      });
      // add shared lengths into index
      [...index].forEach( idx => {
        const l = idx[style]['length']
        // remove self
        idx[style]['length'] = output[l].filter(o => o !== idx.id)
      })
    }
  })
  return JSON.stringify(index)
}







// STEP 2
// add shared lengths into master index
// function generateSharedLengths(index) {
//   styles.forEach( style => {
//     if (style != 'numbers') {
//       const lengths = index.map(i => Object.keys(i[style])[0]);
//       let output = {};
//       lengths.forEach( len => {
//         const matches = index.filter(i => Object.keys(i[style])[0] == len);
//         const similarIDs = matches.map(m => m.id);
//         output[len] = similarIDs;
//       });
//       // add shared lengths into index
//       index.forEach( idx => {
//         const l = Object.keys( idx[style] )[0];
//         idx[style][l] = output[l].filter(o => o !== idx.id);  // remove self
//       });
//     }
//   });
//   return index;
// }









// STEP 3
// GENERATE NEW INDEX HERE IN ONE COMMAND
function printNewIndex(order) {
  let final = generateSharedLengths( generateInitialIndex(order) );
  if(order === '4R') final = generateSimilarities(final);
  const fullText = `const index${order} = ${JSON.stringify(final)};`;
  download.href = makeTextFile( fullText );
  download.innerText = `Download index for order ${order}`;
  download.setAttribute('download', `index${order}.js`);
}

// printNewIndex( '4RA' );










// STEP 4
// add similarity data from manual list
function generateSimilarities(index) {
  // console.log(index);
  index.forEach(idx => {
    // console.log(idx);
    idx['simQuadVertex'] = duplicatesSorted[idx.id -1][1];
  });
  return index;
}
// console.log( generateSimilarities(indexFania880) );














// DOWNLOAD FILE
function makeTextFile(text) {
  let textFile = null;
  const data = new Blob([text], {type: 'text/plain'});
  // If replacing a previously generated file
  // manually revoke object URL to avoid memory leaks.
  textFile !== null ? window.URL.revokeObjectURL(textFile)
                    : textFile = window.URL.createObjectURL(data);
  return textFile;
}







// function generateStats(index) {
//   for (let i in index) {
//     let id = parseInt(i) + 1;
//     let valuesArray = index[i]['numbers']['array'];
//     console.log(id, valuesArray);
//     // let order = Math.sqrt(valuesArray.length);
//     // index[i]['numbers']['svg'] = prepareSVG('numbers',getCoords(order,valuesArray),id);
//   }
//   return index;
// }


// // generateStats( index4 );
// // console.log( generateStats( index4 ) );














// GENERATE ANIMATION CSS
function printNewAnimCSS(style, sync) {
  let output = '';
  orders.forEach( order => {
    output += `\n\n/* Order-${order} ${style} ${sync ? 'lengths' : 'speeds'} */`;
    const index = indices[order];
    index.forEach( idx => {
      const len = Object.keys(idx[style])[0];
      if (sync) {
        const lengths = `
#${style}-${order}-${idx.id} .lines { stroke-dasharray: ${len}; stroke-dashoffset: ${len}; }`;
        output += lengths;
      } else {
        const speeds = `
#${style}-${order}-${idx.id} .lines { animation: dash ${len/1000 * 2}s ease-in-out alternate infinite; }`;
        output += speeds;
      }
    });
  });
  download.href = makeTextFile( output );
  download.innerText = `Download css for ${style} ${sync ? 'lengths' : 'speeds'}`;
  download.setAttribute('download', `${style}${sync ? 'Lengths' : 'Speeds'}.css`);
}

// printNewAnimCSS( 'altarc', false );

