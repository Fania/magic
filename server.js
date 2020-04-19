const express = require('express')
const app = express()


const couch = require('./couch.js')

// couch.populateDB('./data/sourceRaczinski880.json','sourceraczinski');
// couch.populateDB('./data/index4R.json','indexraczinski')





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

// API data
app.get('/data', async (req, res) => {
  const data = await couch.viewDB('indexraczinski','filter','unique')
  res.send( data )
})