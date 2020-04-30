'use strict'

const fs = require('fs')
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
const gallery = require('./lib/gallery.js')
// const cmd = require('./lib/haskell.js')
// cmd.ls()
gallery.getImgs()





async function setupOrder(n) {
  await generate.index(n)
}
// setupOrder('4a')
// setupOrder(3)







// START THE SERVER
app.listen(3000, () => {
	console.log('Listening at http://localhost:3000')
})



// ROUTES
app.get('/', (req, res) => {
  res.render('home.njk')
})
app.get('/gallery', (req, res) => {
  const imgFiles = fs.readdirSync('./meta/imgs/gallery')
  const vidFiles = fs.readdirSync('./meta/vids')
  res.render('gallery.njk', { imgFiles: imgFiles, vidFiles: vidFiles })
})
app.get('/about', (req, res) => {
  res.render('about.njk')
})
app.get('/contribute', (req, res) => {
  res.render('contribute.njk')
})
app.post('/contribute', async (req, res) => {
  const result = checker.magic( req.body.manualInput )
  // console.log( `The numbers [${req.body.manualInput}] are ${result.magic ? 'magic' : 'not magic'}!` ) 
  console.log( result )

  if (result.magic) {
    // console.log( result.order )
    const found = await couch.findDoc(result.order,result.numbers)
    console.log( 'found', found )
    // console.log( found.docs )
    // console.log( typeof found.docs )
    // console.log( found.docs == [] )
    // console.log( found.docs === [] )
    // console.log( found.bookmark === 'nil' )

    // NEW MAGIC SQUARE
    if (found.rows.length === 0) {
      console.log( 'found new magic square' )
      result.exists = false

      // const latestID = await couch.getLatestID(result.order)

      // need to know the id
      // need to update local original source json
      // need to update remote index too
      await couch.insertDoc(result.numbers,result.order)


    // EXISTING MAGIC SQUARE
    } else {
      console.log( 'magic square already exists' )
      result.doc = found.rows[0].doc
      result.exists = true
    }

// order 3
// [[4,9,2,3,5,7,8,1,6],[2,9,4,7,5,3,6,1,8],[8,1,6,3,5,7,4,9,2],[4,3,8,9,5,1,2,7,6],[6,7,2,1,5,9,8,3,4],[8,3,4,1,5,9,6,7,2],[6,1,8,7,5,3,2,9,4],[2,7,6,9,5,1,4,3,8]]

// 1,4,14,15,13,16,2,3,12,9,7,6,8,5,11,10



    // check for transformations?
    // use full 7040 db and filter everything down from there?

  }

  // console.log( result )


  // does it exist in DB already?
  // if so, then display it
  // else add to DB
  // and then display it
  res.render('contribute.njk', { result: result } )
})





// DATA API
app.get('/data/:n/all', async (req, res) => {
  const order = req.params.n
  const data = await couch.viewDB(order,'filter','all', true)
  res.send( data )
})
app.get('/data/:n/unique', async (req, res) => {
  const order = req.params.n
  const data = await couch.viewDB(order,'filter','unique', true)
  res.send( data )
})
app.get('/data/:n/arrays', async (req, res) => {
  const order = req.params.n
  const data = await couch.viewDB(order,'filter','arrays', false)
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
