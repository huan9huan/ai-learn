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

exports.Slack = Slack;