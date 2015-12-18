var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var winston = require('winston');
var validator = require('validator');

var store = require('./store');
var emoji = require('emoji');
var config = require('../config/config');

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

function get_random_arbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generate_emoji_url() {
	var emojiUrl = '';
	for(var i=0; i<4; i++) {
		var index = get_random_arbitrary(0, emojis.length);
		emojiUrl += emojis[index];
	}
	return emojiUrl;
}

/*** 		API bindings 			***/

// Create a router for API calls
var router = express.Router();

// API test route

router.post('/', function(req, res) {
	var url = req.body.url;

	if(!url) {
		return res.json({result: 'error', message: 'url argument required'});
	}

	if(!validator.isURL(url, {require_protocol: true})) {
		return res.json({result: 'error', message: 'url does not appear to be a url, try adding http(s)://'});
	}

	var emojiUrl = generate_emoji_url(url);

	store.save(url, emojiUrl)
	.then(function(newUrl) {
		return res.json({result: 'okay', message: 'created url', real_url: url, emoji_url: newUrl})

	}, function(error) {
		winston.error(error);
		return res.json({result: 'error', message: 'internal error, our bad'})
	});
});

router.get('/:path', function(req, res) {

	var path = req.params.path;

	if(!path) {
		return res.redirect('./index.html');
	}

	store.find(path)
	.then(function(url) {
		if(url) {
			//return res.json({message: 'found url', url: url});
			return res.redirect(301, url);
		} else {
			return res.json({message: 'link not found', path: path});
		}

	}, function(error) {
		winston.error('error', {error: error});
		//return res.json({message: 'internal error, our bad'});
	});
});

/*** 		Application Logic		***/

// Bind exit event to finalize database
process.on('exit', function(code) {
	console.log("Exiting server");
	db.close();
});

// Bind static folder
var static_dir = __dirname + '/../static';
console.log(static_dir)
app.use(express.static(static_dir));

// Bind API router to /api path
app.use('/', router);


// Start the server
app.listen(port);
console.log("Server running at http://127.0.0.1:" + port);

