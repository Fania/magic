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
	// console.log('Running on http://localhost:3000')
})




async function setupSource(n) {
  const result = await generate.source(n)
  await couch.populateDBSource(result, n)
}
async function initialiseSources() {
  const orders = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,24,25,27,28,30,32,256]
  const forLoop = async _ => { 
    for (let i=0; i < orders.length; i++) {
      await setupSource(orders[i])
    } 
  }
  forLoop()
}

// initialiseSources()
// setupSource(256)
// setupSource(4)



// couch.statusReport()



const test = async () => {
  console.log('TEST COUCH AXIOS GET')
  console.log('\nGET all dbs')
  const response = await couch.request(`_all_dbs`)
  console.log(response.status,response.statusText)

  console.log('\nHEAD check doc exists - TRUE')
  const response2 = await couch.request(`themes/test`,'HEAD')
  console.log(response2.status,response2.statusText)

  console.log('\nHEAD check doc exists - FALSE')
  const response21 = await couch.request(`themes/testXYZ`,'HEAD')
  console.log(response21.status,response21.statusText)

  console.log('\nGET all themes with docs')
  const response3 = await couch.request(`themes/_all_docs?include_docs=true`)
  console.log(response3.status,response3.statusText)

  console.log('\nGET all source7 with docs')
  const response4 = await couch.request(`source7/_all_docs?include_docs=true`)
  console.log(response4.status,response4.statusText)

  console.log('\nGET find doc(s) in source3 with doc(s) using view')
  const response5 = await couch.request(`source3/_design/d/_view/i?include_docs=true&keys=${JSON.stringify([[4,9,2,3,5,7,8,1,6]])}`)
  console.log(response5.status,response5.statusText)

  console.log('\nGET find doc in source3 with doc using query')
  const response51 = await couch.request(`source3/_find`,'POST',{
    "selector": {
      "numbers": [4,9,2,3,5,7,8,1,6]
    },
    "limit": 1,
    "execution_stats": true
  })
  console.log(response51.status,response51.statusText)

  console.log('\nPUT new db')
  const response6 = await couch.request(`test`,'PUT')
  console.log(response6.status,response6.statusText)

  console.log('\nPOST new doc to test')
  const response7 = await couch.request(`test`,'POST',{
    "numbers": [2,9,4,7,5,3,6,1,8]
  })
  console.log(response7.status,response7.statusText)

  console.log('\nDELETE new doc from test')
  const response70 = await couch.request(`test/_find`,'POST',{
    "selector": {
      "numbers": [2,9,4,7,5,3,6,1,8]
    },
    "fields": ["_id", "_rev"],
    "limit": 1,
    "execution_stats": true
  })
  console.log(response70.status,response70.statusText)
  const response71 = await couch.request(`test/${response70.data.docs[0]["_id"]}?rev=${response70.data.docs[0]["_rev"]}`,'DELETE')
  console.log(response71.status,response71.statusText)

  console.log('\nPOST new view to test')
  const response8 = await couch.request(`test`,'POST',{
    "_id": "_design/d",
    "views": { "i": { "map": "function (doc) { emit(doc.numbers, 1); }" } }
  })
  console.log(response8.status,response8.statusText)

  console.log('\nDELETE test db')
  const response9 = await couch.request(`test`,'DELETE')
  console.log(response9.status,response9.statusText)

}
test()










// ROUTES
app.get('/', (req, res) => { res.render('home.njk') })
app.post('/', async (req, res) => { 
  const theme = req.body
  if(!theme.overlap) theme.overlap = 'false'
  await couch.insertTheme(theme)
  res.render('home.njk')
})

app.get('/research', (req, res) => { res.render('research.njk') })
app.post('/research', async (req, res) => { 
  // const theme = req.body
  // if(!theme.overlap) theme.overlap = 'false'
  // await couch.insertTheme(theme)
  res.render('research.njk')
})

app.get('/gallery', (req, res) => { 
  res.render('gallery.njk', { files: gallery.getFiles() })
})

app.get('/about', (req, res) => { res.render('about.njk') })

app.get('/contribute', (req, res) => { res.render('contribute.njk') })
app.post('/contribute', async (req, res) => {
  const result = await checker.magic( req.body.manualInput )
  // console.log(result)
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
app.get('/data/orders', async (req, res) => {
  const data = await couch.getAllOrders()
  res.send( data )
})
