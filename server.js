'use strict'

const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
// const minify = require('express-minify')
const _ = require('lodash')
// const dotenv = require('dotenv').config()
const app = express()
app.use(compression())
// app.use(minify())
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



// START THE SERVER
app.listen(3000, () => {
	// console.log('Magic Squares running on http://localhost:3000')
})




async function setupSource(n) {
  const result = await generate.source(n)
  await couch.populateDBSource(result, n)
}
async function initialiseSources() {
  await setupSource(3)
  await setupSource(4)
  await setupSource(5)
  await setupSource(6)
  await setupSource(7)
  await setupSource(8)
  await setupSource(9)
  await setupSource(10)
  await setupSource(11)
  await setupSource(12)
  await setupSource(13)
  await setupSource(14)
  await setupSource(15)
  await setupSource(16)
  await setupSource(17)
  await setupSource(18)
  await setupSource(19)
  await setupSource(20)
}

// initialiseSources()

couch.statusReport()















// ROUTES
app.get('/', (req, res) => { res.render('home.njk') })
app.post('/', async (req, res) => { 
  const theme = req.body
  if(!theme.overlap) theme.overlap = 'false'
  await couch.insertTheme(theme)
  res.render('home.njk')
})

app.get('/gallery', (req, res) => { 
  res.render('gallery.njk', { files: gallery.getFiles() })
})

app.get('/about', (req, res) => { res.render('about.njk') })

app.get('/contribute', (req, res) => { res.render('contribute.njk') })
app.post('/contribute', async (req, res) => {
  const result = await checker.magic( req.body.manualInput )
  // TODO add to cache
  res.render('contribute.njk', { result: result } )
})



// DATA API

// n = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
// s = ['arrays','arc','altarc','quadvertex','quadline','numbers','unique','straight','circles','blocks','tetromino']
// o = [0,200,400,600, etc]

// TODO add http://localhost to cors ?
// NEW - Add CORS headers - see https://enable-cors.org/server_expressjs.html
app.use( (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://magic.fania.eu')
  res.header('Access-Control-Allow-Headers', 
             'Origin, X-Requested-With, Content-Type, Accept, ETag')
  // res.header('Access-Control-Expose-Headers', 'ETag')
  next()
})


// order matters

// app.get('/data/:n(\\d+)/:s/:o(\\d+)', async (req, res) => {
app.get('/data/:n/:s/:o', async (req, res) => {
  const order = req.params.n
  const style = req.params.s
  const offset = req.params.o
  // const data = await couch.viewDB(order, 'filters', style, offset)
  // const source = await couch.viewSourceDB(order,offset)
  const source = await couch.viewSourceDB(order,style,offset)
  const data = await generate.svgData(source,order,style)
  res.send( data )
})
app.get('/data/themes', async (req, res) => {
  const data = await couch.viewAllDB('themes')
  res.send( data )
})
