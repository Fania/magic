'use strict'

const fs = require('fs')
const path = require('svg-path-properties')
const draw = require('./draw.js')
const couch = require('./couch.js')

module.exports = {
  index,
  indexLARGE,
  source,
  sourceAdditions,
  svgData
}


function log(message) { process.stdout.write(message) }



const styles = ['numbers','straight','quadvertex','quadline','arc','altarc','circles','blocks','tetromino'];



async function index(order) {
  try {
    console.log( `-------------- ORDER ${order} SETUP -----------------` )
    // await couch.areThereChanges(order)
    let output = '['
    let lengths = {}
    const sourceData = fs.readFileSync(`./data/source${order}.json`)
    const data = JSON.parse(sourceData)
    for (let i in data) {
      const valuesArray = data[i]
      styles.forEach( style => {
        const size = parseInt(order)
        const coordsObject = draw.getCoords(size,valuesArray)
        const svgString = draw.prepareSVG(order,style,coordsObject,parseInt(i)+1)
        let len = 0
        if( style !== 'numbers' && style !== 'circles' && style !== 'blocks' && style !== 'tetromino' ) {
          const re = /d='([\w|\s|\d|,]+)'/;
          const svgPath = svgString.match(re)[1]
          const properties = new path.svgPathProperties(svgPath)
          const totalLength = Math.ceil(properties.getTotalLength())
          len = totalLength
        }
        lengths[style] = [len,svgString]
      })
      const txt = `{
        "_id":         "${parseInt(i) + 1}",
        "numbers":    { "array": [${valuesArray}],
                        "svg": "${lengths.numbers[1]}" },
        "straight":   { "length": ${lengths.straight[0]},
                        "svg": "${lengths.straight[1]}" },
        "quadvertex": { "length": ${lengths.quadvertex[0]},
                        "svg": "${lengths.quadvertex[1]}" },
        "quadline":   { "length": ${lengths.quadline[0]},
                        "svg": "${lengths.quadline[1]}" },
        "arc":        { "length": ${lengths.arc[0]},
                        "svg": "${lengths.arc[1]}" },
        "altarc":     { "length": ${lengths.altarc[0]},
                        "svg": "${lengths.altarc[1]}" },
        "circles":    { "svg": "${lengths.circles[1]}" },
        "blocks":     { "svg": "${lengths.blocks[1]}" },
        "tetromino":  { "svg": "${lengths.tetromino[1]}" }
      }${ (parseInt(i) !== (data.length -1)) ? ',' : '' }`
      output += txt
    }
    output += ']'
    // const withShared = await generateSharedLengths(output)
    let final = output
    if ( order === '4' || order === 4 ) {
      const withSims = await generateSimilarities(output)
      final = withSims
    }
    // await saveFile(`data/index${order}.json`, final)
    const finalJSON = JSON.parse(final)
    // console.log( finalJSON, order )
    // console.log( 'about to call cunt.test:', order )
    // await cunt.test(finalJSON, order)
    return finalJSON
  } catch (error) { console.log( 'index:', error ) }
  finally { 
    // console.log( '-------------------- END ---------------------' )
  }
}


const dups = require('../data/duplicatesSorted.js')
async function generateSimilarities(jsonString) {
  let index = JSON.parse(jsonString)
  console.log('Adding in similarity types for order 4')
  index.forEach(idx => {
    idx.quadvertex.type = dups.sorted[parseInt(idx._id) -1][1]
  })
  return JSON.stringify(index)
}




