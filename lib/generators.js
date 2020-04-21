'use strict'

const fs = require('fs')
const fetch = require('node-fetch')
// const DomParser = require('dom-parser')
// const parser = new DomParser()
const path = require('svg-path-properties')
const draw = require('./draw.js')

module.exports = {
  index
}



const styles = ['numbers','straight','quadvertex','quadline','arc','altarc'];
// const orders = ['3','4','4R','4RA','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'];



async function index(order) {

  let output = '['
  let lengths = {}

  const rawData = await fetch(`http://localhost:3000/data/${order}/source`)
  const data = await rawData.json()

  for (let i in data.rows) {
    const elem = data.rows[i].doc
    const valuesArray = elem.numbers
  
    styles.forEach( style => {
      const size = parseInt(order)
      const coordsObject = draw.getCoords(size,valuesArray)
      const svgString = draw.prepareSVG(order,style,coordsObject,parseInt(i)+1)
      let len = 0
      if( style !== 'numbers') {
        const re = /d='([\w|\s|\d|,]+)'/;
        const svgPath = svgString.match(re)[1]
        const properties = new path.svgPathProperties(svgPath)
        const totalLength = Math.ceil(properties.getTotalLength())
        len = totalLength
      }
      lengths[style] = [len,svgString]
    })

    // couch JSON needs double quotes
    // id has to be string
    const txt = `
    { "id":         "${parseInt(i) + 1}",
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
  const final = await generateSimilarities(withShared)
  await saveFile(`data/index${order}.json`, final)
}



async function saveFile(fileName, contents) {
  fs.writeFile(fileName, contents, (err) => {
    if (err) return console.log(err)
    console.log(`Saved to ${fileName}!`)
  })
}



async function generateSharedLengths(jsonString) {
  let index = JSON.parse(jsonString)
  styles.forEach( style => {
    if (style != 'numbers') {
      console.log(`Adding in shared ids per length for ${style}`)
      const lengths = index.map(idx => idx[style]['length'])
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
        idx[style]['shared'] = output[l].filter(o => o !== idx.id)
      })
    }
  })
  return JSON.stringify(index)
}



const dups = require('../data/duplicatesSorted.js')
async function generateSimilarities(jsonString) {
  let index = JSON.parse(jsonString)
  console.log('Adding in similarity types')
  index.forEach(idx => {
    idx.quadvertex.type = dups.sorted[idx.id -1][1]
  })
  return JSON.stringify(index)
}









// UNUSED BELOW


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

