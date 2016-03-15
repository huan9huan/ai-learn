var Quiz = require('../../dsl/quiz')
var redis = require('redis')
var debug = require('debug')("api")
const db = redis.createClient()

db.on('ready',() => {
  debug("redis ready!")
  new Quiz("bingo",db).gen().then(debug).catch(debug)	
})

exports.get = function *(){
  var word = this.params.word;
  var quiz = new Quiz(word,db)
  var question = yield quiz.gen()
  this.body = JSON.stringify(question);
  this.type = "application/json"
  this.status = 200;
}