var request = require('superagent');
var debug = require('debug')('test:rails')

var word = 'test'
var url = 'http://localhost:4000/lookup/' + word
var to = 'http://localhost:3000/api/part/create'

request.get(url).send().end((err,resp) => {
	request
		.post(to)
		.send({parts: resp.text, word: word})
		.end((e,r) => {debug(r)})
})