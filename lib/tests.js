'use strict'

const couch = require('./couch.js')


module.exports = {
  couchDB
}


async function couchDB() {
  console.log('TEST COUCH AXIOS')
  // TODO add test for bulk docs add, update and delete
  console.log('\nGET all dbs')
  const response = await couch.request(`_all_dbs`)
  console.log(response.status,response.statusText)

  console.log('\nHEAD check doc exists - TRUE')
  const response2 = await couch.request(`themes/test`,'HEAD')
  console.log(response2.headers.etag)
  console.log(response2.status,response2.statusText)

  console.log('\nHEAD check doc exists - FALSE')
  const response21 = await couch.request(`themes/testXYZ`,'HEAD')
  console.log(response21.status,response21.statusText)

  console.log('\nGET all themes with docs')
  const response3 = await couch.request(`themes/_all_docs?include_docs=true`)
  console.log(response3.status,response3.statusText)

  console.log('\nGET all source7 with docs')
  const response4 = await couch.request(`source7/_all_docs?include_docs=true`)
  console.log(response4.status,response4.statusText)

  console.log('\nGET find doc(s) in source3 with doc(s) using view')
  const response5 = await couch.request(`source3/_design/d/_view/i?include_docs=true&keys=${JSON.stringify([[4,9,2,3,5,7,8,1,6]])}`)
  console.log(response5.status,response5.statusText)

  console.log('\nGET find doc in source3 with doc using query')
  const response51 = await couch.request(`source3/_find`,'POST',{
    "selector": {
      "numbers": [4,9,2,3,5,7,8,1,6]
    },
    "limit": 1,
    "execution_stats": true
  })
  console.log(response51.status,response51.statusText)

  console.log('\nPUT new db')
  const response6 = await couch.request(`test`,'PUT')
  console.log(response6.status,response6.statusText)

  console.log('\nPOST new doc to test - new (with typo)')
  const response7 = await couch.request(`test`,'POST',{
    "numbers": [2,9,4,7,5,3,6,1]
  })
  console.log(response7.status,response7.statusText)

  console.log('\nPOST new doc to test - update (fix typo)')
  const response70 = await couch.request(`test/_find`,'POST',{
    "selector": {
      "numbers": [2,9,4,7,5,3,6,1]
    },
    "fields": ["_id", "_rev"],
    "limit": 1
  })
  console.log(response70.status,response70.statusText)
  const response72 = await couch.request(`test/${response70.data.docs[0]["_id"]}?rev=${response70.data.docs[0]["_rev"]}`,'PUT',{
    "numbers": [2,9,4,7,5,3,6,1,8]
  })
  console.log(response72.status,response72.statusText)

  console.log('\nDELETE new doc from test')
  const response73 = await couch.request(`test/_find`,'POST',{
    "selector": {
      "numbers": [2,9,4,7,5,3,6,1,8]
    },
    "fields": ["_id", "_rev"],
    "limit": 1
  })
  const response71 = await couch.request(`test/${response73.data.docs[0]["_id"]}?rev=${response73.data.docs[0]["_rev"]}`,'DELETE')
  console.log(response71.status,response71.statusText)

  console.log('\nPOST new view to test')
  const response8 = await couch.request(`test`,'POST',{
    "_id": "_design/d",
    "views": { "i": { "map": "function (doc) { emit(doc.numbers, 1); }" } }
  })
  console.log(response8.status,response8.statusText)

  console.log('\nDELETE test db')
  const response9 = await couch.request(`test`,'DELETE')
  console.log(response9.status,response9.statusText)

}
