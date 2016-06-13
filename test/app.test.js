'use strict';

var assert = require('assert');
var request = require('supertest');
var emoji = require('emoji');
var emojiRegex = require('emoji-regex');

var MojiliApp = require('../lib/app.js');


describe('API tests', function() {
    var mojili = null;

    var testUrl = "https://iamadog.cat"
    var emojiUrl = null;

    before(function(done) {
        mojili = new MojiliApp(9000);
        done();
    });

    after(function(done) {
        mojili.server.close();
        done();
    })

    it('server running', function(done) {
        request(mojili.app)
            .get('/emoji')
            .expect(200)
            .end(done);
    });

    it('fetches random emoji', function(done) {
        request(mojili.app)
            request(mojili.app)
            .get('/emoji')
            .expect(200)
            .expect(function(res) {
                assert(typeof res.body.emoji !== 'undefined');
                assert.equal(emojiRegex().test(res.body.emoji), true);
            })
            .end(done)
    });

    it('encodes url', function(done) {
        request(mojili.app)
            .post('/')
            .send({url: testUrl})
            .expect(function(res) {
                assert(typeof res.body.result !== 'undefined');
                assert.equal(res.body.result, 'okay');
                assert.equal(res.body.real_url, testUrl);
                assert.equal(emojiRegex().test(res.body.emoji_url), true);
                emojiUrl = res.body.emoji_url;
            })
            .expect(200, done)
    });
    
    // It appears supertest doesn't support passing emojis in URLs
    // So they have to be URIencoded first

    it('fetches real URL', function(done) {
        request(mojili.app)
            .get('/' + encodeURIComponent(emojiUrl))  
            .expect(function(res) {
                assert(typeof res.header.location !== 'undefined');
                assert.equal(res.header.location, testUrl);
            })
            .expect(301, done)
    });

    it('returns not found for invalid url', function(done) {
        request(mojili.app)
            .get('/' + encodeURIComponent('😀😬😁😂'))  
            .expect(function(res) {
                assert(typeof res.body.result !== 'undefined');
                assert.equal(res.body.result, 'error');
                assert.equal(res.body.message, 'link not found');
            })
            .expect(200, done)
    });

});

