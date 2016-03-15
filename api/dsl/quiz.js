'use strict';

var debug = require('debug')('dsl');
var QuizStore = require('../store/quiz')

class QuizBuilder {
	constructor(word) {
		this.word = word
	}
	setImpressions(impressions) {
		this.impressions = impressions;
	}
	setRemind(reminds) {
		if(reminds && this.reminds.length > 0) {
		  this.reminds = reminds;	
		  this.majar = this.reminds[0]
		}else{
			this.majar = this.impressions[0]
		}
	}
	setNoiseWords(noises) {
		this.noises = noises
	}
	build() {
		return new Question(this.word, this.majar.def.def, this.noises)
	}
}

class Question {
	constructor(word, desc, noises) {
		this.word = word
		this.desc = desc
		this.noises = noises
	}
}

class Quiz {

	constructor(word,db) {
		this.word = word
		this.quizStore = new QuizStore(db)
		this.quizBuilder = new QuizBuilder(this.word) 
	}
	_selectImpression() {
		return new Promise((resolve,reject) => {
			this.quizStore.selectImpression(this.quizBuilder.word)
			.then((impressions) => {
				if(!impressions || impressions.length == 0){
					var msg = "单词没有释义，请先定义"
					this.quizBuilder.setFail(msg)
					reject(msg)
				}
				else{
					this.quizBuilder.setImpressions(impressions)
					resolve(impressions)		
				}
			})
		})
	}
	_selectRemind() {
		return new Promise((resolve,reject) => {
			this.quizStore.selectReminds(this.word)
			.then((reminds) => {
				if(reminds && reminds.length > 0) {
					this.quizBuilder.setRemind(reminds)
					resolve(this.quizBuilder)
				}else{
					//没有提醒，则用第一个释义作为quiz的素材
					this.quizBuilder.setRemind()
					resolve(this.quizBuilder)
				}
			})
		})
	}
	_randomNoiseWord() {
		return new Promise((resolve,reject) => {
			this.quizStore.selectNoiseWord(this.word)
			.then((noises) => {
				if(noises && noises.length >= 1) {
					this.quizBuilder.setNoiseWords(noises)
					resolve(this.quizBuilder)
				}else{
					const msg = "历史单词太少"
					this.quizBuilder.setFail(msg)
					reject(msg)
				}
			})
		})
	}
	_compose() {
		return this.quizBuilder.build()
	}

	gen() {
		return this._selectImpression(this.word)
				.then(this._selectRemind.bind(this))
				.then(this._randomNoiseWord.bind(this))
				.then(this._compose.bind(this))
	}
}

module.exports = Quiz