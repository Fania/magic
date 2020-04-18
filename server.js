const fs = require('fs');
const dotenv = require('dotenv').config()
const express = require('express');

// const base = 'https://couch.fania.eu/'
// const view = '_design/lengths/_view/lengths'
const user = process.env.DB_USER
const password = process.env.DB_USER_PASSWORD
const host = process.env.DB_HOST

const nano = require('nano')(`https://${user}:${password}@couch.fania.eu`);
const app = express();
const db_name = 'test';
const db = nano.use(db_name);



function insertDoc(doc, tried){
	db.insert(doc, function(err, http_body, http_headers){
		if(err){
			if(err.message === 'no_db_file' && tried < 1){
				return nano.db.create(db_name,function(){
					insert_doc(doc, tried+1);
				});
			} else {
				return console.log(err);
			}
		}
	});
}

// Populate the `test` database with data from `test_data.json`
fs.readFile('./data/index4R.json',function(err, data){
	var aData = JSON.parse(data);
	for (var n = 0; n < aData.length; n++){
		insertDoc(aData[n],0);
	}
});

// Start the server
var server = app.listen(3000, function () {
	var port = server.address().port;
	console.log('Example app listening at http://localhost:%s', port);
});

// Configure our app to serve static files from the current directory
app.use(express.static('./'));

// Display `index.html` when localhost:3000 is requested
app.get('/', function (req, res) {
  res.sendFile('./index.html', {root: './'});
});

// Send all records when there's a GET request to `localhost:3000/test`
app.get('/test', function (req, res) {
	db.list({ include_docs: true }, function(err, body){
		res.send(body);
	});
});