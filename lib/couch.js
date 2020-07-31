'use strict'

const _ = require('lodash')
const fs = require('fs')
// const util = require('util')
const https = require('https')
// const fetch = require('node-fetch')
// const got = require('got')
// const base64 = require('base-64')
// const myRequest = util.promisify(https.get)
// const request = util.promisify(https.request)
const Nano = require('nano')
const dotenv = require('dotenv').config()
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const host = process.env.DB_HOST
const root = process.cwd()
const base = `https://${user}:${password}@${host}`
const nano = Nano(base)
const generate = require('./generators.js')
// import { openDB, deleteDB, wrap, unwrap } from 'idb'
// const idb = require('idb')






module.exports = {
  request,
  statusReport,
  getAllOrders,
  createIFNeeded,
  getAllOrders,
  // populateDB,
  // populateDBLARGE,
  populateDBSource,
  // viewDB,
  viewSourceDB,
  viewAllDB,
  findDocs,
  // getLatestID,
  insertDoc,
  insertTheme,
  // getDBInfo,
  // areThereChanges,
  // getSourceChanges,
  getSharedLengths
}


function log(message) { process.stdout.write(message) }




// const url = "https://couch.fania.eu/_all_dbs"
async function request(url) {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(user + ':' + password).toString('base64')
      }
    }
    const fullurl = `https://${host}/${url}`
    const req = https.request(fullurl,options, (res) => {
      // console.log(res)
      console.log('statusCode:', res.statusCode)
      // console.log('headers:', res.headers)
      res.on('data', (d) => {
        process.stdout.write(d);
        // console.log(d)
      });
    });
    req.on('error', (e) => {
      console.error('request',e);
    });
    req.end();
    // fetch(url, { method: 'POST', headers: headers, body: data})
    // const response = await https.request(url, options)
    // const json = await response.data
    // console.log(json)
  } catch (error) {
    console.log('fetch request', error)
  }
}
// request(url)










async function statusReport() {
  try {
    console.log( '=================' )
    const orders = await getAllOrders()
    for (let o = 0; o < orders.length; o++) {
      console.log(orders[o])
      console.log(root)
      // await createIFNeeded(orders[o])
      // REMOTE STUFF
      const remote = await nano.db.changes(`source${orders[o]}`, {include_docs: true})
      const remoteObjects = remote.results.filter(res => (! res.id.includes('_design/')) && (! res.deleted))
      const remoteData = remoteObjects.map(r => r.doc.numbers).sort()
      // LOCAL STUFF
      const localFile = fs.readFileSync(`${root}/data/source${orders[o]}.json`)
      const localData = JSON.parse(localFile).sort()

      log(`Order ${orders[o]}: `)
      if (JSON.stringify(remoteData) !== JSON.stringify(localData)) {
        log(`updates `)
        // get only changes from remote and add to local
        const diffRL = _.differenceWith(remoteData, localData, _.isEqual)
        // console.log('remoteData', remoteData[0],remoteData[1])
        // console.log('localData', localData[0],localData[1])
        // console.log('diffRL', diffRL)
        if (diffRL.length > 0) {
          log(`on server\n`)
          const localFile = fs.readFileSync(`${root}/data/source${orders[o]}.json`)
          const data = JSON.parse(localFile)
          diffRL.forEach(dr => data.push(dr))
          data.sort()
          fs.writeFileSync(`${root}/data/source${orders[o]}.json`, JSON.stringify(data))
        } else { 
          log(`locally\n`)
          const diffLR = _.differenceWith(localData, remoteData, _.isEqual)
          // console.log('diffLR', diffLR)
          const result = await generate.sourceAdditions(diffLR)
          const db = nano.use(`source${orders[o]}`)
          await db.bulk({docs: result}).then((body) => {
            log(`.\n`)
          });
        }
      } else {
        log(`in sync\n`)
      }
    }
  } 
  catch (error) { console.log( 'statusReport:', error ) }
  finally { console.log( '=================' ) }
}




// async function addFlags(order) {

//   const flagData = fs.readFileSync(`${root}/data/order${order}-classes.json`)
//   const data = JSON.parse(flagData)
//   for (let i in data) {

//   }

// }


async function getAllOrders() {
  const info = await nano.db.list()
  // console.log(info)
  const orders = info.filter(i => i.startsWith('source'))
  const nums = orders.map(o => parseInt(o.slice(6))).sort((a, b) => a - b)
  // console.log(nums)
  return nums
}




async function createIFNeeded(order) {
  console.log(`${root}/data/source${order}.json`)
  console.log(__dirname)
  const info = await nano.db.list()
  // console.log(info)
  if (!info.includes(`source${order}`)) { 
    console.log(`creating source${order} locally and remotely`)
    await nano.db.create(`source${order}`)
    const db = nano.use(`source${order}`)
    const ddoc = {
      "_id": "_design/d",
      "views": { "i": { "map": "function (doc) { emit(doc.numbers, 1); }" } }
    }
    await db.insert(ddoc).then((body) => {})
    fs.writeFileSync(`${root}/data/source${order}.json`, "[]")
  }
}



