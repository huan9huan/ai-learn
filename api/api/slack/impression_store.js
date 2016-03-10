var Impression = require('./impression')
function ImpressionStore (redis){
	this.redis = redis
}
ImpressionStore.prototype.produce = function(key, word, def) {
	this.redis.hset('i',key,JSON.stringify(new Impression(key, word, def)))
}
ImpressionStore.prototype.get = function(key,cb) {
	this.redis.hget('i',key,(err,v) => {
		if(err || !v) {
			cb()
		}else {
			cb(JSON.parse(v))
		}
	})
}
ImpressionStore.prototype.remember = function(impression) {
	this.redis.hset('rem',impression.id,JSON.stringify(impression))
}
module.exports = ImpressionStore;