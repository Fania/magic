// const { body } = require('express-validator')

module.exports = {
  verifyAndSanitise
}


async function verifyAndSanitise(input) {

  console.log( input )



  let inputArray = input.split(/[,|\s]/g).map(Number)
  console.log( inputArray )
  console.log( typeof inputArray[0] )

  console.log( isMagic(inputArray) )


  // return output
}

function trim(valuesArray) {
  // TODO
}

function numericOnly(valuesArray) {
  console.log( 'numericOnly', !valuesArray.includes(NaN) )
  return !valuesArray.includes(NaN)
}

function uniqueOnly(valuesArray) {
  const uniques = [...new Set(valuesArray)]
  console.log( 'uniqueOnly', valuesArray.length === uniques.length  )
  return valuesArray.length === uniques.length 
}

function contiguousOnly(valuesArray) {
  const sorted = Array(valuesArray.sort((a, b) => a - b))
  const contig = Array([...Array(valuesArray.length).keys()].map(x => x+1))
  console.log( 'WHY IS THIS AN OBJECT' )
  console.log( 'contiguousOnly', sorted, contig )
  console.log( 'contiguousOnly', typeof sorted, typeof contig )
  console.log( 'contiguousOnly', sorted === contig )
  return sorted === contig
}

function startsAt1(valuesArray) {
  console.log( 'startsAt1', Math.min(...valuesArray) === 1  )
  return Math.min(...valuesArray) === 1
}

function wholeSqrt(valuesArray) {
  console.log( 'wholeSqrt', Number.isInteger( Math.sqrt(valuesArray.length) )  )
  return Number.isInteger( Math.sqrt(valuesArray.length) )
}

function isMagic(valuesArray) {

  let output = false

  if ( [numericOnly(valuesArray), 
        uniqueOnly(valuesArray), 
        contiguousOnly(valuesArray), 
        startsAt1(valuesArray),
        wholeSqrt(valuesArray)
       ].every(Boolean) ) {
    
    // const len = valuesArray.length
    


    output = true
  }
  return output
}

function magicConstant(inputArray) {



}