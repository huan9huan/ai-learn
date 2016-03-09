require('es6-promise').polyfill();

var debug = require('debug')('api');
var redis = require('redis');
var Slack = require('./slack').Slack
var crawlWord = require('./crawl')
var ImpressionStore = require('./impression_store')

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
function crawlAndSend(channel,text){
  if(!text || typeof text !== "string" || !channel)
    return 
  var key = "<@" + slack.botid + ">";
  var idx = text.indexOf(key)
  if(idx == 0) { //被点名需要得出解释
    // get the word
    var word = text.substring(idx + key.length).trim();
    if(word.indexOf(":") == 0)
      word = word.substring(1).trim()
    console.log("find the word is ",word)
    slack.send(channel,
      "----- begin to find the word definitions in https://en.wiktionary.org/wiki/" + word + "\" ...")
    var defs; // = yield getCache(word)
    if(!defs) {
      crawlWord(word, (defs) => {
        var idx = 0;
        defs.map((def) => {
          slack.sendWithAttachment(channel,"[" + def.type + "] " + def.def, def.attachments,
            (channel, msg) => {
              var i = imprStore.produce(msg,word,def)   // 生产一个新的impression
              console.log("produce new imporession", i)
            })
        })
        if(defs.length == 0) {
          slack.send(channel, "not found any definitions, maybe bad word or not defined in wiktionary.org")
        }
      });
      defs = defs || []
      slack.send(channel, "---- end find, total defintions count " + defs.length)
    }
  }
}
slack.onMessage(function(channel, text) {
  crawlAndSend(channel,text)
})
slack.onRawMessage((m) => {
  console.log("------ raw message",m)
})
slack.onPinAdded((text,channel) => {
  imprStore.get(text, (impression) => {
  if(impression) { // 之前生成过impr,需要被star，则记住
      imprStore.remember(impression)
      slack.send(channel,"will remind you word " + impression.word + " with this impression")
  }
  });
})

var db = redis.createClient()
var imprStore;
db.on('ready',function(){
  console.log('redis connected!')
  imprStore = new ImpressionStore(db)
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
