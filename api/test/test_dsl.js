#!/usr/bin/env node
var crawl = require('../dsl/crawl')

var caches = {}
var debug = require('debug')('dsl');

function run(word) {
	return  fetch(word).catch((err) => {
		return crawl(word).then(cache.bind(this,word))
	})
    .then(format)
	.then(send)
	.catch(debug)
}
function printCache(){
	return new Promise((res,rej) => {
		 console.log(caches)
		 res()
	 })
}
function fetch(word) {
	return new Promise((resolve, reject) => {
		debug(">>>> try to fetch word from cache ", word)
		if(caches.word){
			debug("<<<< fetch ok", caches.word)
			resolve(caches.word)
		}else{
			debug("!!!! fetch fail !!!!")
			reject("not found",word)
		}
	})
}
function cache(word,json) {
	return new Promise((resolve, reject) => {
		debug(">>>> try to cache word definitions json into cache", word, json)
		caches.word = json
		debug("<<<< cache word done",word, json)
		resolve(json)
		// return json
	})
}
function format(json) {
	return new Promise((resolve, reject) => {
		debug(">>>> format definitions json into slack message", json)
	    var msg = {msg:"slack", text: json.type}
		debug("<<<< format slack message done", msg)
		resolve(msg)
	})	
}
function send(msg) {
	return new Promise((resolve, reject) => {
		debug(">>>> sending slack message", msg)
		debug("<<<< send done", msg)
		resolve(msg)
	})	
}
// var p = 
run("test").then(() => {debug("\n\nsecond session ----> "); run("test"); })
// p.then(() => {
// 	console.log("\n\n with cache \n\n");
// 	run("tester");
// })
// console.log("\n\n with cache \n\n")
// run("tester")