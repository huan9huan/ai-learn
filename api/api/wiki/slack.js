var fetch = require('isomorphic-fetch');
var FormData = require('isomorphic-form-data');

var RTM_EVENTS = require('slack-client').RTM_EVENTS;
function Slack(){
	var RtmClient = require('slack-client').RtmClient;
	var token = process.env.SLACK_API_TOKEN || 'xoxb-22492878788-G7zGYQJhi6gcZ2BXQN4M8fmW';
	this.rtm = new RtmClient(token, {logLevel: 'info'});
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
Slack.prototype.onMessage = function(callback) {
	this.rtm.on(RTM_EVENTS.MESSAGE, function (message) {
		callback(message.channel, message.text);
	})
}
Slack.prototype.send = function(channel, msg) {
	this.rtm.sendMessage(msg, channel)
}
Slack.prototype.sendWithAttachment = function(channel, msg, attachments,cb) {
	var form = new FormData();
	form.append('token', 'xoxp-19275283155-19274326341-24799077361-557d4ccea9')
	form.append('channel', channel)
	form.append('text', msg)
	// var text = attachments.reduce((accu,cur) => {return accu += cur+"\n\n"}, "")
	if(attachments && attachments.length > 0) {
		var arr = attachments.map((a) => {return {text:a}})
		form.append('attachments',JSON.stringify(arr))
		console.log("with attachment ",arr)
	}

	fetch("https://slack.com/api/chat.postMessage", {method: 'POST', body: form}).then(cb)
}

exports.Slack = Slack;