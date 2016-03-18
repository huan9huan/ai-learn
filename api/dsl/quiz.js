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
				})
			})
		}))
	}

	storeQuiz(questions) {
		return new QuizStore(this.db).saveQuiz(questions)
	}

	_isValidChoose(choose) {
		const valids = ["A","B","C","D","E","F"]
		return valids.filter((v) => {return choose === v}).length > 0
	}

	starQuiz() {
		return this.selectQuizWords().then(this.generateQuiz).then(this.storeQuiz)
	}
}

module.exports = Quiz