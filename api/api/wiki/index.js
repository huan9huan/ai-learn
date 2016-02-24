require('es6-promise').polyfill();
var fetch = require('isomorphic-fetch');
var $ = require('cheerio');
var debug = require('debug')('api');
var parse = require('co-body');
var redis = require('redis');

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
  var text = ""
  var cache;
  yield new Promise((resolve,reject) => {
    db.hget("wiki",word,(err,v) => {
      if(err){
        reject(err)
      }else {
        resolve(v)
      }
    })
  }).then((v) => {
        console.log("get cache for word %s",word)
      cache = v;
    }).catch((err) => {
      console.log(err)
    })
    // .then(console.log)
    // .catch(console.log)
  // })
  if(cache){
    text = cache;
    console.log("fetch from cache, word=%s",word)
  }
  else {
    var baseURL = 'http://en.wiktionary.org';
    var url = baseURL + '/w/api.php?action=parse&format=json&prop=text|revid|displaytitle&page=' + word;
    var now = new Date().getTime()
    yield fetch(url).then((resp) =>{
      console.log("crawl " + word + " from wiktionary.org done, time used " + (new Date().getTime() - now) + "ms")  
        return resp.json();
      }).then((json) => {
        if(json.parse){
          var html = json.parse.text['*'];
          var root = $("#English",$(html)).parent().nextAll();//直接抓取english节点
          var types = ["Noun","Verb","Pronoun","Interjection"];
          var all = []
          types.forEach(function(type){
            var defs = definitions(root,type);
              all = all.concat(defs)
          });
          return all
        }
      },
      (e) => {
        console.log('word ' + word + " fail to parse the data");
      })
      .then((all) => {
        all.map((a) => {text += a})
      }, (e) => {});

      db.hset("wiki",word,text)
      console.log("cache word %s into cache",word)
  }
  
  if(text.length == 0) {
	  this.status = 404;
  }else{
	  this.body = JSON.stringify({response_type:'in_channel',text:text});
    this.type = "application/json"
	  this.status = 200;
  }
}
