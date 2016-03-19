var request = require('superagent');

function run (word) {
	var url = 'http://fanyi.youdao.com/openapi.do'
	request.get(url)
	.set('Accept', 'application/json')
	.query({
		key: '329197656',
		keyfrom: 'mytionary',
		type: 'data',
		doctype: 'json',
		version: '1.1',
		q: word
	})
	.send()
	.end((err,res) => {
		console.log(res.text)
	})
}

function run1(){
	var url ="http://fanyi.youdao.com/openapi.do?keyfrom=mytionary&key=329197656&type=data&doctype=json&version=1.1&q=test"
	request.get(url)
	.set('Accept', 'application/json')
	.end((err,resp) => {console.log(resp.text)})
}
run("test")