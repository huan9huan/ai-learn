require('es6-promise').polyfill();
var fetch = require('isomorphic-fetch');
var $ = require('cheerio');
var debug = require('debug')('api');
var parse = require('co-body');
var redis = require('redis');
var Slack = require('./slack').Slack

var slack = new Slack();

function crawlWord(word,resolve) {
  var baseURL = 'http://en.wiktionary.org';
  var url = baseURL + '/w/api.php?action=parse&format=json&prop=text|revid|displaytitle&page=' + word;  
  console.log("debugging: try to visit url",url)
  fetch(url).then((resp) => {
        // console.log("crawl " + word + " from wiktionary.org done, resp :",resp)  
        return resp.json();
      },(e) => {
        console.log(e)
        resolve([])
      }).then((json) => {
        if(json.parse){
          var html = json.parse.text['*'];
          var root = $("#English",$(html)).parent().nextAll();//直接抓取english节点
          // find the part of speech in wikipedia.org
          var types = ["Noun","Verb","Pronoun","Interjection", "Adjective", 
            "Adverb", "Preposition", "Conjunction", "Interjection", "Determiner"];
          var all = []
          types.forEach(function(type){
              var defs = definitions(root,type);
              defs = defs.map((d) => {return "[" + type + "] : " + d})
              all = all.concat(defs)
          });
          resolve(all)
          return all
        }else{
          resolve([])
          return all
        }
      },
      (e) => {
        console.log('word ' + word + " fail to parse the data");
        resolve([])
        return []
      });
}

function* getCache(word) {
 return yield new Promise((resolve,reject) => {
    db.hget("wiki",word,(err,v) => {
      if(err){
        reject(err)
      }else {
        resolve(v)
      }
    })
  }).then((v) => {
      console.log("get cache for word %s",word)
      return JSON.parse(v)
    }).catch((err) => {
      console.log(err)
    }) 
}

slack.onMessage(function(channel, text) {
  console.log("recv new message ",text);
  var key = "<@" + slack.botid + ">";
  var idx = text.indexOf(key)
  if(idx == 0) {
    // get the word
    var word = text.substring(idx + key.length).trim();
    console.log("find the word is ",word)
    slack.send(channel, 
      "finding the word definitions in https://en.wiktionary.org/wiki/" + word + " for word \"" + word + "\" ...")
    var defs; // = yield getCache(word)
    if(!defs) {
      crawlWord(word, (defs) => {
        var idx = 1;
        defs.map(function  (def) {
          slack.send(channel,"No." + idx + "\t" + def)
          idx += 1
        }) 
        if(defs.length == 0) {
          slack.send(channel, "not found any definitions, maybe bad word or not defined in wiktionary.org")
        }
      });
    }
  }
})

var db = redis.createClient()
db.on('ready',function(){
  console.log('redis connected!')
})

function definitions(root,type){
	var typeElements = $("#" + type,root);
	var arr = [];
	var defs = typeElements.parent().nextAll("ol").first().children("li");
	// console.log("defs size",defs.length);
	defs.map(function(i,e){
		// arr.push($(e).html());
		arr.push($(e).text());
	});
	return arr
}


exports.all = function *() {
  var word = this.params.word;
  if(!word || word.length == 0) {
  	 var body = yield parse(this);
  	 word = body.text
  }
  var parts = yield getCache(word) 

  if(!parts) {
    var now = new Date().getTime()
    yield new Promise((resolve,reject) => {
      console.log("start to crawl in yield", word)
      crawlWord(word,(results) => {
        parts = results;
        resolve(results)
      })
    })
    db.hset("wiki",word,JSON.stringify(parts))
    console.log("cache word %s into cache",word)
  }
  
  if(parts.length == 0) {
	  this.status = 404;
  }else{
	  this.body = JSON.stringify(parts);
    this.type = "application/json"
	  this.status = 200;
  }
}
