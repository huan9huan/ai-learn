'use strict'
var fetch = require('isomorphic-fetch');
var FormData = require('isomorphic-form-data');
var RTM_EVENTS = require('slack-client').RTM_EVENTS;
var RtmClient = require('slack-client').RtmClient;
var CLIENT_EVENTS = require('slack-client').CLIENT_EVENTS;
var debug = require('debug')('bot')

class SlackBot{

	constructor(name, token){
		this.name = name
                this.token = token
		this.rtm = new RtmClient(token, {logLevel: 'info'});
		debug(name + " is starting...");
		this.rtm.start();
		this.botid = ""
		this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (json) {
		  if(json.ok) {
		    debug(name + " is authenticated ok, my id is %s", json.self.id);
		    this.botid = json.self.id
		  }
		}.bind(this));
	}

	onMessage(callback) {
		this.rtm.on(RTM_EVENTS.MESSAGE, function (message) {
			if(message.subtype === 'pin_added' && this.onPinAdd) {
				debug('>>>> debugging: pin added',message.item)
				this.onPinAdded(message.item)
			}else{
				callback(message.channel, message.text);
			}
		})
	}
	send(channel, msg, cb) {
		this.rtm.sendMessage(msg, channel)
		if(cb) {
			cb(channel, msg)
		}
	}
	_parse(channel,text) {
	  if(!text || typeof text !== "string" || !channel){
	    return
	  }else{
	  	var key = "<@" + this.botid + ">";
  		var idx = text.indexOf(key)
  		if(idx == 0) { //被点名需要得出解释
		    // get the word
		    var word = text.substring(idx + key.length).trim();
		   	if(word.indexOf(":") == 0)
      			word = word.substring(1).trim();
      		return word
		}
	  }
	}
	sendWithAttachment(channel, msg, attachments, cb) {
		if(!attachments || attachments.length == 0){
			return this.send(channel, msg, cb);
		}
		var form = new FormData();
		form.append('token', this.token)
		form.append('channel', channel)
		form.append('text', msg)
		form.append('as_user', 'false')
		form.append('username', this.name)
		if(attachments && attachments.length > 0) {
			var arr = attachments.map((a) => {return {text:a}})
			form.append('attachments',JSON.stringify(arr))
			// debug("with attachment ",arr)
		}

		fetch("https://slack.com/api/chat.postMessage", {method: 'POST', body: form})
		.then(() =>{
			if(cb){
				cb(channel, msg)
			}
		})
	}
}
module.exports = SlackBot;
