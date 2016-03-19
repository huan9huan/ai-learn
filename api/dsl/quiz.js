'use strict';
var Question = require('./question')
var QuizStore = require('../store/quiz')
var QuizSession = require('../model/quiz_session')
var debug = require('debug')('dsl:quiz')

class Quiz {
	constructor(db) {
		this.db = db
	}
	
	selectQuizWords() {
		return new QuizStore(this.db).selectRemindWords()
	}

	generateQuiz(words) {
		return Promise.all(words.map(w => {
			return new Promise((resolve,reject) => {
				debug(w)
				new Question(this.db,w).gen().then(q => {
					resolve(q)
				}).catch(err => {
					debug(err)
					resolve()
				})
			})
		}))
	}
	clean(questions) {
		var good = []
		questions.map((q) => {q ? good.push(q) : null})
		return good
	}

	storeQuiz(questions) {
		return new QuizStore(this.db).saveQuiz(questions)
	}

	starQuiz() {
		return this.selectQuizWords()
			.then(this.generateQuiz.bind(this))
			.then(this.clean)
			.then(this.storeQuiz.bind(this))
	}
}

module.exports = Quiz