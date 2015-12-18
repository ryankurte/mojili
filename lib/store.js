
var winston = require('winston');

var db = require('../models');

function to_base64(str) {
	return new Buffer(str).toString('base64');
}

function from_base64(str) {
	return new Buffer(str, 'base64').toString('utf8');
}

var StorageManager = function() {
	db.sequelize.sync();
}

StorageManager.prototype.generate = function(real_url) {
	while(true) {
		emoju_url = generate_emoji_url();
	}
}

StorageManager.prototype.save = function(real_url, emoji_url) {
	real_url_base64 = to_base64(real_url);
	emoji_url_base64 = to_base64(emoji_url);

	return db.link.findOne({where: {real_url: real_url_base64}})
	.then(function(link) {
		if(link) {
			var found_url = from_base64(link.emoji_url);
			winston.info("Located duplicate link", {real_url: real_url, emoji_url: found_url})
			return Promise.resolve(from_base64(link.emoji_url));
		}
		return db.link.create({
			real_url: to_base64(real_url),
			emoji_url: to_base64(emoji_url)
		})
		.then(function(link) {
			winston.info("Created link", {real_url: real_url});
			var a = {
				real_url: from_base64(link.real_url),
				emoji_url: from_base64(link.emoji_url)
			}
			return Promise.resolve(a);
		})
	})
}

StorageManager.prototype.find = function(emoji_url) {
	emoji_url_base64 = to_base64(emoji_url);

	return db.link.findOne({where: {emoji_url: emoji_url_base64}})
	.then(function(link) {
		if(link) {
			winston.info("Found link", {real_url: link.real_url})
			return Promise.resolve(from_base64(link.real_url));
		} else {
			winston.info("Link not found", {emoji_url: emoji_url})
			return Promise.resolve();
		}
	});
}

module.exports = function() {
	return new StorageManager();
}();
