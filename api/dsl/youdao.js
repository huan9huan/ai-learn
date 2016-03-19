'use strict';

var request = require('superagent');
var Part = require('../model/part')
var md5 = require('js-md5')
var debug = require('debug')('dsl:youdao')
var toTranslationImpressionDesc = require('./utils').toTranslationImpressionDesc

function youdaoTranslate(word) {
	return new Promise((resolve, reject) => {
		var url = 'http://fanyi.youdao.com/openapi.do'
		request.get(url)
		.set('Accept', 'application/json')
		.query({
			key: '329197656',
			keyfrom: 'mytionary',
			type: 'data',
			doctype: 'json',
			version: '1.1',
			q: word
		})
		.send().end((err,resp) => {
	        var json = JSON.parse(resp.text);
	        debug(json)
	        var translations = json.translation.map((t) => {
	        	var desc = toTranslationImpressionDesc(word,t)
	        	return new Part(md5(desc),"yd_trans",desc) 
	        })
	        debug(translations)
	        resolve(translations)
	      })
	})
}

module.exports = youdaoTranslate