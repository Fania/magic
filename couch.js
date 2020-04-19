const fs = require('fs')
const util = require('util')
require('dotenv').config()

// const base = 'https://couch.fania.eu/'
// const view = '_design/lengths/_view/lengths'
const user = process.env.DB_USER
const password = process.env.DB_USER_PASSWORD
const host = process.env.DB_HOST
const nano = require('nano')(`https://${user}:${password}@${host}`)


const testDoc = {"id":1,"numbers":{"array":[1,2,15,16,12,14,3,5,13,7,10,4,8,11,6,9],"svg":"<svg id='numbers-4R-1' class='order-xt pad' viewbox='0 -50 380 370'><text x='0' y='0'>01</text><text x='100' y='0'>02</text><text x='200' y='100'>03</text><text x='300' y='200'>04</text><text x='300' y='100'>05</text><text x='200' y='300'>06</text><text x='100' y='200'>07</text><text x='0' y='300'>08</text><text x='300' y='300'>09</text><text x='200' y='200'>10</text><text x='100' y='300'>11</text><text x='0' y='100'>12</text><text x='0' y='200'>13</text><text x='100' y='100'>14</text><text x='200' y='0'>15</text><text x='300' y='0'>16</text></svg>"},"straight":{"2579":[614],"svg":"<svg id='straight-4R-1' class='order-x pad' viewbox='-2 -2 304 304'><path class='lines' d='M0,0 100,0 200,100 300,200 300,100 200,300 100,200 0,300 300,300 200,200 100,300 0,100 0,200 100,100 200,0 300,0 0,0 '/></svg>"},"quadvertex":{"1918":[],"svg":"<svg id='quadvertex-4R-1' class='order-x pad' viewbox='-2 -2 304 304'><path class='lines' d='M 50,0 Q 100,0 150,50 Q 200,100 250,150 Q 300,200 300,150 Q 300,100 250,200 Q 200,300 150,250 Q 100,200 50,250 Q 0,300 150,300 Q 300,300 250,250 Q 200,200 150,250 Q 100,300 50,200 Q 0,100 0,150 Q 0,200 50,150 Q 100,100 150,50 Q 200,0 250,0 Q 300,0 150,0 Q 0,0 50,0 '/></svg>"},"quadline":{"1918":[],"svg":"<svg id='quadline-4R-1' class='order-x pad' viewbox='-2 -2 304 304'><path class='lines' d='M 0,0 Q 100,0 200,100 Q 300,200 300,100 Q 200,300 100,200 Q 0,300 300,300 Q 200,200 100,300 Q 0,100 0,200 Q 100,100 200,0 Q 300,0 0,0 '/></svg>"},"arc":{"4052":[614],"svg":"<svg id='arc-4R-1' class='order-x' viewbox='-200 -170 680 680'><path class='lines arc' d='M0,0 A 50,50 0 1 1 0,0 A 50,50 0 1 1 100,0 A 50,50 0 1 1 200,100 A 50,50 0 1 1 300,200 A 50,50 0 1 1 300,100 A 50,50 0 1 1 200,300 A 50,50 0 1 1 100,200 A 50,50 0 1 1 0,300 A 50,50 0 1 1 300,300 A 50,50 0 1 1 200,200 A 50,50 0 1 1 100,300 A 50,50 0 1 1 0,100 A 50,50 0 1 1 0,200 A 50,50 0 1 1 100,100 A 50,50 0 1 1 200,0 A 50,50 0 1 1 300,0 A 50,50 0 1 1 0,0 '/></svg>"},"altarc":{"2220":[773],"svg":"<svg id='altarc-4R-1' class='order-x' viewbox='-200 -170 680 680'><path class='lines arc' d='M0,0 A 10,10 0 1 1 100,0 A 10,10 0 1 1 300,200 A 10,10 0 1 1 200,300 A 10,10 0 1 1 0,300 A 10,10 0 1 1 200,200 A 10,10 0 1 1 0,100 A 10,10 0 1 1 100,100 A 10,10 0 1 1 0,0 '/></svg>"},"simQuadVertex":"test"}


