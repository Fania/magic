'use strict'

const express = require('express')
const bodyParser = require('body-parser')
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
const cmd = require('./lib/haskell.js')
// cmd.ls()






async function setupOrder(n) {
  await generate.source(n)
  await generate.index(n)
}

// setupOrder('4a')
// setupOrder(20)



// couch.createMetaDocs( 'index3', '3', 'order', 'numeric' )






// START THE SERVER
app.listen(3000, () => {
	console.log('Listening at http://localhost:3000')
})



// ROUTES
app.get('/', (req, res) => {
  res.render('index.njk')
})
app.get('/gallery', (req, res) => {
  res.render('gallery.njk')
})
app.get('/about', (req, res) => {
  res.render('about.njk')
})
app.get('/contribute', (req, res) => {
  res.render('contribute.njk', { feedback: 'blank' } )
})
app.post('/contribute', async (req, res) => {
  const result = checker.isMagic( req.body.manualInput )
  // console.log( `The numbers [${req.body.manualInput}] are ${result.magic ? 'magic' : 'not magic'}!` ) 

  if (result.magic) {
    // console.log( result.order )
    const found = await couch.searchDB(`index${result.order}`, result.numbers)
    result.doc = found.docs[0]
    // console.log( found )
    found.bookmark !== 'nil' ? result.exists = true : result.exists = false




// 1,4,14,15,13,16,2,3,12,9,7,6,8,5,11,10



    // check for transformations?
    // use full 7040 db and filter everything down from there?

  }

  console.log( result )


  // does it exist in DB already?
  // if so, then display it
  // else add to DB
  // and then display it
  res.render('contribute.njk', { feedback: result } )
})





// DATA API
app.get('/data/:order/all', async (req, res) => {
  const o = req.params.order
  const data = await couch.viewDB(`index${o}`,'order','numeric')
  res.send( data )
})
app.get('/data/:order/unique', async (req, res) => {
  const o = req.params.order
  const data = await couch.viewDB(`index${o}`,'filter','unique')
  res.send( data )
})
app.get('/data/:order/source', async (req, res) => {
  const o = req.params.order
  const data = await couch.viewDB(`index${o}`,'order','numeric')
  res.send( data )
})


app.get('/data/4/test', async (req, res) => {
  res.sendFile('./data/index4.json', {root: './'})
  // res.json('./data/index4.json', {root: './'})
})


