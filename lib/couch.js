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
  searchDB
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
    await db.get(doc.id, async (error, existing) => { 
      if(!error) doc._rev = existing._rev
      await db.insert(doc, doc.id)
    })
  } catch (error) { console.log( 'insertDoc:', error ) }
}


async function populateDB(data, dbName) {
  try {
    const order = parseInt( dbName.slice(-1) )
    const db = await getDB(dbName)
    const oldDocs = await db.list()
    let output = []
    const numericOrder = {
      "_id": "_design/order",
      "views": { "numeric": { "map": 
        "function (doc) { emit( parseInt(doc._id) ); }" } }
    }
    const uniqueFilter = {
      "_id": "_design/filter",
      "views": { "unique": { "map": 
        "function (doc) { if ( doc.quadvertex.type === 'unique' || doc.quadvertex.type === 'identity' ) { emit( parseInt(doc._id) ); } }" } }
    }
    // OLD DOCS EXIST
    if (oldDocs.total_rows !== 0) {
      const unsortedRevs = oldDocs.rows.map(r => [r.id, r.value.rev ])
      const rawRevsNoDesign = unsortedRevs.slice( 0, unsortedRevs.length-2 )
      const rawRevsNoDesignInts = rawRevsNoDesign.map( r => [parseInt(r[0]), r[1]] )
      const rawDesign = unsortedRevs.slice( -2 )
      const revs = rawRevsNoDesignInts.sort((a, b) => a[0] - b[0] )
      if ( dbName.includes('source') ) {
        console.log( 'Existing source being updated in DB.' )
        for (let i in data) {
          output.push({ "_id": `${parseInt(i) + 1}`, 
                        "_rev": revs[i][1], 
                        "numbers": data[i].numbers })
        }
      } else if ( dbName.includes('index') ) {
        console.log( 'Existing index being updated in DB.' )
        for (let i in data) {
          const newData = data[i]
          newData._id = `${parseInt(i) + 1}`
          newData._rev = revs[i][1]
          output.push(newData)
        }
      }
      const orderRev = rawDesign.filter(r => r[0] === '_design/order')
      const numericOrderWithRev = numericOrder
      numericOrderWithRev._rev = orderRev[0][1]
      output.push(numericOrderWithRev)
      if (order === 4) { 
        const filterRev = rawDesign.filter(r => r[0] === '_design/filter')
        const uniqueFilterWithRev = uniqueFilter
        uniqueFilterWithRev._rev = filterRev[0][1]
        output.push(uniqueFilterWithRev) 
      }
    // NEW UPLOAD
    } else { 
      if ( dbName.includes('source') ) {
        console.log( 'New source being uploaded to DB.' )
        for (let i in data) {
          output.push({ "_id": `${parseInt(i)+1}`, "numbers": data[i].numbers })
        }
      } else if ( dbName.includes('index') ) {
        console.log( 'New index being uploaded to DB.' )
        for (let i in data) {
          data[i]._id = `${parseInt(i) + 1}`
          output.push(data[i])
        }
      }
      output.push(numericOrder)
      if (order === 4) { output.push(uniqueFilter) }
    }
    // upsert them all at once
    await db.bulk({docs: output})
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







async function createMetaDocs(dbName) {
  try {
    const order = parseInt( dbName.slice(-1) )
    const db = await getDB(dbName)
    const numericOrder = {
      "_id": "_design/order",
      "views": { "numeric": { "map": 
        "function (doc) { emit( parseInt(doc._id) ); }" } }
    }
    await db.get('_design/order', async (error, existing) => { 
      if(!error) numericOrder._rev = existing._rev
      await db.insert(numericOrder, numericOrder.id)
      console.log( `Upserted numeric order design doc for ${dbName}.` )
    })




    if (order === 4) {
      const uniqueFilter = {
        "_id": "_design/filter",
        "views": { "unique": { "map": 
          "function (doc) { if ( doc.quadvertex.type === 'unique' || doc.quadvertex.type === 'identity' ) { emit( parseInt(doc._id) ); } }" } }
      }
      await db.get('_design/filter', async (error, existing) => { 
        if(!error) uniqueFilter._rev = existing._rev
        await db.insert(uniqueFilter, uniqueFilter.id)
        console.log( `Upserted unique filter design doc for ${dbName}.` )
      })
    }
  } catch (error) { console.log( 'createMetaDocs:', error ) }
}