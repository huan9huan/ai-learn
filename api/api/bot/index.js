require('es6-promise').polyfill();

var DictBot = require('./dict_bot')
var RemindBot = require('./remind_bot')
var ImpressionStore = require('../../store/impression')
var RemindStore = require('../../store/remind')
var crawl = require('../../dsl/crawl')
var redis = require('redis');
var debug = require('debug')('bot')

var remindBot = new RemindBot();
var dictBot = new DictBot();

dictBot.onMessage(function(channel, text) {
  crawlAndSend(channel,text)
})
remindBot.onPinAdded((text,channel) => {
  imprStore.get(text, (impression) => {
  if(impression) { // 之前生成过impr,需要被star，则记住
      var i = remindStore.remember(impression,channel);
      dictBot.send(channel,"will remind you word " + impression.word + " in " + i.timeout/1000 + " second")
  }else{
    dictBot.send(channel, "impression not found, so ignored")
  }
  });
})

var db = redis.createClient()
var imprStore;
var remindStore;

db.on('ready',function(){
  debug('redis connected!')
  imprStore = new ImpressionStore(db)
  remindStore = new RemindStore(db, (i) => {
        debug("remind recved", i)
        remindBot.send(i.channel," *" + i.word + "* " + i.def.type + " " + i.def.def, i.attachments, () => {
          debug("remind " + i.id + " done!")
        })
      })
})


function crawlAndSend(channel,text){
  if(!text || typeof text !== "string" || !channel)
    return 
  var key = "<@" + dictBot.botid + ">";
  var idx = text.indexOf(key)
  if(idx == 0) { //被点名需要得出解释
    // get the word
    var word = text.substring(idx + key.length).trim();
    if(word.indexOf(":") == 0)
      word = word.substring(1).trim()
    debug("find the word is ",word)
    dictBot.send(channel,
      "----- begin to find the word definitions in https://en.wiktionary.org/wiki/" + word + "\" ...")
    var defs; // = yield getCache(word)
    if(!defs) {
      crawl(word).then((defs) => {
        if(defs.length > 0){
          dictBot.send(channel, "---- end find, total defintions " + defs.length + ", list as :")
        }else {  
          dictBot.send(channel, "not found any definitions, maybe bad word or not defined in wiktionary.org")
        }
        var idx = 0;
        defs.map((def) => {
          dictBot.sendWithAttachment(channel," *[" + def.type + "]* " + def.def, def.attachments,
            (channel, msg) => {
              var i = imprStore.produce(msg,word,def)   // 生产一个新的impression
              debug("produce new imporession", i)
            })
        })
        resolve()
      });
    }
  }
}
exports.all = function *(){}
