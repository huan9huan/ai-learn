require('es6-promise').polyfill();

var debug = require('debug')('api');
var redis = require('redis');
var Slack = require('./slack').Slack
var crawlWord = require('./crawl');

var slack = new Slack();

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

slack.onMessage(function(channel, text) {
  // console.log("in channel %s recv new message ",channel,text );
  var key = "<@" + slack.botid + ">";
  var idx = text.indexOf(key)
  if(idx == 0) {
    // get the word
    var word = text.substring(idx + key.length).trim();
    console.log("find the word is ",word)
    slack.send(channel,
      "----- begin to find the word definitions in https://en.wiktionary.org/wiki/" + word + "\" ...")
    var defs; // = yield getCache(word)
    if(!defs) {
      crawlWord(word, (defs) => {
        var idx = 0;
        defs.map((def) => {
          slack.sendWithAttachment(channel,"[" + def.type + "] " + def.def, def.attachments,
            () => {idx += 1})
        })
        if(defs.length == 0) {
          slack.send(channel, "not found any definitions, maybe bad word or not defined in wiktionary.org")
        }
      });
      defs = defs || []
      slack.send(channel, "---- end find, total defintions count " + defs.length)
    }
  }
})

var db = redis.createClient()
db.on('ready',function(){
  console.log('redis connected!')
})

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
