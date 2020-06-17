'use strict'

const _ = require('lodash')
const fs = require('fs')
const util = require('util')
const https = require('https')
const myRequest = util.promisify(https.get)
const Nano = require('nano')
const dotenv = require('dotenv').config()
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const host = process.env.DB_HOST
const base = `https://${user}:${password}@${host}`
const nano = Nano(base)
const generate = require('./generators.js')
// import { openDB, deleteDB, wrap, unwrap } from 'idb'
const idb = require('idb')


module.exports = {
  populateDB,
  viewDB,
  viewAllDB,
  findDocs,
  getLatestID,
  insertDoc,
  insertTheme,
  getDBInfo,
  areThereChanges,
  getSourceChanges
}



async function getDBInfo() {
  try {
    console.log('trying to get DB info')

    const options = new URL(base)

    // console.log(base)
    // console.log(options)
    const result = await myRequest(base)
    if(result === 'data') console.log(result)
    else console.log('oh no')

  } 
  catch (error) { console.log( 'getDBInfo:', error ) }
}
// getDBInfo()

//   console.log('statusCode:', res.statusCode);
//   console.log('headers:', res.headers);

//   res.on('data', (d) => {
//     process.stdout.write(d);
//   });

// }).on('error', (e) => {
//   console.error(e);
// });



// CHECK IF DB IS AHEAD LOCAL
async function areThereChanges(order) {
  try {
    // REMOTE STUFF
    const remote = await nano.db.changes(`index${order}`, {include_docs: true})
    const remoteObjects = remote.results.filter(res => ! res.id.includes('_design/'))
    const remoteData = remoteObjects.map(r => r.doc.numbers.array).sort()
    // LOCAL STUFF
    const localFile = fs.readFileSync(`./data/source${order}.json`)
    const localData = JSON.parse(localFile).sort()

    console.log('Are there changes? ', JSON.stringify(remoteData) !== JSON.stringify(localData))

    if (JSON.stringify(remoteData) !== JSON.stringify(localData)) {
      await getSourceChanges(order, remoteData, localData)
    }
  } catch (error) { console.log( 'areThereChanges:', error ) }
}


async function getSourceChanges(order, remoteData, localData) {
  try {
    // get only changes from remote and add to local
    const diffRL = _.differenceWith(remoteData, localData, _.isEqual)
    if (diffRL.length > 0) {
      const localFile = fs.readFileSync(`./data/source${order}.json`)
      const data = JSON.parse(localFile)
      diffRL.forEach(dr => data.push(dr))
      data.sort()
      fs.writeFileSync(`./data/source${order}.json`, JSON.stringify(data))
    } else { console.log('Changes in local to be uploaded.') }
  } catch (error) { console.log( 'getChanges:', error ) }
  finally { console.log( 'Changes dealt with.' ) }
}



async function insertDoc(numbers, order) {
  try {
    await areThereChanges(order)

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
    const date = (new Date()).toGMTString()
    const entry = `Date: ${date} - order ${order} - numbers [${numbers}]\n`
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
    // bulk docs needs individual rev ids for updates
    const info = await nano.db.list()

    // CREATE IF NEW OR REUSE OLD
    // if (! info.includes(`index${order}`)) { 
    //   await nano.db.create(`index${order}`)
    // }
    // const db = nano.use(`index${order}`)

    // DELETE OLD AND CREATE NEW AND UPLOAD FROM SCRATCH
    if (info.includes(`index${order}`)) { 
      await nano.db.destroy(`index${order}`)
    }
    await nano.db.create(`index${order}`)
    const db = nano.use(`index${order}`)

    let output = data
    output.push(getFilterDocs())
    output.push(getReducerDocs())
    await db.bulk({docs: output}).then((body) => {
      // console.log(body);
    });
  } catch (error) { console.log( 'populateDB:', error ) }
  finally {
    console.log( '-------------------- END ---------------------' )
  }
}



async function viewDB(order, design, view, offset=0) {
  try {
    const db = nano.use(`index${order}`)
    const data = await db.view(design, view, { 
      include_docs: false,
      limit: 200,
      skip: offset 
    })
    return data
  } catch (error) { console.log( 'viewDB:', error ) }
}

