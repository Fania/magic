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
  insertDoc,
  getLatestID,
  addDoc
}




async function getDB(dbName) {
  try {
    const dbs = await nano.db.list()
    if ( !dbs.includes( dbName ) ) { 
      await nano.db.create( dbName )  // needs await
    } 
    const db = nano.use( dbName )

    // nano.db.changes(dbName).then((body) => {
    //   console.log(body)
    // })



    return db
  } catch (error) { console.log( 'getDB:', error ) }
}


async function addDoc(doc, dbName) {
  try {
    const db = await getDB(dbName)
    // REMOTE
    await db.insert(doc, doc._id)
    // LOCAL
    const localData = fs.readFileSync(`./data/${dbName}.json`)
    const data = JSON.parse(localData)
    data.push(doc.numbers)
    fs.writeFileSync(`./data/${dbName}.json`, JSON.stringify(data))
  } catch (error) { console.log( 'addDoc:', error ) }
}


async function insertDoc(doc, dbName) {
  try {
    // await dbName.insert(doc)
    await dbName.get(doc.id, async (error, existing) => { 
      if(!error) doc._rev = existing._rev
      await dbName.insert(doc, doc.id)
    })
  } catch (error) { console.log( 'insertDoc:', error ) }
}


async function getLatestID(dbName) {
  try {
    const db = await getDB(dbName)
    const dbList = await db.view('order', 'numeric')
    return dbList.rows.pop().key
  } catch (error) { console.log( 'getLatestID:', error ) }
}
// getLatestID('source3')






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
          // data[i]._id = `${parseInt(i) + 1}`
          output.push(data[i])
        }
      }
      output.push(numericOrder)
      if (order === 4) { output.push(uniqueFilter) }
    }
    // upsert them all at once
    await db.bulk({docs: output})

    // INDEX
    // const indexDefx = {
    //   index: { fields: ['foo'] },
    //   name: 'fooindex'
    // };

    // const indexDef = {
    //   "type": "json",
    //   "partitioned": false,
    //   "def": {
    //     "fields": [
    //       { "numbers.array": "asc" }
    //     ]
    //   }
    // }
    // await db.createIndex(indexDef)

  } catch (error) { console.log( 'populateDB:', error ) }
}


async function viewDB(dbName, design, view, incl) {
  try {
    const db = await getDB(dbName)
    const data = await db.view(design, view, { include_docs: incl })
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




// QUERY DESIGN DOC
// {
//   "_id": "_design/ddd34e390f5d96175b0933e83dc0fe4bdd36e5f9",
//   "_rev": "1-57d0849c4b261395e444db286775dad6",
//   "language": "query",
//   "views": {
//     "numbers-json-index": {
//       "map": {
//         "fields": {
//           "numbers.array": "asc"
//         },
//         "partial_filter_selector": {}
//       },
//       "reduce": "_count",
//       "options": {
//         "def": {
//           "fields": [
//             "numbers.array"
//           ]
//         }
//       }
//     }
//   }
// }

// FILTER DESIGN DOC
// {
//   "_id": "_design/filter",
//   "_rev": "3-edbec8914037287716aa52dea2ba75d2",
//   "views": {
//     "unique": {
//       "map": "function (doc) { if ( doc.quadvertex.type === 'unique' || doc.quadvertex.type === 'identity' ) { emit( parseInt(doc._id) ); } }"
//     },
//     "quadvertex": {
//       "map": "function (doc) { emit(parseInt(doc._id), doc.quadvertex); }"
//     },
//     "arrays": {
//       "map": "function (doc) { emit(parseInt(doc._id), doc.numbers.array); }"
//     }
//   }
// }

// ORDER DESIGN DOC
// {
//   "_id": "_design/order",
//   "_rev": "1-012a001c7fe9e699d31f022ff547db6b",
//   "views": {
//     "numeric": {
//       "map": "function (doc) { emit( parseInt(doc._id) ); }"
//     }
//   }
// }