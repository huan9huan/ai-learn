require('es6-promise').polyfill();

var debug = require('debug')('api');
var crawl = require('../../dsl/crawl')
var lookup = require('../../dsl/lookup')
var fetch = require('../../store/dictionary').fetch
var put = require('../../store/dictionary').cache

exports.get = function *(){
  var word = this.params.word;
  var parts = yield lookup(word)
  this.body = JSON.stringify(parts);
  this.type = "application/json"
  this.status = 200;
}

exports.all = function *() {
  var word = this.params.word;
  var format = this.params.format || "text"
  var parts = yield fetch(word)
  if(!parts) {
    var now = new Date().getTime()
    parts = yield crawl(word).then((results) => {
        return results;
    })
    put(word,JSON.stringify(parts))
  }
  
  if(parts.length == 0) {
	  this.status = 404;
  }else{
	  this.body = JSON.stringify(parts);
    this.type = "application/json"
	  this.status = 200;
  }
}
