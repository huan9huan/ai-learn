'use strict';
var SlackBot = require('./slack_bot')
var QuizStore = require('../store/quiz')
var Quiz = require('../dsl/quiz')
var redis = require('redis');
var debug = require('debug')('bot')

class QuizBot extends SlackBot{

	constructor(){
		super("@quizbot",'xoxb-27033639270-1DkQDPYccrfwOBFMjGevXuLq')
		
		this.db = redis.createClient()
		this.db.on('ready',() => {
			this.quizStore = null;
			this.quizStore = new QuizStore(this.db)
		}.bind(this))

		this.onMessage(this._cmd.bind(this))
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
      		return (word)
		}
	  }
	}

	_cmd(channel,text){
	  var cmd = this._parse(channel,text)
	  debug("get cmd", cmd)
	  if(!cmd){
	  	debug("no command, ignore") 
	  	return
	  }

	  if(cmd === "start") {
	  	this.send(channel,'正在产生此频道的测试集，请稍后....')
	  	return 
	  } 
	  else if(cmd == "stop") {
	  	this.send(channel,'测试结束, 得分xxx')
	  	return
	  }
	  
	  var word = cmd
	  new Quiz(word,this.db).gen().then((question) => {
	  	debug(question)
	  	this.send(channel, question.desc)
	  }).catch((err) => {
	  	debug(err)
	  	this.send(channel, err)
	  })

	}
}

module.exports = QuizBot;
