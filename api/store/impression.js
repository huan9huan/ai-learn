'use strict';

var md5 = require('js-md5')

class Impression{
	constructor(id, word, def) {
		this.id = id
		this.word = word
		this.def = def
    }
}

class ImpressionStore{
	constructor(redis){
		this.redis = redis;
	}

	produce(key, word, def) {
		var i = new Impression(md5(key), word, def)
		this.redis.hset('i',key,JSON.stringify(i))
		return i
	}
    get(key,cb) {
		this.redis.hget('i',key,(err,v) => {
			if(err || !v) {
				cb()
			}else {
				cb(JSON.parse(v))
			}
		})
	}
}
module.exports = ImpressionStore