async function indexLARGE(order,data) {
  try {
    console.log( `-------------- ORDER ${order} SETUP -----------------` )
    // await couch.areThereChanges(order)
    const stylesLARGE = ['numbers','straight','quadvertex','quadline','arc','altarc'];
    let output = '['
    let lengths = {}
    // const sourceData = fs.readFileSync(`./data/source${order}.json`)
    // const data = JSON.parse(sourceData)
    // for (let i in data) {
    for (let i=0, l=data.length; i<l; i++) {
      const valuesArray = data[i]
      stylesLARGE.forEach( style => {
        const size = parseInt(order)
        const coordsObject = draw.getCoords(size,valuesArray)
        const svgString = draw.prepareSVG(order,style,coordsObject,parseInt(i)+1)
        let len = 0
        if( style !== 'numbers' ) {
          const re = /d='([\w|\s|\d|,]+)'/;
          const svgPath = svgString.match(re)[1]
          const properties = new path.svgPathProperties(svgPath)
          const totalLength = Math.ceil(properties.getTotalLength())
          len = totalLength
        }
        lengths[style] = [len,svgString]
      })
        // "_id":         "${parseInt(i) + 1}",
      const txt = `{
        "numbers":    { "array": [${valuesArray}],
                        "svg": "${lengths.numbers[1]}" },
        "straight":   { "length": ${lengths.straight[0]},
                        "svg": "${lengths.straight[1]}" },
        "quadvertex": { "length": ${lengths.quadvertex[0]},
                        "svg": "${lengths.quadvertex[1]}" },
        "quadline":   { "length": ${lengths.quadline[0]},
                        "svg": "${lengths.quadline[1]}" },
        "arc":        { "length": ${lengths.arc[0]},
                        "svg": "${lengths.arc[1]}" },
        "altarc":     { "length": ${lengths.altarc[0]},
                        "svg": "${lengths.altarc[1]}" }
      }${ (parseInt(i) !== (data.length -1)) ? ',' : '' }`
      output += txt
    }
    output += ']'
    let final = output
    // console.log(final.slice(15,50))
    const finalJSON = JSON.parse(final)
    return finalJSON
  } catch (error) { console.log( 'indexLARGE:', error ) }
  finally { 
    // console.log( '-------------------- END ---------------------' )
  }
}


// async function saveFile(fileName, contents) {
//   fs.writeFile(fileName, contents, (err) => {
//     if (err) return console.log(err)
//     console.log(`Saved to ${fileName}!`)
//   })
// }








// for generating index as and when needed
async function source(order) {
  try {
    console.log( `-------------- ORDER ${order} SETUP -----------------` )
    const sourceData = fs.readFileSync(`./data/source${order}.json`)
    const data = JSON.parse(sourceData)
    let output = await processData(data)
    if (order == 4) output = await addFlags(output)
    return output
  } catch (error) { console.log( 'source:', error ) }
  finally { 
    // console.log( '-------------------- END ---------------------' )
  }
}

async function processData(data) {
  let output = '['
  for (let i in data) {
    const valuesArray = data[i]
    const txt = `{
      "numbers": [${valuesArray}]
    }${ (parseInt(i) !== (data.length -1)) ? ',' : '' }`
    output += txt
  }
  output += ']'
  return JSON.parse(output)
}

async function addFlags(data) {
  console.log('adding flags')
  const order = Math.sqrt(data[0].numbers.length)
  const flagDataRaw = fs.readFileSync(`./data/order${order}-classes.json`)
  const flagData = JSON.parse(flagDataRaw)
  data.forEach((d,i) => {
    d.flags = [dups.sorted[i][1]].concat(flagData[i].flags)
  })
  return data
}

async function sourceAdditions(data) {
  try {
    console.log(data)
    const order = Math.sqrt(data[0].length)
    console.log('sourceAdditions', order)
    const output = await processData(data)
    return output
  } catch (error) { console.log( 'sourceAdditions:', error ) }
  finally { 
    // console.log( '-------------------- END ---------------------' )
  }
}



async function svgData(data,order,style) {
  // console.log('svgData', order, style)
  try {
    let output = '['
    // const sourceData = fs.readFileSync(`./data/source${order}.json`)
    // const data = JSON.parse(sourceData)
    for (let i in data.rows) {
      const valuesArray = data.rows[i].key
      const size = parseInt(order)
      const coordsObject = draw.getCoords(size,valuesArray)
      const svgString = draw.prepareSVG(order,style,coordsObject,parseInt(i)+1)
      let len = 0
      if( style !== 'numbers' && style !== 'circles' && style !== 'blocks' && style !== 'tetromino' ) {
        const re = /d='([\w|\s|\d|,]+)'/;
        const svgPath = svgString.match(re)[1]
        const properties = new path.svgPathProperties(svgPath)
        const totalLength = Math.ceil(properties.getTotalLength())
        len = totalLength
      }
      const txt = `{
        "array": [${valuesArray}],
        "svg": "${svgString}",
        "length": "${len}"
      }${ (parseInt(i) !== (data.rows.length -1)) ? ',' : '' }`
      output += txt
    }
    output += ']'
    return JSON.parse(output)
  } catch (error) { console.log( 'svgData:', error ) }
  finally { 
    // console.log( '-------------------- END ---------------------' )
  }
}
