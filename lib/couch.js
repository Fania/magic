'use strict'

const _ = require('lodash')
const fs = require('fs')
const axios = require('axios')
const dotenv = require('dotenv').config()
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const host = process.env.DB_HOST
const root = process.cwd()
const token = Buffer.from(`${user}:${password}`, 'utf8').toString('base64')
const generate = require('./generators.js')




module.exports = {
  request,
  statusReport,
  getAllOrders,
  createIFNeeded,
  populateDBSource,
  viewSourceDB,
  viewFilterDB,
  viewCuratedCounterDB,
  updateCuratedCounterDB,
  viewAllDB,
  findDocs,
  insertDoc,
  insertTheme
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
    console.error(`Axios request error for ${endpoint}:\n${error.response.status},${error.response.statusText} - ${error.response.data.reason}\n`)
    return error.response
  }
}




async function statusReport() {
  try {
    console.log( '=================' )
    const orders = await getAllOrders()
    for (let o = 0; o < orders.length; o++) {
      console.log(o)
      // console.log(orders[o])
      // console.log(root)
      await createIFNeeded(orders[o])
      // REMOTE STUFF
      const remote = await request(`source${orders[o]}/_all_docs?include_docs=true`)
      const remoteObjects = remote.data.rows.filter(res => (! res.id.includes('_design/')) && (! res.deleted))
      const remoteData = remoteObjects.map(r => r.doc.numbers).sort()
      console.log(remoteData.length)
      // LOCAL STUFF
      const localFile = fs.readFileSync(`${root}/data/source${orders[o]}.json`)
      if(o==25) console.log(JSON.parse(localFile))
      const localData = JSON.parse(localFile).sort()
      if(o==25) console.log(localData)

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
  const orders = info.data.filter(i => i.startsWith('source'))
  const nums = orders.map(o => parseInt(o.slice(6))).sort((a, b) => a - b)
  // console.log(nums)
  return nums
}



async function createIFNeeded(order) {
  const info = await request(`_all_dbs`)
  // console.log(info)
  if (!info.data.includes(`source${order}`)) { 
    console.log(`creating source${order} remotely`)
    await request(`source${order}`,'PUT')
    await request(`source${order}`,'POST',{
      "_id": "_design/d",
      "views": { "i": { "map": "function (doc) { emit(doc.numbers, 1); }" } }
    })
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
    const confirmation = await request(`source${order}`,'POST',{
      "numbers": numbers
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
    // u for unique 383, i for inclusive 880
    const response = await request(`source${order}/_design/d/_view/${style === 'unique' ? 'u' : 'i'}?include_docs=false&limit=200&skip=${offset}`)
    return response.data
  } catch (error) { console.log( 'viewSourceDB:', error ) }
}


// FILTERS/FLAGS FOR RESEARCH
async function viewFilterDB(filter) {
  // console.log('viewFilterDB', order, style, offset)
  try {
    const response = await request(`source4/_design/d/_view/${filter}`)
    return response.data
  } catch (error) { console.log( 'viewFilterDB:', error ) }
}



// CURATED COUNTER
async function viewCuratedCounterDB() {
  try {
    const response = await request(`curated/621e1e19efb4ec48e16d5254c21be53a`)
    console.log('viewCuratedCounterDB',response.data)
    return response.data
  } catch (error) { console.log( 'viewCuratedCounterDB:', error ) }
}
async function updateCuratedCounterDB() {
  try {
    const response = await request(`curated/621e1e19efb4ec48e16d5254c21be53a`)
    console.log('updateCuratedCounterDB',response.data)
    let tmpHeaders = response.headers
    tmpHeaders['If-Match'] = response.data._rev
    let tmpItem = response.data
    if(response.data.counter < 23) {
      tmpItem.counter++
    } else {
      tmpItem.counter = 0
    }
    const confirmation = await request(`curated/621e1e19efb4ec48e16d5254c21be53a`,'PUT',tmpItem,tmpHeaders)
    const respObj = JSON.parse(confirmation.config['data'])
    console.log('confirmation',respObj)
    return respObj
  } catch (error) { console.log( 'updateCuratedCounterDB:', error ) }
}




async function viewAllDB(order) {
  try {
    let response;
    if(order === 'themes') {
      response = await request(`themes/_all_docs?include_docs=true`)
    } else {
      response = await request(`source${order}/_all_docs?include_docs=true`)
    }
    return response.data.rows
  } catch (error) { console.log( 'viewAllDB:', error ) }
}



// https://couch.fania.eu/source4/_design/d/_view/i?key=[1,2,15,16,12,14,3,5,13,7,10,4,8,11,6,9]
async function findDocs(order, numbersList) {
  try {
    const results = await request(`source${order}/_design/d/_view/i?include_docs=true`,"POST",{"keys": numbersList})
    // console.log(results)
    return results.data
  } catch (error) { console.log( 'findDocs:', error ) }
}


// curl https://couch.fania.eu/source27/_design/d/_view/i?include_docs=true
// curl --header "Content-Type: application/json" --request POST --data @nuremberg.json http://localhost:5000/weather/historic -s > dump



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
    const exists = await request(`themes/${theme._id}`,'HEAD')
    if (exists.status != 200) {
      await request(`themes`,'POST',theme)
    }
    else {
      const rev = (exists.headers.etag).replace(/"/g,'')
      await request(`themes/${theme._id}?rev=${rev}`,'PUT',theme)
    }
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
    const info = await request(`_all_dbs`)
    if (info.data.includes(`source${order}`)) { 
      await request(`source${order}`,'DELETE')
    }
    await request(`source${order}`,'PUT')

    // u for unique 383, i for inclusive 880
    if (order === 4) {
      data.push({
        "_id": "_design/d",
        "views": {
          "i": {
            "map": "function(doc) {\n    emit(doc.numbers, doc.flags);\n}"
          },
          "u": {
            "map": "function(doc) {\n    if (doc.flags.includes('unique') || doc.flags.includes('identity')) {\n        emit(doc.numbers, doc.flags);\n    }\n}"
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
    // bulk docs needs individual rev ids for updates
    await request(`source${order}/_bulk_docs`,'POST',{docs:output})
  } catch (error) { console.log( 'populateDBSource:', error ) }
  finally {
    console.log( '-------------------- END ---------------------' )
  }
}
