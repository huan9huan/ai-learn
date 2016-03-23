'use strict';
var SlackBot = require('./slack_bot')
var ImpressionStore = require('../store/impression')
var lookup = require('../dsl/lookup')
var redis = require('redis');
var debug = require('debug')('bot')
var toImpressionDesc = require('../dsl/utils').toImpressionDesc

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

	_notifyStart(channel, word) {
	  this.send(channel,">>>> begin to find the word definitions in wiktionary and youdao " + word + "\" ...")
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

	_saveToImpressions(channel,word,defs) {
		defs.map((def) => {
          this.sendWithAttachment(channel,toImpressionDesc(def.type,def.def), def.attachments,
            (channel, msg) => {
              var i = this.imprStore.produce(word,def)   // 生产一个新的impression
              debug("produce new imporession", i)
            })
	    })
	}

	_lookup(channel,text){
        var word = this._parse(channel,text)
        if(!word) return ;
	    this._notifyStart(channel,word)
	    lookup(word)
	    .then(this._notifySummary.bind(this,channel))
	    .then(this._saveToImpressions.bind(this,channel,word))
	    .catch(debug)
	}
}

module.exports = DictBot;
