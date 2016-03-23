'use strict';

var request = require('superagent');
var redis = require('redis');
var db = redis.createClient()
var debug = require('debug')('store')
var siteConf = require('../site.json')

function fetch(word) {
  return new Promise((resolve,reject) => {
    request.get(siteConf.domain + siteConf.part_get)
        .send({word:word})
        .end((e,r) => {
          debug(r.text)
          if(e)
            reject(e)
          var j = JSON.parse(r.text)
          if(j.code != 0 || j.result.length == 0)
            reject("not found")
          else
            resolve(j.result)
        });
    })
}
function cache(word, json) {
  request.post(siteConf.domain + siteConf.part_save)
         .send({parts: JSON.stringify(json), word: word})
         .end((e,r) => {debug(r)})
  return json
}

module.exports = {
	fetch: fetch,
  cache: cache
}