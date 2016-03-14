'use strict';
var SlackBot = require('./slack_bot')

class DictBot extends SlackBot{
	constructor(){
		super("@dictbot",'xoxb-22492878788-G7zGYQJhi6gcZ2BXQN4M8fmW')
	}
}

module.exports = DictBot;
