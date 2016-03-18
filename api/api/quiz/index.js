var Quiz = require('../../dsl/quiz')
var Question = require('../../dsl/question')
var redis = require('redis')
var debug = require('debug')("api:quiz")
var QuizStore = require('../../store/quiz')

const db = redis.createClient()

db.on('ready',() => {
  debug("redis ready!")
})

exports.get = function *() {
  var word = this.params.word
  debug("generate quiz for word ", word)
  var quiz = new Question(db, word)
  try{
	  var question = yield quiz.gen()
	  this.body = JSON.stringify(question);
	  this.type = "application/json"
	  this.status = 200;  	
  }
  catch(err) {
    if(typeof err === "string")
    	err = {code:'fail', reason: err}
    this.body = JSON.stringify(err);
	  this.type = "application/json"
	  this.status = 200;  	
  }
}

exports.random = function *() {
  var quiz = new Quiz(db)
  var words = yield quiz.selectQuizWords()
  var questions = yield quiz.generateQuiz(words)
  debug(questions)
  this.body = JSON.stringify(questions);
  this.type = "application/json"
  this.status = 200;    
}

exports.start = function *() {

}

exports.stop = function *() {

}