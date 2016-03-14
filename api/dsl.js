#!/usr/bin/env node
// require('es6-promise').polyfill();

var caches = {}

function run(word) {
	return  fetch(word).catch((err) => {
		return crawl(word).then(parse).then(cache.bind(this,word))
	})
    .then(format)
	.then(send)
	.then(printCache)
}
function printCache(){
	return new Promise((res,rej) => {
		 console.log(caches)
		 res()
	 })
}
function fetch(word) {
	return new Promise((resolve, reject) => {
		console.log(">>>> try to fetch word from cache ", word)
		if(caches.word){
			console.log("<<<< fetch ok", caches.word)
			resolve(caches.word)
		}else{
			console.log("!!!! fetch fail !!!!")
			reject("not found",word)
		}
	})
}
function crawl(word) {
	return new Promise((resolve, reject) => {
		console.log(">>>> try to crawl word from internet ", word)
		var html = "<div></div>"
		console.log("<<<< crawl word done ", html)
		resolve(html)
	})	
}
function parse(html) {
	return new Promise((resolve, reject) => {
		console.log(">>>> parse html to word definitions json",html)
		var json = {type:"Noun"}
		console.log("<<<< parse done",json)
		resolve(json)
	})	
}
function cache(word,json) {
	return new Promise((resolve, reject) => {
		console.log(">>>> try to cache word definitions json into cache", word, json)
		caches.word = json
		console.log("<<<< cache word done",word, json)
		resolve(json)
		// return json
	})
}
function format(json) {
	return new Promise((resolve, reject) => {
		console.log(">>>> format definitions json into slack message", json)
	    var msg = {msg:"slack", text: json.type}
		console.log("<<<< format slack message done", msg)
		resolve(msg)
	})	
}
function send(msg) {
	return new Promise((resolve, reject) => {
		console.log(">>>> sending slack message", msg)
		console.log("<<<< send done", msg)
		resolve(msg)
	})	
}
// var p = 
run("tester").then(() => {console.log("\n\nsecond session ----> "); run("tester"); })
// p.then(() => {
// 	console.log("\n\n with cache \n\n");
// 	run("tester");
// })
// console.log("\n\n with cache \n\n")
// run("tester")