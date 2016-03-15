var Config = {
    "token": "xoxb-25742228035-IlIwY0MdZlK3hXOrOoVovWJz",
    "admin": ["U07225LMPB", "U5KJJH0MPL"],
    "quizLimit": 45,
    "channel": "general",
    "databases": {
	    "questions": "./data/questions.json", // Path to the database (json file) containing the questions
	    "scores": "./data/scores.json" // Path to the database (json file) containing scores
	}
};
var QuizBot = require('slack-quizbot');
var quizbot = new QuizBot(Config);

quizbot.initialize();
