var lookup = require('../../dsl/lookup')
var youdaoTranslate = require('../../dsl/youdao')
var ImpressionStore = require('../../store/impression')
var redis = require('redis')
var debug = require('debug')("api:lookup")

const db = redis.createClient()

db.on('ready',() => {
  debug("redis ready!")
})

exports.lookup = function *() {
	const word = this.params.word
	debug("lookup",word)
	var defs = yield lookup(word)
	//形成印象
	var impressionStore = new ImpressionStore(db)
	defs.map((def) => {
		impressionStore.produce(word, def)
	})
    this.body = JSON.stringify(defs);
    this.type = "application/json"
    this.status = 200;  	
}

exports.youdao = function *() {
   const word = this.params.word
   	var part = yield youdaoTranslate(word)
   	this.body = JSON.stringify(part)
    this.type = "application/json"
    this.status = 200;  	
}