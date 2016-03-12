var fetch = require('isomorphic-fetch');
var FormData = require('isomorphic-form-data');

var RTM_EVENTS = require('slack-client').RTM_EVENTS;
function DictBot(){
	var RtmClient = require('slack-client').RtmClient;
	var token = process.env.SLACK_API_TOKEN || 'xoxb-22492878788-G7zGYQJhi6gcZ2BXQN4M8fmW';
	this.rtm = new RtmClient(token, {logLevel: 'debug'});
	console.log("rtm is starting...");
	this.rtm.start();
	this.botid = ""
	var CLIENT_EVENTS = require('slack-client').CLIENT_EVENTS;
	this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (json) {
	  if(json.ok) {
	    console.log("rtm is authenticated ok, my id is %s", json.self.id);
	    this.botid = json.self.id
	  }
	}.bind(this));

}
DictBot.prototype.onMessage = function(callback) {
	this.rtm.on(RTM_EVENTS.MESSAGE, function (message) {
		if(message.subtype === 'pin_added') {
			console.log('>>>> debugging: pin added',message.item)
			this.onPinAdded(message.item)
		}else{
			callback(message.channel, message.text);
		}
	})
}
// Slack.prototype.onRawMessage = function(callback) {
// 	this.rtm.on('raw_message', function (message) {
// 		if(message.type === 'pin_added') {
// 			console.log('<<<<  debugging: pin added',message.item)
// 			this.onPinAdded(message.item)
// 		}
// 		callback(message);
// 	})
// }
DictBot.prototype.send = function(channel, msg, cb) {
	this.rtm.sendMessage(msg, channel)
	if(cb) {
		cb(channel, msg)
	}
}
DictBot.prototype.sendWithAttachment = function(channel, msg, attachments, cb) {
	if(!attachments || attachments.length == 0){
		return this.send(channel, msg, cb);
	}
	var form = new FormData();
	form.append('token', 'xoxp-19275283155-19274326341-26411394562-d973f90218')
	form.append('channel', channel)
	form.append('text', msg)
	// var text = attachments.reduce((accu,cur) => {return accu += cur+"\n\n"}, "")
	if(attachments && attachments.length > 0) {
		var arr = attachments.map((a) => {return {text:a}})
		form.append('attachments',JSON.stringify(arr))
		console.log("with attachment ",arr)
	}

	fetch("https://slack.com/api/chat.postMessage", {method: 'POST', body: form})
	.then(() =>{
		if(cb){
			cb(channel, msg)
		}
	})
}

module.exports = DictBot;