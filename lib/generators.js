'use strict'

const fs = require('fs')
const path = require('svg-path-properties')
const draw = require('./draw.js')
// const couch = require('./couch.js')
const duplicates = require('../data/duplicatesSorted.js')

module.exports = {
  source,
  sourceAdditions,
  svgData
}


function log(message) { process.stdout.write(message) }

// const styles = ['numbers','straight','quadvertex','quadline','arc','altarc','circles','blocks','tetromino'];


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
  const dups = duplicates.sorted
  data.forEach((d,i) => {
    // console.log(d,i)
    d.flags = [dups[i][1]].concat(flagData[i].flags)
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
  // console.log(data)
  try {
    let output = '['
    // const sourceData = fs.readFileSync(`./data/source${order}.json`)
    // const data = JSON.parse(sourceData)
    for (let i in data.rows) {
      const id = data.rows[i].id
      const valuesArray = data.rows[i].key
      // console.log(data.rows[i])
      // console.log(data.rows[i].value)
      const classesArray = order == 4 ? data.rows[i].value : []
      // console.log(classesArray)
      const size = parseInt(order)
      const coordsObject = draw.getCoords(size,valuesArray)
      const svgString = draw.prepareSVG(order,style,coordsObject,id,classesArray)
      let len = 0
      if( style !== 'numbers' && style !== 'circles' && style !== 'blocks' && style !== 'tetromino' ) {
        const re = /d='([\w|\s|\d|,]+)'/;
        const svgPath = svgString.match(re)[1]
        const properties = new path.svgPathProperties(svgPath)
        const totalLength = Math.ceil(properties.getTotalLength())
        len = totalLength
      }
      const txt = `{
        "id": "${id}",
        "array": [${valuesArray}],
        "svg": "${svgString}",
        "length": "${len}",
        "flags": "[${classesArray}]"
      }${ (parseInt(i) !== (data.rows.length -1)) ? ',' : '' }`
      output += txt
      // console.log(txt)
    }
    output += ']'
    return JSON.parse(output)
  } catch (error) { console.log( 'svgData:', error ) }
  finally { 
    // console.log( '-------------------- END ---------------------' )
  }
}
