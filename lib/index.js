'use strict';

var MojiliApp = require('./app');

// Load port
var port = process.env.PORT || 8000;

// Launch application
var app = new MojiliApp(port);
