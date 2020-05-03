'use strict'

const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
// const dotenv = require('dotenv').config()
const app = express()
app.use(express.static('./'))


const nunjucks = require('nunjucks')
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
})


// app.use(express.urlencoded())
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


const couch = require('./lib/couch.js')
const generate = require('./lib/generators.js')
const checker = require('./lib/checker.js')
const draw = require('./lib/draw.js')
const trans = require('./lib/transformations.js')
const gallery = require('./lib/gallery.js')
// const cmd = require('./lib/haskell.js')
// cmd.ls()






async function setupOrder(n) {
  const result = await generate.index(n)
  await couch.populateDB(result, n)
}
// setupOrder('4a')
// setupOrder(3)
// setupOrder(4)

async function initialiseAll() {
  await setupOrder(3)
  await setupOrder(4)
  await setupOrder(5)
  await setupOrder(6)
  await setupOrder(7)
  await setupOrder(8)
  await setupOrder(9)
  await setupOrder(10)
  await setupOrder(11)
  await setupOrder(12)
  await setupOrder(13)
  await setupOrder(14)
  await setupOrder(15)
  await setupOrder(16)
  await setupOrder(17)
  await setupOrder(18)
  await setupOrder(19)
  await setupOrder(20)
}

// initialiseAll()



// START THE SERVER
app.listen(3000, () => {
	console.log('Listening at http://localhost:3000')
})



// ROUTES
app.get('/', (req, res) => { res.render('home.njk') })

app.get('/gallery', (req, res) => { 
  res.render('gallery.njk', { files: gallery.getFiles() })
})

app.get('/about', (req, res) => { res.render('about.njk') })

app.get('/contribute', (req, res) => { res.render('contribute.njk') })
app.post('/contribute', async (req, res) => {
  const result = await checker.magic( req.body.manualInput )
  res.render('contribute.njk', { result: result } )
})

// order 3
// 4,9,2,3,5,7,8,1,6
// 2,9,4,7,5,3,6,1,8
// 8,1,6,3,5,7,4,9,2
// 4,3,8,9,5,1,2,7,6
// 6,7,2,1,5,9,8,3,4
// 8,3,4,1,5,9,6,7,2
// 6,1,8,7,5,3,2,9,4
// 2,7,6,9,5,1,4,3,8
// 1,4,14,15,13,16,2,3,12,9,7,6,8,5,11,10
// 1,15,24,8,17,23,7,16,5,14,20,4,13,22,6,12,21,10,19,3,9,18,2,11,25






// DATA API
app.get('/data/:n/arrays', async (req, res) => {
  const order = req.params.n
  const data = await couch.viewDB(order,'filter','arrays', false)
  res.send( data )
})
app.get('/data/:n/unique', async (req, res) => {
  const order = req.params.n
  const data = await couch.viewDB(order,'filter','unique', false)
  res.send( data )
})
app.get('/data/:n/quadvertex', async (req, res) => {
  const order = req.params.n
  const data = await couch.viewDB(order,'filter','quadvertex', false)
  res.send( data )
})
app.get('/data/:n/numbers', async (req, res) => {
  const order = req.params.n
  const data = await couch.viewDB(order,'filter','numbers', false)
  res.send( data )
})
app.get('/data/:n/straight', async (req, res) => {
  const order = req.params.n
  const data = await couch.viewDB(order,'filter','straight', false)
  res.send( data )
})
app.get('/data/:n/quadline', async (req, res) => {
  const order = req.params.n
  const data = await couch.viewDB(order,'filter','quadline', false)
  res.send( data )
})
app.get('/data/:n/arc', async (req, res) => {
  const order = req.params.n
  const data = await couch.viewDB(order,'filter','arc', false)
  res.send( data )
})
app.get('/data/:n/altarc', async (req, res) => {
  const order = req.params.n
  const data = await couch.viewDB(order,'filter','altarc', false)
  res.send( data )
})
app.get('/data/:n/source', async (req, res) => {
  const order = req.params.n
  res.sendFile(`./data/source${order}.json`, {root: './'})
})
