'use strict';
var debug = require('debug')('store')

class QuizStore {

	constructor(redis){
		this.redis = redis;
	}
	toArray(results) {
		var items = []
		for(var i in results){
			items.push(JSON.parse(results[i]))
		}
		return items
	}

	//得到单词的所有释义
	selectImpression(word) {
		return new Promise((resolve,reject) => {
			this.redis.hgetall('i',(err,results) => {
				if(err) {
					reject(err)
				}else {
					var is = this.toArray(results).filter((impression) => {return impression.word === word})
					resolve(is)
				}
			})
		})
	}
	selectReminds(word) {
		return new Promise((resolve,reject) => {
			this.redis.hgetall('i',(err,results) => {
				if(err) {
					reject(err)
				}else{
					resolve(this.toArray(results)
						.filter((im) =>{return im.word === word}))
				}
			})
		})
	}

	selectNoiseWord(word) {
		return new Promise((resolve,reject) => {
			this.redis.hgetall('i',(err,results) => {
				if(err) {
					reject(err)
				}else {
					var noises = this.toArray(results)
							.map((result) => {return result.word})
							.reduce((set,cur) => {
								set.indexOf(cur) < 0 ? set.push(cur) : set
								return set
							},[])
							.filter((noise) => {return noise !== word})
					resolve(noises)
				}
			})
		})
	}
}
module.exports = QuizStore;