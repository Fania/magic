const fs = require('fs')
const util = require('util')
const dotenv = require('dotenv').config()
const express = require('express')
const app = express()

// const base = 'https://couch.fania.eu/'
// const view = '_design/lengths/_view/lengths'
const user = process.env.DB_USER
const password = process.env.DB_USER_PASSWORD
const host = process.env.DB_HOST
const nano = require('nano')(`https://${user}:${password}@${host}`)
const db = nano.use('magictest')


// async function getInfoDB() {
//   const info = await db.info()
//   return info
// }
// getInfoDB()


// async function insertDocDB(doc) {
//   await db.insert(doc, doc.id)
// }


const testDoc = {"id":1,"numbers":{"array":[1,2,15,16,12,14,3,5,13,7,10,4,8,11,6,9],"svg":"<svg id='numbers-4R-1' class='order-xt pad' viewbox='0 -50 380 370'><text x='0' y='0'>01</text><text x='100' y='0'>02</text><text x='200' y='100'>03</text><text x='300' y='200'>04</text><text x='300' y='100'>05</text><text x='200' y='300'>06</text><text x='100' y='200'>07</text><text x='0' y='300'>08</text><text x='300' y='300'>09</text><text x='200' y='200'>10</text><text x='100' y='300'>11</text><text x='0' y='100'>12</text><text x='0' y='200'>13</text><text x='100' y='100'>14</text><text x='200' y='0'>15</text><text x='300' y='0'>16</text></svg>"},"straight":{"2579":[614],"svg":"<svg id='straight-4R-1' class='order-x pad' viewbox='-2 -2 304 304'><path class='lines' d='M0,0 100,0 200,100 300,200 300,100 200,300 100,200 0,300 300,300 200,200 100,300 0,100 0,200 100,100 200,0 300,0 0,0 '/></svg>"},"quadvertex":{"1918":[],"svg":"<svg id='quadvertex-4R-1' class='order-x pad' viewbox='-2 -2 304 304'><path class='lines' d='M 50,0 Q 100,0 150,50 Q 200,100 250,150 Q 300,200 300,150 Q 300,100 250,200 Q 200,300 150,250 Q 100,200 50,250 Q 0,300 150,300 Q 300,300 250,250 Q 200,200 150,250 Q 100,300 50,200 Q 0,100 0,150 Q 0,200 50,150 Q 100,100 150,50 Q 200,0 250,0 Q 300,0 150,0 Q 0,0 50,0 '/></svg>"},"quadline":{"1918":[],"svg":"<svg id='quadline-4R-1' class='order-x pad' viewbox='-2 -2 304 304'><path class='lines' d='M 0,0 Q 100,0 200,100 Q 300,200 300,100 Q 200,300 100,200 Q 0,300 300,300 Q 200,200 100,300 Q 0,100 0,200 Q 100,100 200,0 Q 300,0 0,0 '/></svg>"},"arc":{"4052":[614],"svg":"<svg id='arc-4R-1' class='order-x' viewbox='-200 -170 680 680'><path class='lines arc' d='M0,0 A 50,50 0 1 1 0,0 A 50,50 0 1 1 100,0 A 50,50 0 1 1 200,100 A 50,50 0 1 1 300,200 A 50,50 0 1 1 300,100 A 50,50 0 1 1 200,300 A 50,50 0 1 1 100,200 A 50,50 0 1 1 0,300 A 50,50 0 1 1 300,300 A 50,50 0 1 1 200,200 A 50,50 0 1 1 100,300 A 50,50 0 1 1 0,100 A 50,50 0 1 1 0,200 A 50,50 0 1 1 100,100 A 50,50 0 1 1 200,0 A 50,50 0 1 1 300,0 A 50,50 0 1 1 0,0 '/></svg>"},"altarc":{"2220":[773],"svg":"<svg id='altarc-4R-1' class='order-x' viewbox='-200 -170 680 680'><path class='lines arc' d='M0,0 A 10,10 0 1 1 100,0 A 10,10 0 1 1 300,200 A 10,10 0 1 1 200,300 A 10,10 0 1 1 0,300 A 10,10 0 1 1 200,200 A 10,10 0 1 1 0,100 A 10,10 0 1 1 100,100 A 10,10 0 1 1 0,0 '/></svg>"},"simQuadVertex":"test"}



async function insertDoc(doc, id) {
  const head = await db.head(id)
  if (head.statusCode === 200) {
    const existingDoc = await db.get(id)
    const rev = existingDoc._rev
    doc._id = id
    doc._rev = rev
    await db.insert(doc)
    console.log(`updated id ${id} with rev ${rev}`)
  } else {
    await db.insert(doc, id)
    console.log(`inserted id ${id}`)
  }
}
// insertDoc(testDoc, '1')


async function insertAll() {
  const readFile = util.promisify(fs.readFile);
  const rawData = await readFile('./data/index4R.json')
  const data = JSON.parse(rawData)
  for (let i in data) {
    await insertDocDB(data[i], `${data[i].id}`)
  }
}
// insertAll()













// Start the server
app.listen(3000, () => {
	console.log('Listening at http://localhost:3000')
})

// Configure our app to serve static files from the current directory
app.use(express.static('./'));

// Display `index.html` when localhost:3000 is requested
app.get('/', (req, res) => {
  res.sendFile('./index.html', {root: './'})
})

// Send all records when there's a GET request to `localhost:3000/test`
app.get('/data', (req, res) => {
	db.list({ include_docs: true }, (err, body) => {
		res.send(body)
	})
})