'use strict'

// module.exports = {
//   foo: function () {
//     // whatever
//   },
//   bar: function () {
//     // whatever
//   }
// };


const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-authentication'))
const dotenv = require('dotenv').config();

const localDB = new PouchDB('magicsquares')
const remoteDB = new PouchDB("http://couch.fania.eu/magicsquares", 
                            {skip_setup: true})


remoteDB.logIn(process.env.DB_USER, process.env.DB_PASSWORD, (err, response) => {
  if (err) {
    if (err.name === 'unauthorized' || err.name === 'forbidden') {
      // name or password incorrect
      console.log(err)
    } else {
      console.log(err)
      // cosmic rays, a meteor, etc.
    }
  }
  console.log(response)
});


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