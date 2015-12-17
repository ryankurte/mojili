var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var db = require('../models');
var emoji = require('emoji');
var codes = require('./emoticons.json')

/*** 		Application Setup		***/

var config = {
    port: process.env.PORT || 8000,
    url_length: process.env.URL_LENGTH,
    db: process.env.DB_URL
};

//Create express app
var app = express();

// Set up body parser for retrieval of POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Load application settings
var port = process.env.PORT || 8000;

var emojis = [];

for (var i in emoji.EMOJI_MAP) {
	emojis.push(i);
}

console.log(emojis[0])
console.log(emojis.length)

function get_random_arbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generate_link() {
	var emojiUrl = '';
	for(var i=0; i<3; i++) {
		var index = get_random_arbitrary(0, emojis.length);
		emojiUrl += emojis[index];
	}
	return emojiUrl;
}

function save_link(url, emojiUrl) {

}


/*** 		API bindings 			***/

// Create a router for API calls
var router = express.Router();

// API test route

router.get('/new', function(req, res) {
	var url = req.body.url;

	var emojiUrl = generate_link(url);

	res.json({ url: url, emojiUrl: emojiUrl });
});

router.get('/:path', function(req, res) {
	res.json({ path: req.params.path });
});



/*** 		Application Logic		***/

// Bind exit event to finalize database
process.on('exit', function(code) {
	console.log("Exiting server");
	db.close();
});

// Bind API router to /api path
app.use('/', router);
//Bind static folder
app.use(express.static(__dirname + '/static'));

// Start the server
app.listen(port);
console.log("Server running at http://127.0.0.1:" + port);

