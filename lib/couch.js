'use strict'

const _ = require('lodash')
const fs = require('fs')
const axios = require('axios')
const Nano = require('nano')
const dotenv = require('dotenv').config()
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const host = process.env.DB_HOST
const root = process.cwd()
const token = Buffer.from(`${user}:${password}`, 'utf8').toString('base64')
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
  insertTheme
  // getDBInfo,
  // areThereChanges,
  // getSourceChanges,
  // getSharedLengths
}


function log(message) { process.stdout.write(message) }



// REQUEST FUNCTION FOR ALL INTERACTIONS WITH COUCH
async function request(endpoint, method='GET', data={}) {
  try {
    const response = await axios.request({
      url: endpoint,
      method: method,
      baseURL: `https://${host}`,
      headers: { 'Authorization': `Basic ${token}` },
      data: data
    })
    return response
  } catch (error) { 
    console.error(`Axios request error for ${endpoint}:\n${error.response.status},${error.response.statusText}\n`)
    return error.response
  }
}




async function statusReport() {
  try {
    console.log( '=================' )
    const orders = await getAllOrders()
    for (let o = 0; o < orders.length; o++) {
      // console.log(orders[o])
      // console.log(root)
      await createIFNeeded(orders[o])
      // REMOTE STUFF
      const remote = await request(`source${orders[o]}/_all_docs?include_docs=true`)
      const remoteObjects = remote.rows.filter(res => (! res.id.includes('_design/')) && (! res.deleted))
      const remoteData = remoteObjects.map(r => r.doc.numbers).sort()
      // console.log(remoteData)
      // LOCAL STUFF
      const localFile = fs.readFileSync(`${root}/data/source${orders[o]}.json`)
      const localData = JSON.parse(localFile).sort()
      // console.log(localData)

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
          await request(`source${orders[o]}/_bulk_docs`,'POST',{"docs":result})
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
  const info = await request(`_all_dbs`)
  // console.log(info)
  const orders = info.filter(i => i.startsWith('source'))
  const nums = orders.map(o => parseInt(o.slice(6))).sort((a, b) => a - b)
  // console.log(nums)
  return nums
}



async function createIFNeeded(order) {
  const info = await request(`_all_dbs`)
  // console.log(info)
  if (!info.includes(`source${order}`)) { 
    console.log(`creating source${order} remotely`)
    await request(`source${order}`,'PUT')
    const ddoc = {
      "_id": "_design/d",
      "views": { "i": { "map": "function (doc) { emit(doc.numbers, 1); }" } }
    }
    await request(`source${order}`,'POST',ddoc)
  }
  if (!fs.existsSync(`${root}/data/source${order}.json`)) {
    console.log(`creating source${order} locally`)
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
    const confirmation = await request(`source${order}`,'POST',doc)
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
    const data = await request(`source${order}/_design/d/_view/${style === 'unique' ? 'u' : 'i'}?include_docs=false&limit=200&skip=${offset}`)
    return data
  } catch (error) { console.log( 'viewSourceDB:', error ) }
}



async function viewAllDB(order) {
  try {
    let data;
    if(order === 'themes') {
      data = await request(`themes/_all_docs?include_docs=true`)
    } else {
      data = await request(`source${order}/_all_docs?include_docs=true`)
    }
    return data.rows
  } catch (error) { console.log( 'viewAllDB:', error ) }
}



// https://couch.fania.eu/source4/_design/d/_view/i?key=[1,2,15,16,12,14,3,5,13,7,10,4,8,11,6,9]
async function findDocs(order, numbersList) {
  try {
    const results = await request(`source${order}/_design/d/_view/i?include_docs=true&keys=${JSON.stringify(numbersList)}`)
    // console.log(results)
    return results
  } catch (error) { console.log( 'findDocs:', error ) }
}



// IS THIS NEEDED?
// TODO remove nano
// https://couch.fania.eu/index4/_design/reducer/_view/sharedLengths?group=true
// async function getSharedLengths(order,style) {
//   try {
//     // console.log('trying to get shared lengths', order, style)
//     // const st = style === "quadvertex" ? "QV" :
//     //            style === "quadline"   ? "QL" :
//     //            style === "straight"   ? "S"  :
//     //            style === "arc"        ? "A"  :
//     //            style === "altarc"     ? "AA" : "QV"
//     const db = nano.use(`index${order}`)
//     const query = { group: true }
//     // const results = await db.view('reducers', `sharedLengths${st}`, query)
//     const results = await db.view('reducers', 'lengths', query)
//     const styleOnly = results.rows.filter(r => r.key[1] === style)
//     // const output = styleOnly.map(s => {'key': s.key[0], 'value': s.value})
//     return styleOnly
//   } catch (error) { console.log( 'getSharedLengths:', error ) }
// }




// TODO finish converting axios request
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

    // TODO if exists overwrite
    const exists = await request(`themes/${theme._id}`,'HEAD')
    // const exists = await request(`themes/${theme._id}`,'GET')
    if (exists.status != 200) {
      console.log("inside if - doesn't exist")
      await request(`themes`,'POST',theme)
    }
    else {
      console.log("inside else - exists")
      console.log(exists.data)
    }


    // const info = await nano.db.list()
    // if (!info.includes('themes')) { 
    //   await nano.db.create('themes')
    // }
    // const db = nano.use('themes')
    // await db.get(theme._id, async (err, res) => {
    //   if (!err) {
    //     const update = theme
    //     update._rev = res._rev
    //     await db.insert(update, (err,res) => { console.log('Updated it.') });
    //   } else {
    //     await db.insert(theme, (err,res) => { 
    //       if(err) console.log('Not inserted.') 
    //       else console.log('Inserted it.')
    //     });
    //   }
    // });

  } catch (error) { console.log( 'insertTheme:', error ) }
}







// function doDatabaseStuff(things) {
//   // const db = await openDB(…);
//   idb.open('magic', 1, (upgradeDB) => {
//     let store = upgradeDB.createObjectStore('settings', { keyPath: 'id' })
//     store.put(things)
//   })

// }





// TODO finish converting axios request
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
