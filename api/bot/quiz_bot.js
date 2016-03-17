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

	_selectQuizWords() {
		return new QuizStore(this.db).selectRemindWords()
	}

	_generateQuiz(words) {
		var db = this.db
		return Promise.all(words.map(w => {
			return new Promise((resolve,reject) => {
				new Quiz(w,db).gen().then(q => {
					resolve(q)
				}).catch(err => {
					debug(err)
				})
			})
		}))
	}

	_storeQuiz(questions) {
		// debug("quiz questions: ", questions)
		return new QuizStore(this.db).saveQuiz(questions)
	}
	_isValidChoose(choose) {
		const valids = ["A","B","C","D","E","F"]
		return valids.filter((v) => {return choose === v}).length > 0
	}

	_cmd(channel,text){
	  var cmd = this._parse(channel,text)
	  debug("get cmd", cmd)

	  if(cmd === "start") {
	  	this.send(channel,'正在产生此频道的测试集....')
	  	this._selectQuizWords().then(this._generateQuiz.bind(this)).then(this._storeQuiz.bind(this))
	  	.then((quizSession) => {
	  		this.send(channel,"产生完毕，题目个数" + quizSession.questions.length 
	  			+ ",建议" + quizSession.questions.length + "分钟内完成.")
	  		// 发送一个题目
	  		var question = quizSession.questions[0]
	  		debug("first question", question)
	  		this.send(channel, question.desc)
	  		quizSession.running = 0
	  		new QuizStore(this.db).update(quizSession)
	  	})
	  } 
	  else if(cmd == "stop") {
	  	this.send(channel,'测试结束, 得分xxx')
	  	return
	  }

	  new QuizStore(this.db).getQuizSession().then(this._dealInput.bind(this,channel,text))
	}

	_dealInput(channel,cmd,quizSession){
	  debug("quiz input is ",cmd,"quiz session status ",quizSession.status)
	  if(quizSession && quizSession.status === 0) {
	  	// 正在进行quiz
	  	var choose = cmd.toUpperCase()
	  	if(!this._isValidChoose(choose)) {
	  		this.send(channel,"无效的输入 *" + choose +"*，请输入答案编号，或者输入 *stop* 退出")
	  		return
	  	}
	  	var q = quizSession.questions[quizSession.running]
	  	var internal = q.options.filter((o) => {return o.idx === choose})[0]
	  	if(internal && internal.correct){
	  		quizSession.scores.push(1)
	  	}else{
	  		quizSession.scores.push(0)
	  	}
	  	this.send(channel,'答案' + (internal.correct ? "正确" : "错误"))
	  	debug(quizSession)
	  	quizSession.running = quizSession.running + 1
	  	new QuizStore(this.db).update(quizSession)
	  	debug("updated quiz running index",quizSession.running)
	  	if(quizSession.running >= quizSession.questions.length) {
	  		quizSession.status = -1
	  		new QuizStore(this.db).update(quizSession)
	  		var score = quizSession.scores.reduce((accu,cur) => {return accu + cur},0)
	  		this.send(channel,'测试结束，得分:' + score + "/" + quizSession.scores.length )	
	  		return ;  		
	  	}else{
	  		//下一题
	  		this.send(channel, quizSession.questions[quizSession.running].desc)
	  		return ;		
	  	}
	  }

	  
	  // var word = cmd
	  // new Quiz(word,this.db).gen().then((question) => {
	  // 	debug(question)
	  // 	this.send(channel, question.desc)
	  // }).catch((err) => {
	  // 	debug(err)
	  // 	this.send(channel, err)
	  // })

	}
}

module.exports = QuizBot;
