'use strict';
var SlackBot = require('./slack_bot')
var RemindStore = require('../store/remind')
var ImpressionStore = require('../store/impression')
var debug = require('debug')('bot')
var redis = require('redis');

var RTM_EVENTS = require('slack-client').RTM_EVENTS;

class RemindBot extends SlackBot
{
	constructor(){
		super('@remindbot','xoxb-25742228035-IlIwY0MdZlK3hXOrOoVovWJz')
		this.db = redis.createClient()
		this.db.on('ready',() => {
			this.imprStore = null;
			this.imprStore = new ImpressionStore(this.db)
		})

		this.remindStore = new RemindStore(this.db, (i) => {
	        debug("remind recved", i)
	        this.send(i.channel," *" + i.word + "* " + i.def.type + " " + i.def.def, 
	        	i.attachments, () => {
	          debug("remind " + i.id + " done!")
	        })
	    })

		this.rtm.on(RTM_EVENTS.PIN_ADDED, (msg) => {
			var item = msg.item
			if(item && item.type === 'message') {
				var pinMsg = item.message
				debug("find new pin item", item)
				this.star(item.channel,pinMsg.text)
			}
		})
		debug("setup event done - ",RTM_EVENTS.PIN_ADDED)
	 }

	 star(channel,text) {
	 	return new Promise((resolve, reject) => {
	 		this.imprStore.get(text,(i) => {
	 			if(i){
			 	  var remind = this.remindStore.remember(impression,channel);
				  this.send(channel,"OK! bot will remind you for word " + remind.word + " in " + i.timeout/1000 + " second")
				  resolve(remind)
	 			}else{
	 			   reject("no impression " + text)
	 			}
	 		})
	 	}).catch(debug)
	}
}

module.exports = RemindBot;