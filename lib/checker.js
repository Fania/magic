'use strict'

const _ = require('lodash')
const couch = require('./couch.js')
const draw = require('./draw.js')
const transformations = require('./transformations.js')


module.exports = {
  magic
}



async function magic(numbers) {
  const result = checkInput(numbers)
  if (result.magic) {
    const d4 = transformations.getD4(result.numbers)
    const d4array = _.values(d4)
    const found = await couch.findDocs(result.order,d4array)
    // test without transformations
    // const found = await couch.findDocs(result.order,[result.numbers])
    // NEW MAGIC SQUARE
    if (found.rows.length === 0) {
      console.log( 'found new magic square' )
      result.exists = false
      await couch.insertDoc(result.numbers,result.order)
      const newDoc = await couch.findDocs(result.order,[result.numbers])
      result.doc = newDoc.rows[0].doc
      result.newID = newDoc.rows[0].id
    // EXISTING MAGIC SQUARE
    } else {
      console.log( 'magic square already exists' )
      result.exists = true
      const old = found.rows[0].doc
      result.doc = old
      if (result.numbers !== old.numbers.array) {
        const matchType = _.invert(d4)[old.numbers.array]
        result.matchType = transformations.getWording(matchType)
        const coordsObject = draw.getCoords(result.order, result.numbers)
        const querySVG = draw.prepareSVG(result.order,'numbers',coordsObject,0)
        result.querySVG = querySVG
      }
    }
  }
  return result
}








function checkInput(input) {
  const ia = input.split(/[,|\s]/g).map(Number)
  const order = getSize(ia)
  const uniqueRes = uniqueOnly([...ia])
  const contigRes = contiguousOnly([...ia])
  const starts1Res = startsAt1([...ia])
  const sqrtRes = wholeSqrt([...ia])
  const magic = [uniqueRes,contigRes,starts1Res,sqrtRes].every(Boolean) 
              ? [checkRows(ia),checkCols(ia),checkDiags(ia)].every(Boolean)
              : false
  const message = !uniqueRes ? 'Cannot contain duplicate numbers.' :
                  !contigRes ? 'Numbers must be contiguous.' :
                  !starts1Res ? 'Numbers must start at 1 (not 0).' :
                  !sqrtRes ? 'Not enough numbers for a magic square.' :
                  !magic ? 'Not a magic square.' : 'ok'
  const output = { magic: magic, order: order, message: message, numbers: ia }
  return output
}

function sum(nums) { 
  return nums.reduce( (x,y) => x + y) 
}

function getSize(valuesArray) {
  return Math.sqrt(valuesArray.length)
}

function uniqueOnly(valuesArray) {
  const uniques = [...new Set(valuesArray)]
  return valuesArray.length === uniques.length 
}

function contiguousOnly(valuesArray) {
  const sorted = _.sortBy(valuesArray).toString()
  const contig = ([...Array(valuesArray.length).keys()].map(x => x+1)).toString()
  return sorted === contig
}

function startsAt1(valuesArray) {
  return Math.min(...valuesArray) === 1
}

function wholeSqrt(valuesArray) {
  return Number.isInteger( Math.sqrt(valuesArray.length) )
}

function checkRows(valuesArray) {
  const s = getSize(valuesArray)
  const rows = _.chunk(valuesArray,s)
  const sums = rows.map(row => sum(row))
  return sums.every( rs => rs === sums[0] )
}

function checkCols(valuesArray) {
  const s = getSize(valuesArray)
  const chunks = _.chunk(valuesArray,s)
  const cols = _.zip.apply(_, chunks)
  const sums = cols.map(col => sum(col))
  return sums.every( cs => cs === sums[0] )
}

function checkDiags(valuesArray) {
  const s = getSize(valuesArray)
  const rows = _.chunk(valuesArray,s)
  let sumDiags = {lr: 0, rl: 0}
  for (var i = 0; i < s; i++) {
    sumDiags.lr += rows[i][i]
    sumDiags.rl += rows[i][s-i-1]
  }
  return sumDiags.lr === sumDiags.rl
}
