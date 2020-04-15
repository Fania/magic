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

// const localDB = new PouchDB('magic4')
// const remoteDB = new PouchDB(`https://${process.env.DB_ADMIN}:${process.env.DB_ADMIN_PASSWORD}@couch.fania.eu/magic4/_all_docs?include_docs=true`, {skip_setup: true})

var stuff;



const btoa = function(str){ return Buffer.from(str).toString('base64'); }

var user = {
  name: process.env.DB_ADMIN,
  password: process.env.DB_ADMIN_PASSWORD
};
console.log(user);

 authentication_handlers = {chttpd_auth, cookie_authentication_handler}, {chttpd_auth, default_authentication_handl$

 authentication_handlers = {chttpd_auth, cookie_authentication_handler}, {chttpd_auth, default_authentication_handl$

 authentication_handlers = {chttpd_auth, cookie_authentication_handler}, {chttpd_auth, default_authentication_handl$


// var pouchOpts = {
//   skip_setup: true
// };

// var ajaxOpts = {
//   ajax: {
//     headers: {
//       Authorization: 'Basic ' + btoa(user.name + ':' + user.password)
//     }
//   }
// };

// var db = new PouchDB('https://couch.fania.eu/magic4', pouchOpts);

// db.login(user.name, user.password, ajaxOpts).then(function() {
//   return db.allDocs();
// }).then(function(docs) {
//   console.log(docs);
// }).catch(function(error) {
//   console.error(error);
// });








// remoteDB.info().then(function (info) {
//   console.log(info);
//   console.log(info.rows[0]);
//   console.log(info.rows[1].value);
//   stuff = info.id;

// })





// remoteDB.logIn(process.env.DB_ADMIN, process.env.DB_ADMIN_PASSWORD, (err, response) => {
// // remoteDB.logIn(process.env.DB_USER, process.env.DB_USER_PASSWORD, (err, response) => {
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



//     console.log(response.ok);
//     stuff = response;

//     remoteDB.allDocs({include_docs: true}, function(err, doc) {
//       console.log(err, doc);
//     });
//     remoteDB.info().then(function (info) {
//       console.log(info);
//     })



//   }






// })


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