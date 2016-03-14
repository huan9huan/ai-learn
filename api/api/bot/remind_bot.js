'use strict';
var SlackBot = require('./slack_bot')

var RTM_EVENTS = require('slack-client').RTM_EVENTS;

class RemindBot extends SlackBot
{
	constructor(){
		super('@remindbot','xoxb-25742228035-IlIwY0MdZlK3hXOrOoVovWJz')
	}
    onPinAdded (callback) {
		console.log("pin added setup done", RTM_EVENTS.PIN_ADDED)
		this.rtm.on(RTM_EVENTS.PIN_ADDED, function (msg) {
			console.log("debug: pin added", msg)
			var item = msg.item
			if(item.type === 'message') {
				var pinMsg = item.message
				callback(pinMsg.text, item.channel)
			}
		})
	}
}

module.exports = RemindBot;