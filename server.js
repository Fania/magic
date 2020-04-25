'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// app.use(express.urlencoded())
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



// POPULATE DATABASE
const couch = require('./lib/couch.js')
// couch.populateDB('./data/sourceRaczinski880.json','sourceraczinski');
// couch.populateDB('./data/index4.json','indexraczinski')


// GENERATE INDEX
const generate = require('./lib/generators.js')
// generate.index('4')


const checker = require('./lib/checker.js')
// checker.verifyAndSanitise(input)







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
  const data = await couch.viewDB('indexraczinski','order','numeric')
  res.send( data )
})
app.get('/data/4/unique', async (req, res) => {
  const data = await couch.viewDB('indexraczinski','filter','unique')
  res.send( data )
})
app.get('/data/4/source', async (req, res) => {
  const data = await couch.viewDB('sourceraczinski','order','numeric')
  res.send( data )
})


app.get('/data/4/test', async (req, res) => {
  res.sendFile('./data/index4.json', {root: './'})
  // res.json('./data/index4.json', {root: './'})
})





app.post('/upload', async (req, res) => {
  // console.log(req.body.manualInput)
  const result = checker.isMagic( req.body.manualInput )

  console.log( `The given numbers are ${result ? 'magic' : 'not magic'}!` ) 

  // does it exist in DB already?
  // if so, then display it
  // else add to DB
  // and then display it


  // res.send( { magic: result } )
  res.redirect('/')
  // res.sendFile('./index.html', {root: './', magic: result })
})
