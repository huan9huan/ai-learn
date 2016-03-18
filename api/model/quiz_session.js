'use strict';

class QuizSession {

 constructor(questions) {
 	this.questions = questions;
 	this.createdAt = new Date().getTime()
 	this.running = 0	// 正在测试的question的位置
 	this.scores = []
 	this.status = 0
 }
}

module.exports = QuizSession;