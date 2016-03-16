'use strict'
var fetch = require('isomorphic-fetch');
var FormData = require('isomorphic-form-data');

var channel = "C0K86SX5E";
var token = 'xoxb-22492878788-G7zGYQJhi6gcZ2BXQN4M8fmW'

var form = new FormData();
// form.append('token', 'xoxp-19275283155-19274326341-26411394562-d973f90218')
form.append('token', token)
form.append('channel', channel)
form.append('as_user', 'false')
form.append('username', "@dictbot")

form.append('text', "test direct im!")
fetch("https://slack.com/api/chat.postMessage", {method: 'POST', body: form})
.then(() =>{
	console.log("send done")
})
