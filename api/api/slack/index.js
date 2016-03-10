require('es6-promise').polyfill();

var DictBot = require('./dict_bot')
var RemindBot = require('./remind_bot')
var ImpressionStore = require('./impression_store')
var crawlWord = require('../wiki/crawl')
var redis = require('redis');

var remindBot = new RemindBot();
var doctBot = new DictBot();

doctBot.onMessage(function(channel, text) {
  crawlAndSend(channel,text)
})
doctBot.onPinAdded((text,channel) => {
  imprStore.get(text, (impression) => {
  if(impression) { // 之前生成过impr,需要被star，则记住
      imprStore.remember(impression)
      doctBot.send(channel,"will remind you word " + impression.word + " with this impression")
  }else{
    doctBot.send(channel, "impression not found, so ignored")
  }
  });
})

var db = redis.createClient()
var imprStore;
db.on('ready',function(){
  console.log('redis connected!')
  imprStore = new ImpressionStore(db)
})


function crawlAndSend(channel,text){
  if(!text || typeof text !== "string" || !channel)
    return 
  var key = "<@" + doctBot.botid + ">";
  var idx = text.indexOf(key)
  if(idx == 0) { //被点名需要得出解释
    // get the word
    var word = text.substring(idx + key.length).trim();
    if(word.indexOf(":") == 0)
      word = word.substring(1).trim()
    console.log("find the word is ",word)
    doctBot.send(channel,
      "----- begin to find the word definitions in https://en.wiktionary.org/wiki/" + word + "\" ...")
    var defs; // = yield getCache(word)
    if(!defs) {
      crawlWord(word, (defs) => {
        var idx = 0;
        defs.map((def) => {
          doctBot.sendWithAttachment(channel,"[" + def.type + "] " + def.def, def.attachments,
            (channel, msg) => {
              var i = imprStore.produce(msg,word,def)   // 生产一个新的impression
              console.log("produce new imporession", i)
            })
        })
        if(defs.length == 0) {
          doctBot.send(channel, "not found any definitions, maybe bad word or not defined in wiktionary.org")
        }
      });
      defs = defs || []
      doctBot.send(channel, "---- end find, total defintions count " + defs.length)
    }
  }
}
exports.all = function *(){}