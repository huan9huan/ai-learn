'use strict';

var debug = require('debug')('quiz');
var QuizStore = require('../store/quiz')
var _ = require('underscore')
var md5 = require('js-md5')

class QuizBuilder {
	constructor(word) {
		this.word = word
	}
	setImpressions(impressions) {
		this.impressions = impressions;
	}
	setRemind(reminds) {
		if(reminds && reminds.length > 0) {
		  this.reminds = reminds;
		  this.majar = this.reminds[0]
		}else{
			this.majar = this.impressions[0]
		}
	}
	setNoiseWords(noises) {
		this.noises = noises
	}
	setFail(reason) {
		this.fail = reason
	}
	buildDesc() {
		var idxSeq = ['A','B','C','D','E','F'];
		var i = 0;
		this.options = _.shuffle(this.noises.concat([this.word]))
				.map((w) => {return {idx:idxSeq[i++], word: w, correct:this.word === w}});
		var optionDesc = this.options.reduce((accu,option) => {
			return accu = accu + option.idx + ". " + option.word + " "},""
		)
		const template = "Which word is most closed? \n\"_$def$_\"\n*$options$*"
		this.desc = template.replace("$def$",this.majar.def.def).replace("$options$",optionDesc)
		return this.desc
	}
	build() {
		if(this.fail)
			throw new Error(this.fail)
		this.buildDesc()
		const id = md5(this.desc)
		return new Question(id, this.word, this.desc, this.options, this.noises)
	}
}

class Question {
	constructor(id, word, desc, options, noises) {
		this.id = id
		this.word = word
		this.desc = desc
		this.options = options
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
					noises = _.sample(noises,Math.min(noises.length, 3))
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