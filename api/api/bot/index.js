var DictBot = require('../../bot').DictBot
var RemindBot = require('../../bot').RemindBot
var QuizBot = require('../../bot').QuizBot

var remindBot = new RemindBot();
var dictBot = new DictBot();
var quizBot = new QuizBot();

exports.lookup = function *(){
  // dictBot.lookup()
}
exports.remind = function *(next){
}