const testDoc2 = {"id":2,"numbers":{"array":[1,2,15,16,12,14,3,5,13,7,10,4,8,11,6,9],"svg":"<svg id='numbers-4R-1' class='order-xt pad' viewbox='0 -50 380 370'><text x='0' y='0'>01</text><text x='100' y='0'>02</text><text x='200' y='100'>03</text><text x='300' y='200'>04</text><text x='300' y='100'>05</text><text x='200' y='300'>06</text><text x='100' y='200'>07</text><text x='0' y='300'>08</text><text x='300' y='300'>09</text><text x='200' y='200'>10</text><text x='100' y='300'>11</text><text x='0' y='100'>12</text><text x='0' y='200'>13</text><text x='100' y='100'>14</text><text x='200' y='0'>15</text><text x='300' y='0'>16</text></svg>"},"straight":{"2579":[614],"svg":"<svg id='straight-4R-1' class='order-x pad' viewbox='-2 -2 304 304'><path class='lines' d='M0,0 100,0 200,100 300,200 300,100 200,300 100,200 0,300 300,300 200,200 100,300 0,100 0,200 100,100 200,0 300,0 0,0 '/></svg>"},"quadvertex":{"1918":[],"svg":"<svg id='quadvertex-4R-1' class='order-x pad' viewbox='-2 -2 304 304'><path class='lines' d='M 50,0 Q 100,0 150,50 Q 200,100 250,150 Q 300,200 300,150 Q 300,100 250,200 Q 200,300 150,250 Q 100,200 50,250 Q 0,300 150,300 Q 300,300 250,250 Q 200,200 150,250 Q 100,300 50,200 Q 0,100 0,150 Q 0,200 50,150 Q 100,100 150,50 Q 200,0 250,0 Q 300,0 150,0 Q 0,0 50,0 '/></svg>"},"quadline":{"1918":[],"svg":"<svg id='quadline-4R-1' class='order-x pad' viewbox='-2 -2 304 304'><path class='lines' d='M 0,0 Q 100,0 200,100 Q 300,200 300,100 Q 200,300 100,200 Q 0,300 300,300 Q 200,200 100,300 Q 0,100 0,200 Q 100,100 200,0 Q 300,0 0,0 '/></svg>"},"arc":{"4052":[614],"svg":"<svg id='arc-4R-1' class='order-x' viewbox='-200 -170 680 680'><path class='lines arc' d='M0,0 A 50,50 0 1 1 0,0 A 50,50 0 1 1 100,0 A 50,50 0 1 1 200,100 A 50,50 0 1 1 300,200 A 50,50 0 1 1 300,100 A 50,50 0 1 1 200,300 A 50,50 0 1 1 100,200 A 50,50 0 1 1 0,300 A 50,50 0 1 1 300,300 A 50,50 0 1 1 200,200 A 50,50 0 1 1 100,300 A 50,50 0 1 1 0,100 A 50,50 0 1 1 0,200 A 50,50 0 1 1 100,100 A 50,50 0 1 1 200,0 A 50,50 0 1 1 300,0 A 50,50 0 1 1 0,0 '/></svg>"},"altarc":{"2220":[773],"svg":"<svg id='altarc-4R-1' class='order-x' viewbox='-200 -170 680 680'><path class='lines arc' d='M0,0 A 10,10 0 1 1 100,0 A 10,10 0 1 1 300,200 A 10,10 0 1 1 200,300 A 10,10 0 1 1 0,300 A 10,10 0 1 1 200,200 A 10,10 0 1 1 0,100 A 10,10 0 1 1 100,100 A 10,10 0 1 1 0,0 '/></svg>"},"simQuadVertex":"hello"}



async function getDB(dbName) {

  console.log( '......... database setup .........' )
  console.log( 'Database name:', typeof dbName, dbName )
  // console.log( nano )
  const dbs = await nano.db.list()
  console.log( dbs )

  // console.log( dbs.includes( dbName ) )
  // console.log( dbs.includes( 'magic4' ) )

  // create database if it doesn't already exist
  if ( !dbs.includes( dbName ) ) { 
    console.log( 'creating new database' )
    await nano.db.create( dbName )  // needs await
  } else { console.log( 'database already exists' ) }

  const db = nano.use( dbName )
  console.log( 'using database: ', (await db.info()).db_name )

  return db

}

async function insertDoc(id, doc, db) {

  try {

    // console.log( db, doc )
    console.log( '......... inserting document .........' )
    
    console.log( 'id: ' )
    console.log( id )
    console.log( typeof id )
    console.log( 'doc: ' )
    console.log( doc )
    console.log( typeof doc )
    console.log( 'db: ' )
    // console.log( db )
    console.log( typeof db )

  


  } catch (error) { console.log( error ) }



}

