'use strict'

const fs = require('fs')
const Nano = require('nano')
const dotenv = require('dotenv').config()
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const host = process.env.DB_HOST
const nano = Nano(`https://${user}:${password}@${host}`)
const generate = require('./generators.js')


module.exports = {
  populateDB,
  viewDB,
  findDocs,
  getLatestID,
  insertDoc
}



async function insertDoc(numbers, order) {
  try {
    // LOCAL
    const localData = fs.readFileSync(`./data/source${order}.json`)
    const data = JSON.parse(localData)
    data.push(numbers)
    data.sort()
    fs.writeFileSync(`./data/source${order}.json`, JSON.stringify(data))
    // REMOTE
    const result = await generate.index(order)
    await populateDB(result, order)
    // LOG
    const date = (new Date()).toDateString()
    const entry = `Date: ${date} - order ${order} - numbers [${numbers}]`
    fs.appendFileSync(`./data/contributions.log`, entry)
  } catch (error) { console.log( 'insertDoc:', error ) }
}



async function getLatestID(order) {
  try {
    const db = nano.use(`index${order}`)
    const dbList = await db.view('filter', 'arrays')
    return dbList.rows.pop().key
  } catch (error) { console.log( 'getLatestID:', error ) }
}



async function populateDB(data, order) {
  try {
    console.log( `(Re-) Creating database for index${order}` )
    const info = await nano.db.list()
    if (info.includes(`index${order}`)) { 
      await nano.db.destroy(`index${order}`)
    }
    await nano.db.create(`index${order}`)
    const db = nano.use(`index${order}`)
    let output = data
    output.push(getDesignDocs())
    await db.bulk({docs: output})
  } catch (error) { console.log( 'populateDB:', error ) }
  finally {
    console.log( '-------------------- END ---------------------' )
  }
}



async function viewDB(order, design, view, incl) {
  try {
    const db = nano.use(`index${order}`)
    const data = await db.view(design, view, { include_docs: incl })
    return data
  } catch (error) { console.log( 'viewDB:', error ) }
}



// https://couch.fania.eu/index4/_design/filter/_view/arrays?key=[1,2,15,16,12,14,3,5,13,7,10,4,8,11,6,9]
async function findDocs(order, numbersList) {
  try {
    const db = nano.use(`index${order}`)
    const query = { keys: numbersList, include_docs: true }
    const results = await db.view('filter', 'arrays', query)
    return results
  } catch (error) { console.log( 'findDocS:', error ) }
}



function getDesignDocs() {
  const filter = {
    "_id": "_design/filter",
    "views": {
      "arrays": {
        "map": "function (doc) { emit(doc.numbers.array, parseInt(doc._id)) }"
      },
      "unique": {
        "map": "function (doc) { if ( doc.quadvertex.type === 'unique' || doc.quadvertex.type === 'identity' ) { emit(parseInt(doc._id), doc.quadvertex) } }"
      },
      "quadvertex": {
        "map": "function (doc) { emit(parseInt(doc._id), doc.quadvertex) }"
      },
      "numbers": {
        "map": "function (doc) { emit(parseInt(doc._id), doc.numbers) }"
      },
      "quadline": {
        "map": "function (doc) { emit(parseInt(doc._id), doc.quadline) }"
      },
      "straight": {
        "map": "function (doc) { emit(parseInt(doc._id), doc.straight) }"
      },
      "arc": {
        "map": "function (doc) { emit(parseInt(doc._id), doc.arc) }"
      },
      "altarc": {
        "map": "function (doc) { emit(parseInt(doc._id), doc.altarc) }"
      }
    }
  }
  return filter
}