async function viewAllDB(order) {
  try {
    let db = nano.use(`index${order}`)
    if(order === 'themes') {
      db = nano.use('themes')
    }
    const data = await db.list({ include_docs: true })
    return data
  } catch (error) { console.log( 'viewAllDB:', error ) }
}



// https://couch.fania.eu/index4/_design/filter/_view/arrays?key=[1,2,15,16,12,14,3,5,13,7,10,4,8,11,6,9]
async function findDocs(order, numbersList) {
  try {
    const db = nano.use(`index${order}`)
    const query = { keys: numbersList, include_docs: true }
    const results = await db.view('filters', 'arrays', query)
    return results
  } catch (error) { console.log( 'findDocS:', error ) }
}


// https://couch.fania.eu/index4/_design/reducer/_view/sharedLengths?group=true
async function getSharedLengths(order,style) {
  try {
    const st = style === "quadvertex" ? "QV" :
               style === "quadline"   ? "QL" :
               style === "straight"   ? "S"  :
               style === "arc"        ? "A"  :
               style === "altarc"     ? "AA" : "QV"
    const db = nano.use(`index${order}`)
    const query = { group: true }
    const results = await db.view('reducers', `sharedLengths${st}`, query)
    return results
  } catch (error) { console.log( 'getSharedLengths:', error ) }
}



function getFilterDocs() {
  return {
    "_id": "_design/filters",
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
      },
      "circles": {
        "map": "function (doc) { emit(parseInt(doc._id), doc.circles) }"
      },
      "blocks": {
        "map": "function (doc) { emit(parseInt(doc._id), doc.blocks) }"
      },
      "tetromino": {
        "map": "function (doc) { emit(parseInt(doc._id), doc.tetromino) }"
      }
    }
  }
}


function getReducerDocs() {
  return {
    "_id": "_design/reducers",
    "views": {
      "sharedLengthsQV": {
        "reduce": "function (keys, values, rereduce) { let result = []; for(i=0,v=values.length; i < v; i++) { if(rereduce) { return values[i]; } else { return values; } } }",
        "map": "function (doc) { emit(doc.quadvertex.length, doc._id); }"
      },
      "sharedLengthsQL": {
        "reduce": "function (keys, values, rereduce) { let result = []; for(i=0,v=values.length; i < v; i++) { if(rereduce) { return values[i]; } else { return values; } } }",
        "map": "function (doc) { emit(doc.quadline.length, doc._id); }"
      },
      "sharedLengthsS": {
        "reduce": "function (keys, values, rereduce) { let result = []; for(i=0,v=values.length; i < v; i++) { if(rereduce) { return values[i]; } else { return values; } } }",
        "map": "function (doc) { emit(doc.straight.length, doc._id); }"
      },
      "sharedLengthsA": {
        "reduce": "function (keys, values, rereduce) { let result = []; for(i=0,v=values.length; i < v; i++) { if(rereduce) { return values[i]; } else { return values; } } }",
        "map": "function (doc) { emit(doc.arc.length, doc._id); }"
      },
      "sharedLengthsAA": {
        "reduce": "function (keys, values, rereduce) { let result = []; for(i=0,v=values.length; i < v; i++) { if(rereduce) { return values[i]; } else { return values; } } }",
        "map": "function (doc) { emit(doc.altarc.length, doc._id); }"
      }
    }
  }
}




async function insertTheme(theme) {
  try {
    console.log( `Inserting theme ${theme._id}.` )
    const info = await nano.db.list()
    if (!info.includes('themes')) { 
      await nano.db.create('themes')
    }
    const db = nano.use('themes')
    await db.get(theme._id, async (err, res) => {
      if (!err) {
        const update = theme
        update._rev = res._rev
        await db.insert(update, (err,res) => { console.log('Updated it.') });
      } else {
        await db.insert(theme, (err,res) => { 
          if(err) console.log('Not inserted.') 
          else console.log('Inserted it.')
        });
      }
    });
  } catch (error) { console.log( 'insertTheme:', error ) }
}







// function doDatabaseStuff(things) {
//   // const db = await openDB(…);
//   idb.open('magic', 1, (upgradeDB) => {
//     let store = upgradeDB.createObjectStore('settings', { keyPath: 'id' })
//     store.put(things)
//   })

// }