'use strict'

const _ = require('lodash')
 

module.exports = {
  getD4,
  getWording
}


// D4 TRANSFORMATIONS

function getD4(valuesArray) {
  return {"identity": valuesArray,
          "rotate90": rotate90(valuesArray),
          "rotate180": rotate180(valuesArray),
          "rotate270": rotate270(valuesArray),
          "reflectH": reflectH(valuesArray),
          "reflectV": reflectV(valuesArray),
          "reflectD1": reflectD1(valuesArray),
          "reflectD2": reflectD2(valuesArray)}
}

function getWording(type) {
  switch (type) {
    case 'identity':  return 'copy'
    case 'rotate90':  return '90 degree rotation'
    case 'rotate180': return '180 degree rotation'
    case 'rotate270': return '270 degree rotation'
    case 'reflectH':  return 'horizontal reflection'
    case 'reflectV':  return 'vertical reflection'
    case 'reflectD1': return 'diagonal reflection (D1)'
    case 'reflectD2': return 'diagonal reflection (D2)'
  }
}

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
