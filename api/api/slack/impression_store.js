var Impression = require('./impression')
var md5 = require('js-md5')
function ImpressionStore (redis){
	this.redis = redis
}
ImpressionStore.prototype.produce = function(key, word, def) {
	var i = new Impression(md5(key), word, def)
	this.redis.hset('i',key,JSON.stringify(i))
	return i
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
ImpressionStore.prototype.remember = function(impression, cb) {
        impression.createdAt = new Date().getTime()
        impression.hit = 0
	this.redis.hset('rem',impression.id,JSON.stringify(impression))
        setTimeout(() => {
          impression.hit = impression.hit + 1
	  this.redis.hset('rem',impression.id,JSON.stringify(impression))
          cb(impression)}.bind(this),
         60*1000)
}
module.exports = ImpressionStore;
