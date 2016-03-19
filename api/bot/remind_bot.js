'use strict';
var SlackBot = require('./slack_bot')
var RemindStore = require('../store/remind')
var Remind = require('../dsl/remind')
var debug = require('debug')('bot')
var redis = require('redis');
var md5 = require('js-md5')

var RTM_EVENTS = require('slack-client').RTM_EVENTS;

class RemindBot extends SlackBot
{
	constructor(){
		super('@remindbot','xoxb-25742228035-IlIwY0MdZlK3hXOrOoVovWJz')
		this.db = redis.createClient()
		this.reminder = null
		this.db.on('ready',() => {
			this.reminder = new Remind(this.db);
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
	 	debug(text)
 		var impressionId = md5(text)
 		debug(impressionId)
 		this.reminder.remind(impressionId,channel)
 		.then((i) => {
 			this.send(channel,"OK! this impression is starred for word " + i.word)
 		})
 		.catch(() => {
 			this.send(channel,"no impression defined")
 		})
	}
}

module.exports = RemindBot;
