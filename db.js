'use strict'



const dotenv = require('dotenv').config()
const NodeCouchDb = require('node-couchdb');

const base = 'https://couch.fania.eu/'
const dbname = 'magic4/'
const view = '_design/lengths/_view/lengths'
const user = process.env.DB_USER
const password = process.env.DB_USER_PASSWORD
const host = process.env.DB_HOST


let output;

const couch = new NodeCouchDb({
  host: host,
  protocol: 'https',
  port: 443,
  auth: {
    user: user,
    password: password
  }
})


couch.listDatabases().then(dbs => {
  console.log(dbs)
}, err => {
  console.log(err)
})


couch.get(dbname,view).then( (data, headers, status) => {
  console.log(data)
  console.log(headers)
  console.log(status)
  output = data

}, err => {
  console.log(err)
})



module.exports = { output }







// module.exports = {
//   foo: function () {
//     // whatever
//   },
//   bar: function () {
//     // whatever
//   }
// };



// const URL = "https://couch.fania.eu"

// function createDB(dbName) {
//     var req = new XMLHttpRequest();
//     req.open("PUT", URL + "/" + dbName, true);
//     req.setRequestHeader("Content-type", "application/json");

//     req.send();
// }

// function updateDB(dbName, docName, data) {
//     var req = new XMLHttpRequest();
//     req.open("PUT", URL + '/' + dbName + '/' + docName, true);
//     req.setRequestHeader("Content-type", "application/json");

//     req.send(JSON.stringify(data));
// }

// function getDB(dbName) {
//     var req = new XMLHttpRequest();
//     req.open("GET", URL + '/' + dbName + '/_all_docs', true);
//     req.setRequestHeader("Content-type", "application/json");

//     req.send(JSON.stringify(data));
// }

// console.log( getDB("magic4") )




// const dotenv = require('dotenv').config()
// // const request = require('request')

// // const url = 'https://couch.fania.eu/'
// // const db = 'magic4/'
// // const id = 'document_id'
// const user = process.env.DB_USER
// const password = process.env.DB_USER_PASSWORD



// Create a database/collection inside CouchDB

// request.put(url + db, function(err, resp, body) {
//   // Add a document with an ID

//   request.put({
//     url: url + db + id,
//     body: {message:'New Shiny Document', user: 'stefan'},
//     json: true,
//   }, function(err, resp, body) {
//     // Read the document

//     request(url + db + id, function(err, res, body) {
//       console.log(body.user + ' : ' + body.message)
//     })
//   })
// })






// const https = require('https')
// const base = `https://${user}:${password}@couch.fania.eu`
// const db = `/magic4`
// const params = `/_all_dbs`
// const url = base + db + params
// console.log(url)

// https.get(url, res => {
//   console.log('statusCode:', res.statusCode)
//   console.log('headers:', res.headers)

//   res.on('data', d => {
//     console.log(d)
    
//   })

// }).on('error', e => {
//   console.error(e)
// })






// const https = require('https')
// const gets = (url) => new Promise((resolve, reject) => {
//  https.get(url, (response) => {
//  let body = ''
//  response.on('data', (chunk) => body += chunk)
//  response.on('end', () => resolve(body))
//  }).on('error', reject)
// })
// const api = (page = 1) => {
//  return gets(`https://swapi.co/api/people/?page=${page}`)
// }
// (async () => console.log(await api()))()






// const PouchDB = require('pouchdb')
// PouchDB.plugin(require('pouchdb-authentication'))
// PouchDB.plugin(require('pouchdb-upsert'));
// const dotenv = require('dotenv').config();

// // const localDB = new PouchDB('magic4')
// const remoteDB = new PouchDB(`https://couch.fania.eu/magic4`, {skip_setup: true})

// // PouchDB.debug.enable('*');


// remoteDB.logIn(process.env.DB_USER, process.env.DB_USER_PASSWORD)
//   .then( response => {
//     console.log(response);
//     console.log("Yay");
//     // return response

//     // remoteDB.get('d4a5e12cb6326166db6577c7870040c3').then(function (doc) {
//     //   console.log(doc);
//     // }).catch(function (err) {
//     //   console.log(err);
//     // });

//     // remoteDB.allDocs({include_docs: true}, function(err, doc) {
//     //   console.log("inside allDocs");
//     //   console.log(err);
//     //   console.log(doc);
//     // });

//     // remoteDB.info().then(function (info) {
//     //   console.log("inside info");
//     //   console.log(info);
//     // })



//     // return remoteDB.allDocs();
//     // return remoteDB.logOut();
//   })
  // .then( (err,docs) => console.log(err,docs) )


  // .then( response => {
  //   return remoteDB.allDocs();
  // })
  // .then( docs => {
  //   console.log(docs);
  // })
  // .catch( error => {
  //   console.error(error);
  // });




// db.upsert('myDocId', function (doc) {
//   if (!doc.count) {
//     doc.count = 0;
//   }
//   doc.count++;
//   return doc;
// }).then(function (res) {
//   // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
// }).catch(function (err) {
//   // error
// });


// remoteDB.login(process.env.DB_USER, process.env.DB_USER_PASSWORD)
//   .then(function () {
//     remoteDB.allDocs({include_docs: true}, function(err, doc) {
//       console.log(err, doc);
//     });
//   });



// remoteDB.logIn(process.env.DB_ADMIN, process.env.DB_ADMIN_PASSWORD, (err, response) => {
// remoteDB.logIn(process.env.DB_USER, process.env.DB_USER_PASSWORD, (err, response) => {
// // remoteDB.logIn('admin', 'keystrokestemplate', (err, response) => {
//   if (err) {
//     if (err.name === 'unauthorized' || err.name === 'forbidden') {
//       // name or password incorrect
//       console.log(err)
//     } else {
//       console.log(err)
//       // cosmic rays, a meteor, etc.
//     }
//   } else {
//     console.log("with login", response);



// //     console.log(response.ok);
// //     stuff = response;

// //     remoteDB.allDocs({include_docs: true}, function(err, doc) {
// //       console.log(err, doc);
// //     });
//     remoteDB.info().then(function (info) {
//       console.log(info);
//     })



//   }

// })






// curl -X PUT http://localhost:5984/_users/org.couchdb.user:jan \
// -H "Accept: application/json" \
// -H "Content-Type: application/json" \
// -d '{"name": "jan", "password": "apple", "roles": [], "type": "user"}'












// localDB.sync(remoteDB, {live: true, retry: true})
//   .on('error', console.log.bind(console))

// localDB.sync(remoteDB, { live: true, retry: true, include_docs: true})
//   .on('change', change => {})
//   .on('paused', info => {})
//   .on('active', info => {})
//   .on('error', err => {
//     console.log("scripts: sync: totally unhandled error (shouldn't happen) in Website sync")
//   })

// localDB.info().then(info => {
//   console.log(info)
// })