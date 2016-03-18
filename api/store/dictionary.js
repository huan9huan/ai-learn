var redis = require('redis');
var db = redis.createClient()
var debug = require('debug')('store')

function fetch(word) {
  return new Promise((resolve,reject) => {
    db.hget("wiki",word,(err,v) => {
      if(err || !v){
        reject(err || "not existed")
      } else {
        resolve(v)
      }
    })
  }).then((v) => {
      debug("got cache for word %s",word)
      return JSON.parse(v)
    })
}
function cache(word, json) {
  db.hset('wiki', word, JSON.stringify(json))
  debug("cache word ",word)
  return json
}

module.exports = {
	fetch: fetch,
  cache: cache
}