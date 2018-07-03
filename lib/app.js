'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var winston = require('winston');
var validator = require('validator');

var store = require('./store');
var emoji = require('emoji');
var config = require('../config/config');

/***        Application Setup       ***/

var emoji_url_length = 4;

/***        Internal Methods       ***/

function get_random_arbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomEmoji(emojis) {
    var randomIndex = get_random_arbitrary(0, emojis.length);
    return emojis[randomIndex];
}

var URLProtocolRegEx = new RegExp("^(\\w+:\\/\\/)");

function URLProtocolToLowerCase(url) {
    if (URLProtocolRegEx.test(url)) {
        return url.replace(URLProtocolRegEx, (URLProtocolRegEx.exec(url)[0]).toLowerCase());
    } else {
        return url;
    }
}

function generate_emoji_url(emojis) {
    var emoji_url = '';
    for(var i=0; i<emoji_url_length; i++) {
        emoji_url += getRandomEmoji(emojis);
    }
    return emoji_url;
}

/***        Interface Class       ***/


module.exports = class MojiliApp {
    constructor(port) {

        //Create express app
        var app = express();

        // Set up body parser for retrieval of POST data
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        var emojis = this.emojis = [];

        for (var i in emoji.EMOJI_MAP) {
            emojis.push(i);
        }

        /***        API bindings            ***/

        // Create a router for API calls
        var router = express.Router();

        // API test route

        router.post('/', function(req, res) {
            var url = URLProtocolToLowerCase(req.body.url).trim();

            if(!url) {
                return res.json({result: 'error', message: 'url argument required'});
            }

            if(!validator.isURL(url, {require_protocol: true})) {
                return res.json({result: 'error', message: 'url does not appear to be a url, try adding http(s)://'});
            }

            var emojiUrl = generate_emoji_url(emojis);

            store.save(url, emojiUrl)
            .then(function(newUrl) {
                return res.json({result: 'okay', message: 'created url', real_url: url, emoji_url: newUrl})

            }, function(error) {
                winston.error(error);
                return res.json({result: 'error', message: 'internal error, our bad'})
            });
        });

        router.get('/emoji', function(req, res) {
            res.json({result: "okay", emoji: getRandomEmoji(emojis)});
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
                    return res.redirect(301, encodeURI(url));
                } else {
                    return res.json({result: 'error', message: 'link not found', path: path});
                }

            }, function(error) {
                winston.error('error', {error: error});
                //return res.json({message: 'internal error, our bad'});
            });
        });

        /***        Application Logic       ***/

        // Bind exit event to finalize database
        process.on('exit', function(code) {
            console.log("Exiting server");
        });

        // Bind static folder
        var static_dir = __dirname + '/../static';
        console.log(static_dir)
        app.use(express.static(static_dir));

        // Bind API router to /api path
        app.use('/', router);

        this.app = app;

        // Start the server
        this.server = app.listen(port);
        console.log("Server running at http://127.0.0.1:" + port);

        return this;
    }
}


