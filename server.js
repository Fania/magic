const express = require('express')
const app = express()



const couch = require('./couch.js')

// couch.insertDoc('./data/sourceRaczinski880.json','sourceRaczinski880')
couch.insertAll('./data/sourceRaczinski880.json','sourceraczinski880')
// couch.insertAll('./data/index4R.json','sourceraczinski880')













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