'use strict';

class Question {
	constructor(id, word, desc, options, noises) {
		this.id = id
		this.word = word
		this.desc = desc
		this.options = options
		this.noises = noises
	}
}

module.exports = Question