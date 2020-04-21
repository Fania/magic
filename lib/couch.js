'use strict'

const fs = require('fs')
const util = require('util')
const Nano = require('nano')
const dotenv = require('dotenv').config()

const user = process.env.DB_USER
const password = process.env.DB_USER_PASSWORD
const host = process.env.DB_HOST
const nano = Nano(`https://${user}:${password}@${host}`)



module.exports = {
  populateDB,
  viewDB
}



async function getDB(dbName) {
  try {
    const dbs = await nano.db.list()
    if ( !dbs.includes( dbName ) ) { 
      await nano.db.create( dbName )  // needs await
    } 
    const db = nano.use( dbName )
    return db
  } catch (error) { console.log( 'getDB:', error ) }
}

async function insertDoc(doc, db) {
  try {
    db.get(doc.id, async (error, existing) => { 
      if(!error) doc._rev = existing._rev
      await db.insert(doc, doc.id)
    })
  } catch (error) { console.log( 'insertDoc:', error ) }
}

async function populateDB(sourcePath, dbName) {
  try {
    console.log( `Populating ${dbName} with data from ${sourcePath}` )
    const readFile = util.promisify(fs.readFile);
    const sourceData = await readFile(sourcePath)
    const data = JSON.parse(sourceData)
    const db = await getDB(dbName)
    // await insertDoc(data[0], db)
    // await insertDoc(data[300], db)
    for (let i in data) {
      await insertDoc(data[i], db)
    }
  } catch (error) { console.log( 'populateDB:', error ) }
}

async function viewDB(dbName, design, view) {
  const db = await getDB(dbName)
  const data = await db.view(design, view, { include_docs: true })
  // console.log( data )
  return data
}
