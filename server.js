'use strict'

import express from 'express'
const app = express()


// POPULATE DATABASE
import { populateDB, viewDB } from './couch.js'
// populateDB('./data/sourceRaczinski880.json','sourceraczinski');
// populateDB('./data/index4R.json','indexraczinski')





// GENERATE INDEX
import { initialIndex } from './generators.js'




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
app.get('/data', async (req, res) => {
  const data = await viewDB('indexraczinski','filter','unique')
  res.send( data )
})