'use strict';
var SlackBot = require('./slack_bot')
var ImpressionStore = require('../store/impression')
var lookup = require('../dsl/lookup')
var redis = require('redis');
var debug = require('debug')('bot')

class DictBot extends SlackBot{
	constructor(){
		super("@dictbot",'xoxb-22492878788-G7zGYQJhi6gcZ2BXQN4M8fmW')
		
		this.db = redis.createClient()
		this.db.on('ready',() => {
			this.imprStore = null;
			this.imprStore = new ImpressionStore(this.db)
		}.bind(this))

		this.onMessage(this._lookup.bind(this))
	}
	_parse(channel,text) {
	  return new Promise((resolve,reject) => {
		  if(!text || typeof text !== "string" || !channel){
		    reject("bad format")
		  }else{
		  	var key = "<@" + this.botid + ">";
	  		var idx = text.indexOf(key)
	  		if(idx == 0) { //被点名需要得出解释
			    // get the word
			    var word = text.substring(idx + key.length).trim();
			   	if(word.indexOf(":") == 0)
	      			word = word.substring(1).trim();
	      		resolve(word)
			}
		  }
	  })
	}

	_notifyStarting(channel, word) {
	  this.send(channel,">>>> begin to find the word definitions in https://en.wiktionary.org/wiki/" + word + "\" ...")
	  return word
	}
	
	_notifySummary(channel,defs) {
	  if(defs && defs.length > 0){
       this.send(channel, "<<<< end find, total defintions " + defs.length + ", list as :")
      }else {
       this.send(channel, "!!!! not found any definitions, maybe bad word or not defined in wiktionary.org")
      }
      return defs
	}

	_push_all(channel,word,defs) {
		defs.map((def) => {
          this.sendWithAttachment(channel," *[" + def.type + "]* " + def.def, def.attachments,
            (channel, msg) => {
              var i = this.imprStore.produce(word,def)   // 生产一个新的impression
              // debug("produce new imporession", i)
            })
	    })
	}

	_lookup(channel,text){
         var word = null;
	     this._parse(channel,text)
            .then((w) => {word = w; return w})
	    .then(this._notifyStarting.bind(this,channel))
	    .then(lookup)
	    .then(this._notifySummary.bind(this,channel))
	    .then(this._push_all.bind(this,channel,word))
	    .catch(debug)
	}
}

module.exports = DictBot;
