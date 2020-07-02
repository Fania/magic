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



// couch.getDBInfo()

// const localData = fs.readFileSync(`./data/source4.json`)
// const data = JSON.parse(localData)
// data.forEach( d => {
//   const coords = draw.getCoords(4,d)
//   const svgString = draw.prepareSVG(4,'colours',coords,0)
//   console.log(svgString)
// })



// couch.areThereChanges(12)



async function setupOrder(n) {
  await couch.areThereChanges(n)
  const result = await generate.index(n)
  await couch.populateDB(result, n)
}
// setupOrder('4a')
// setupOrder(5)


async function setupOrderLARGE(n) {
  const sourceData = fs.readFileSync(`./data/source${n}.json`)
  const data = JSON.parse(sourceData)
  const len = data.length
  console.log('total source squares', len)
  const chunks = _.chunk(data, 1000)
  console.log(chunks.length)

  const forLoop = async _ => {
    console.log('Start async loop')
    for (let i=0; i < chunks.length; i++) {
      console.log('inside chunks loop', i, chunks[i].length)
      const result = await generate.indexLARGE(n,chunks[i])
      await couch.populateDBLARGE(result, n)
    }
    console.log('End async loop')
  }
  forLoop(chunks)

  // chunks.forEach(async (ch,i) => {
  //   console.log('inside chunks loop', i, ch.length)
  //   const result = await generate.indexLARGE(n,ch)
  //   await couch.populateDBLARGE(result, n)
  // })
}
// setupOrderLARGE('5a')



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
app.get('/data/:n', async (req, res) => {
  const order = req.params.n
  const data = await couch.viewAllDB(order)
  res.send( data )
})
app.get('/data/lengths/:n/:s', async (req, res) => {
  const order = req.params.n
  const style = req.params.s
  const data = await couch.getSharedLengths(order,style)
  res.send( data )
})
app.get('/data/:n/source', async (req, res) => {
  const order = req.params.n
  res.sendFile(`./data/source${order}.json`, {root: './'})
})
app.get('/data/:n/:s/:o', async (req, res) => {
  const order = req.params.n
  const style = req.params.s
  const offset = req.params.o
  const data = await couch.viewDB(order, 'filters', style, offset)
  res.send( data )
})
app.get('/data/themes', async (req, res) => {
  const data = await couch.viewAllDB('themes')
  res.send( data )
})
