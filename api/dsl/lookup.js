var dictionary = require('../store').dictionary
var crawl = require('./crawl')

function lookup(word) {
	return dictionary.fetch(word).catch((err) => {
		return crawl(word).then(dictionary.cache.bind(this,word))
	})
}

module.exports = lookup;