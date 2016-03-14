var redis = require('redis');
var db = redis.createClient()

function fetch(word) {
  return new Promise((resolve,reject) => {
    db.hget("wiki",word,(err,v) => {
      if(err){
        reject(err)
      }else {
        resolve(v)
      }
    })
  }).then((v) => {
      console.log("get cache for word %s",word)
      return JSON.parse(v)
    }).catch((err) => {
      console.log(err)
    })
}
function cache(word, json) {
  db.hset('wiki', word, JSON.stringify(json))
}

module.exports = {
	fetch: fetch,
  cache: cache
}