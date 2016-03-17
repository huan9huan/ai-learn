var Quiz = require('../dsl/quiz')
var readline = require('readline')
var readlineSync = require('readline-sync');
var QuizStore = require('../store/quiz')
var redis = require('redis');
var debug = require('debug')("test")

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function once(q) {
	console.log("\n-------------Question-------------")
	var option = readlineSync.question(q.desc).toUpperCase()

	var internal = q.options.filter((o) => {return o.idx === option})[0]
	// debug("use choose option",internal,"corect is ",q.options)
	if( internal && internal.correct === true) {
		return true
	}else{
		return false
	}
}
function answer (questions) {
	// debug("recv quiz list",questions)
	return new Promise((resolve,reject) => {
		var correctSeq = []
		for(var i = 0; i < questions.length; i ++) {
			correctSeq.push(once(questions[i]))
		}
		resolve(correctSeq)
	})
}

function summary(correctSeq) {
	console.log("\n-------------DONE-------------")
	var total = correctSeq.length
	var score = correctSeq.filter((o) => {return o}).length
	return "score is :" + score + "/" + total + "(" + score * 100.0 / total + "%)"
}

function quizs(db,words) {
	return Promise.all(words.map(w => {
		return new Promise((resolve,reject) => {
			// debug("generating quiz for",w)
			new Quiz(w,db).gen().then(q => {
				// debug("generated quiz done",q)
				resolve(q)
			})
		})
	}))
}

function selectQuizWords(db) {
	return  new QuizStore(db).selectRemindWords()
}

const db = redis.createClient()
db.on('ready',() => {
  debug("redis ready!")
  selectQuizWords(db)
  // .then((words) => {debug(words);return words})
  .then(quizs.bind(this,db))
  .then(answer)
  .then(summary)
  .then(debug)
})