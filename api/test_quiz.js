var Quiz = require('./dsl/quiz')
var redis = require('redis');
var debug = require('debug')("test")

const db = redis.createClient()
db.on('ready',() => {
  debug("redis ready!")
  new Quiz("bingo",db).gen().then(debug).catch(debug)	
})