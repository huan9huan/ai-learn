require('es6-promise').polyfill();

var debug = require('debug')('api');
var crawlWord = require('./crawl')

function* getCache(word) {
 return yield new Promise((resolve,reject) => {
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

exports.all = function *() {
  var word = this.params.word;
  var format = this.params.format || "text"
  if(!word || word.length == 0) {
  	 var body = yield parse(this);
  	 word = body.text
  }
  var parts = yield getCache(word) 

  if(!parts) {
    var now = new Date().getTime()
    yield new Promise((resolve,reject) => {
      console.log("start to crawl in yield", word)
      crawlWord(word,(results) => {
        parts = results;
        resolve(results)
      }, format)
    })
    // db.hset("wiki",word,JSON.stringify(parts))
    console.log("cache word %s into cache",word)
  }
  
  if(parts.length == 0) {
	  this.status = 404;
  }else{
	  this.body = JSON.stringify(parts);
    this.type = "application/json"
	  this.status = 200;
  }
}
