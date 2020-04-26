'use strict'

const fs = require('fs')
const util = require('util')
const Nano = require('nano')
const dotenv = require('dotenv').config()

const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const host = process.env.DB_HOST
const nano = Nano(`https://${user}:${password}@${host}`)


module.exports = {
  populateDB,
  viewDB,
  searchDB,
  createMetaDocs
}




async function getDB(dbName) {
  try {
    const dbs = await nano.db.list()
    if ( !dbs.includes( dbName ) ) { 
      await nano.db.create( dbName )  // needs await
    } 
    const db = nano.use( dbName )
    return db
  } catch (error) { console.log( 'getDB:', error ) }
}

async function insertDoc(doc, db) {
  try {
    db.get(doc.id, async (error, existing) => { 
      if(!error) doc._rev = existing._rev
      await db.insert(doc, doc.id)
    })
  } catch (error) { console.log( 'insertDoc:', error ) }
}

async function populateDB(sourcePath, dbName) {
  try {
    console.log( `Populating ${dbName} with data from ${sourcePath}` )
    const readFile = util.promisify(fs.readFile);
    const sourceData = await readFile(sourcePath)
    const data = JSON.parse(sourceData)
    const db = await getDB(dbName)
    for (let i in data) {
      await insertDoc(data[i], db)
    }
  } catch (error) { console.log( 'populateDB:', error ) }
}

async function viewDB(dbName, design, view) {
  try {
    const db = await getDB(dbName)
    const data = await db.view(design, view, { include_docs: true })
    return data
  } catch (error) { console.log( 'viewDB:', error ) }
}


async function searchDB(dbName, numbers) {
  try {
    const db = await getDB(dbName)
    const q = { selector: { 'numbers.array': { '$eq': numbers} }, limit: 1 }
    const doc = await db.find(q)
    return doc
  } catch (error) { console.log( 'searchDB:', error ) }
}


async function createMetaDocs(dbName, order, ddType, ddName) {
  try {
    const db = await getDB(dbName)
    const numericDoc = {
      "_id": `_design/${ddType}`,
      "views": { 
        "numeric": { 
          map: function(doc) { emit( parseInt(doc._id) ); } 
        } 
      },
      "language": "javascript"
    }
    const func4 = "function (doc) { if ( doc.quadvertex.type === 'unique' || doc.quadvertex.type === 'identity' ) { emit( parseInt(doc._id) ); } }"
    const funcN = "function (doc) { emit( parseInt(doc._id) ); }"
    const func = order === 4 ? func4 : funcN
    const uniqueDoc = {
      "_id": `_design/${ddType}`,
      "views": { 
        "unique": { 
          "map": func
        } 
      },
      "language": "javascript"
    }
    const designDoc = ddType === "order" ? numericDoc : uniqueDoc
    await db.insert(designDoc)
  } catch (error) { console.log( 'createMetaDocs:', error ) }
}