// insert single new magic square (document)
async function insertDoc(numbers, order) {
  try {
    // LOCAL
    const localData = fs.readFileSync(`${root}/data/source${order}.json`)
    const data = JSON.parse(localData)
    data.push(numbers)
    data.sort()
    fs.writeFileSync(`${root}/data/source${order}.json`, JSON.stringify(data))
    // REMOTE
    const doc = {
      "numbers": numbers
    }
    const db = nano.use(`source${order}`)
    const confirmation = await db.insert(doc).then((body) => {
      // console.log(`uploaded new order ${order} with id ${body.id}`)
      // console.log(body)
      return body
    })
    // const result = await generate.index(order)
    // await populateDB(result, order)
    // LOG
    const date = (new Date()).toGMTString()
    const entry = `Date: ${date} - order ${order} - numbers [${numbers}]\n`
    fs.appendFileSync(`${root}/data/contributions.log`, entry)

    return confirmation
  } catch (error) { console.log( 'insertDoc:', error ) }
}





async function viewSourceDB(order, style, offset=0) {
  // console.log('viewSourceDB', order, style, offset)
  try {
    const db = nano.use(`source${order}`)
    let data;
    const params = {
      include_docs: false,
      limit: 200,
      skip: offset
    }
    if (style === 'unique') {
      data = await db.view('d','u', params)
    } else {
      data = await db.view('d','i', params)
    }
    return data
  } catch (error) { console.log( 'viewSourceDB:', error ) }
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



// https://couch.fania.eu/source4/_design/d/_view/i?key=[1,2,15,16,12,14,3,5,13,7,10,4,8,11,6,9]
async function findDocs(order, numbersList) {
  try {
    const db = nano.use(`source${order}`)
    const query = { keys: numbersList, include_docs: true }
    const results = await db.view('d','i',query)
    // console.log(results)
    return results
  } catch (error) { console.log( 'findDocs:', error ) }
}



// IS THIS NEEDED?
// https://couch.fania.eu/index4/_design/reducer/_view/sharedLengths?group=true
async function getSharedLengths(order,style) {
  try {
    // console.log('trying to get shared lengths', order, style)
    // const st = style === "quadvertex" ? "QV" :
    //            style === "quadline"   ? "QL" :
    //            style === "straight"   ? "S"  :
    //            style === "arc"        ? "A"  :
    //            style === "altarc"     ? "AA" : "QV"
    const db = nano.use(`index${order}`)
    const query = { group: true }
    // const results = await db.view('reducers', `sharedLengths${st}`, query)
    const results = await db.view('reducers', 'lengths', query)
    const styleOnly = results.rows.filter(r => r.key[1] === style)
    // const output = styleOnly.map(s => {'key': s.key[0], 'value': s.value})
    return styleOnly
  } catch (error) { console.log( 'getSharedLengths:', error ) }
}





async function insertTheme(theme) {
  try {
    console.log( `Inserting theme ${theme._id}.` )

    // clean theme types syntax (int, bool)
    theme.overlap = theme.overlap === 'true'
    theme.falpha = parseInt(theme.falpha)
    theme.gap = parseInt(theme.gap)
    theme.order = parseInt(theme.order)
    theme.salpha = parseInt(theme.salpha)
    theme.size = parseInt(theme.size)
    theme.speed = parseInt(theme.speed)
    theme.strokeWidth = parseInt(theme.strokeWidth)

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






async function populateDBSource(data, order) {
  try {
    console.log( `(Re-) Creating database for source${order}` )
    // bulk docs needs individual rev ids for updates
    const info = await nano.db.list()

    // CREATE IF NEW OR REUSE OLD
    // if (! info.includes(`index${order}`)) { 
    //   await nano.db.create(`index${order}`)
    // }
    // const db = nano.use(`index${order}`)

    // DELETE OLD AND CREATE NEW AND UPLOAD FROM SCRATCH
    if (info.includes(`source${order}`)) { 
      await nano.db.destroy(`source${order}`)
    }
    await nano.db.create(`source${order}`)
    const db = nano.use(`source${order}`)
    if (order === 4) {
      data.push({
        "_id": "_design/d",
        "views": {
          "i": {
            "map": "function(doc) {\n    emit(doc.numbers, doc.flags);\n}"
          },
          "u": {
            "map": "function(doc) {\n    if (doc.flags.includes('unique') || doc.flags.includes('identity')) {\n        emit(doc.numbers, 1);\n    }\n}"
          },
          "pan": {
            "map": "function(doc) {\n    if (doc.flags.includes('pandiag')) {\n        emit(doc.numbers, 1);\n    }\n}"
          },
          "sym": {
            "map": "function(doc) {\n    if (doc.flags.includes('symmetric')) {\n        emit(doc.numbers, 1);\n    }\n}"
          },
          "classes": {
            "reduce": "_count",
            "map": "function (doc) {\n  for(let i=0,l=doc.flags.length; i<l;i++) {\n    emit(doc.flags[i], doc._id);\n  }\n}"
          }
        }
      })
    } else {
      data.push({
        "_id": "_design/d",
        "views": { "i": { "map": "function (doc) { emit(doc.numbers, 1); }" } }
      })
    }
    let output = data
    await db.bulk({docs: output}).then((body) => {
      // console.log(body);
    });
  } catch (error) { console.log( 'populateDBSource:', error ) }
  finally {
    console.log( '-------------------- END ---------------------' )
  }
}
