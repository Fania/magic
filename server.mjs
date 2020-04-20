'use strict'

import express from 'express'
const app = express()


// POPULATE DATABASE
import { populateDB, viewDB } from './couch.mjs'
// populateDB('./data/sourceRaczinski880.json','sourceraczinski');
// populateDB('./data/index4R.json','indexraczinski')





// GENERATE INDEX
import { initialIndex } from './generators.mjs'
// initialIndex('4')



// START THE SERVER
app.listen(3000, () => {
	console.log('Listening at http://localhost:3000')
})

// SERVE STATIC FILES
app.use(express.static('./'));


// ROUTE INDEX
app.get('/', (req, res) => {
  res.sendFile('./index.html', {root: './'})
})

// ROUTE DATA API
app.get('/data/4/all', async (req, res) => {
  const data = await viewDB('indexraczinski','order','numeric')
  res.send( data )
})
app.get('/data/4/unique', async (req, res) => {
  const data = await viewDB('indexraczinski','filter','unique')
  res.send( data )
})
app.get('/data/4/source', async (req, res) => {
  const data = await viewDB('sourceraczinski','order','numeric')
  res.send( data )
})