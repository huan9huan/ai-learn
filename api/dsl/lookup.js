var dictionary = require('../store').dictionary
var crawl = require('./crawl')
var translate = require('./youdao')

function lookup(word) {
	return dictionary.fetch(word).catch((err) => {
		return Promise.all([translate(word),crawl(word)]).then((a) => {
			return a[0].concat(a[1])
		})
		.then(dictionary.cache.bind(this,word))
	})
}

module.exports = lookup;