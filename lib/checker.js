'use strict'

const _ = require('lodash')

module.exports = {
  magic
}


function magic(input) {
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
    sumDiags.lr += rows[i][i];
    sumDiags.rl += rows[i][s-i-1];
  }
  return sumDiags.lr === sumDiags.rl
}