const fs = require('fs')
const util = require('util')
require('dotenv').config()

// const view = '_design/order/_view/numeric?include_docs=true'
const user = process.env.DB_USER
const password = process.env.DB_USER_PASSWORD
const host = process.env.DB_HOST
const nano = require('nano')(`https://${user}:${password}@${host}`)



async function getDB(dbName) {
  try {
    // console.log( '......... database setup .........' )
    // console.log( 'Database name:', typeof dbName, dbName )
    // console.log( nano )
    const dbs = await nano.db.list()
    // console.log( dbs )
    // console.log( dbs.includes( dbName ) )
    // console.log( dbs.includes( 'magic4' ) )
    // create database if it doesn't already exist
    if ( !dbs.includes( dbName ) ) { 
      // console.log( 'creating new database' )
      await nano.db.create( dbName )  // needs await
    } else { 
      // console.log( 'database already exists' ) 
    }
    const db = nano.use( dbName )
    // console.log( 'using:', (await db.info()).db_name )
    return db
  } catch (error) { console.log( 'getDB:', error ) }
}

async function insertDoc(doc, db) {
  try {
    // console.log( `......... upserting document ${doc.id} .........` )
    // insert or update document
    // no idea how to write this with async / await
    db.get(doc.id, async (error, existing) => { 
      if(!error) doc._rev = existing._rev
      await db.insert(doc, doc.id)
    })
  } catch (error) { console.log( 'insertDoc:', error ) }
}

async function populateDB(sourcePath, dbName) {
  try {
    console.log( '......... INITIAL SETUP .........' )
    console.log( `Populating ${dbName} with data from ${sourcePath}` )
    const readFile = util.promisify(fs.readFile);
    const sourceData = await readFile(sourcePath)
    const data = JSON.parse(sourceData)
    const db = await getDB(dbName)  // needs await
    // await insertDoc(data[0], db)
    // await insertDoc(data[300], db)
    for (let i in data) {
      await insertDoc(data[i], db)
    }
  } catch (error) { console.log( 'populateDB:', error ) }
}


async function viewDB(dbName, design, view) {
  const db = await getDB(dbName)  // needs await
  const data = await db.view(design, view, { include_docs: true })
  // console.log( data )
  return data
}




module.exports = {
  populateDB,
  viewDB
}
