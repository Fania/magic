const express = require('express')
const app = express()



const couch = require('./couch.js')

// couch.insertDoc('./data/sourceRaczinski880.json','sourceRaczinski880')
couch.insertAll('./data/sourceRaczinski880.json','sourceraczinski880')
// couch.insertAll('./data/index4R.json','sourceraczinski880')



// const fs = require('fs')
// const util = require('util')
// const dotenv = require('dotenv').config()
// const user = process.env.DB_USER
// const password = process.env.DB_USER_PASSWORD
// const host = process.env.DB_HOST
// const nano = require('nano')(`https://${user}:${password}@${host}`)
// const db = nano.use('sourceraczinski880')
// async function insertDoc(doc, id) {
//   try {
//     const head = await db.head(id)
//     if (head.statusCode === 200) {
//       const existingDoc = await db.get(id)
//       const rev = existingDoc._rev
//       doc._id = id
//       doc._rev = rev
//       await db.insert(doc)
//       console.log(`updated id ${id} with rev ${rev}`)
//     } else {
//       await db.insert(doc, id)
//       console.log(`inserted id ${id}`)
//     }
//   } catch (error) { console.log('insertDoc ', error) }
// }
// async function insertAll() {
//   try {
//     const readFile = util.promisify(fs.readFile);
//     const rawData = await readFile('./data/sourceRaczinski880.json')
//     const data = JSON.parse(rawData)
//     for (let i in data) {
//       await insertDoc( {'numbers': data[i]}, `${(parseInt(i) + 1)}` )
//     }
//   } catch (error) { console.log('insertAll', error) }
// }
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
// app.get('/data', (req, res) => {
// 	db.list({ include_docs: true }, (err, body) => {
// 		res.send(body)
// 	})
// })