async function populateDB(sourcePath, dbName) {

  console.log( '......... INITIAL SETUP .........' )
  console.log( `Populating ${dbName} with data from ${sourcePath}` )

  try {
    const readFile = util.promisify(fs.readFile);
    const sourceData = await readFile(sourcePath)
    const data = JSON.parse(sourceData)
    const db = await getDB(dbName)  // needs await
    for (let i in data) {
      console.log('i: ', i)
      console.log(typeof i)
      console.log(`data${i}: ${data[i]}`)
      console.log(data[i])
      const id = data[i].id ? data[i].id : `${parseInt(i)+1}`
      await insertDoc(id, data[i], db)
    }
  } catch (error) { console.log('populateDB: ', error) }

}








module.exports = {
  // insertDoc,
  // insertAll,
  getDB,
  insertDoc,
  populateDB
}








// const db = nano.use('magictest')
// const db1 = nano.use('magictest')


// const db_name = 'test';
// const db = nano.use(db_name);

// function insertDoc(doc, tried){
// 	db.insert(doc, function(err, http_body, http_headers){
// 		if(err){
// 			if(err.message === 'no_db_file' && tried < 1){
// 				return nano.db.create(db_name,function(){
// 					insert_doc(doc, tried+1);
// 				});
// 			} else {
// 				return console.log(err);
// 			}
// 		}
// 	});
// }

// async function insertAll() {
//   // Populate the `test` database with data from `test_data.json`
//   fs.readFile('./data/index4R.json',function(err, data){
//     var aData = JSON.parse(data);
//     for (var n = 0; n < aData.length; n++){
//       insertDoc(aData[n],0);
//     }
//   });

// }



















// async function useDB(target) {
//   try {
//     let database;
//     const dbs = await nano.db.list()
//     if (!dbs.includes(target)) {
//       await nano.db.create(target)
//       console.log(`create and use new database called ${target}`)
//     } else {
//       console.log(`use existing database called ${target}`)
//     }
//   } catch (e) {
//     console.log("FUCK useDB", e);
//   } finally {
//     database = nano.use(target);
//     console.log("useDB is done");
//     return database;
//   }
// }


// async function insertDoc(target, doc, id) {

//   try {

//     const database = await useDB(target);

//     // const database = nano.use(target)
//     // console.log('database: ', database)
//     // console.log(id)
//     // console.log('info: ', await database.info())
//     // console.log('head: ', await database.head(id))

//     console.log(`id: ${id}, ${doc}`);
//     // console.log('info: ', await database.info());
//     // console.log(typeof id)
//     const existingDoc = await database.get(id);
//     console.log(existingDoc);

//     const head = await database.head(`${id}`);

//     console.log('head: ', head);
//     console.log('head: ', head.statusCode);
//     if (head.statusCode === 200) {
//       console.log('inside if 200')
//       const existingDoc = await database.get(id)
//       const rev = existingDoc._rev
//       doc._id = id
//       doc._rev = rev
//       await database.insert(doc)
//       console.log(`updated id ${id} with rev ${rev}`)
//     } else {
//       console.log('inside else 40X')
//       await database.insert(doc, `${id}`)
//       console.log(`inserted id ${id}`)
//     }

//   } catch (e) {
//     console.log("FUCK insertDoc", e);
//   } finally {
//     console.log("insertDoc is done");
//   }


//   // const head = await database.head(id)
//   // // const head = await database.head(id)
//   // // const head = util.promisify(database.head(id))
//   // console.log(head)
//   // console.log(head.statusCode)
//   // if (head.statusCode === 200) {
//   //   const existingDoc = await database.get(id)
//   //   const rev = existingDoc._rev
//   //   doc._id = id
//   //   doc._rev = rev
//   //   await database.insert(doc)
//   //   console.log(`updated id ${id} with rev ${rev}`)
//   // } else {
//   //   await database.insert(doc, id)
//   //   console.log(`inserted id ${id}`)
//   // }
// }
// insertDoc(testDoc, '1')


// async function insertAll(source, target) {
//   try {
//     const readFile = util.promisify(fs.readFile);
//     const rawData = await readFile(source)
//     const data = JSON.parse(rawData)
//     for (let i in data) {
//       const id = data[i].id ? data[i].id : parseInt(i)+1
//       console.log('data[i]: ', {'numbers': data[i]})
//       await insertDoc(target, {'numbers': data[i]}, `${id}`)
//     }
//   } catch (error) { console.log('insertAll: ', error) }
// }
// insertAll('./data/index4R.json','magictest')






