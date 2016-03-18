var fetch = require('isomorphic-fetch');
var $ = require('cheerio');
var info = require('debug')('dsl');
var err = require('debug')('err');
var md5 = require('js-md5')
var Part = require('../model/part')
var toImpressionDesc = require('./utils').toImpressionDesc

function crawl(word) {
	return new Promise((resolve, reject) => {
	  var baseURL = 'http://en.wiktionary.org';
	  var url = baseURL + '/w/api.php?action=parse&format=json&prop=text|revid|displaytitle&page=' + word;  
	  info("try to crawl word from internet " +  word+ " visit url" + url)
	  fetch(url).then((resp) => {
	        return resp.json();
	      },(e) => {
	        err(e)
	        resolve([])
	      }).then((json) => {
	        if(json.parse && json.parse.text){
	          var html = json.parse.text['*'];
	          var root = $("#English",$(html)).parent().nextAll();//直接抓取english节点
	          // find the part of speech in wikipedia.org
	          var types = ["Noun", "Proper_noun","Verb","Pronoun","Interjection", "Adjective", 
	            "Adverb", "Preposition", "Conjunction", "Interjection", "Determiner"];
	          var all = []
	          types.forEach(function(type){
	              var defs = definitions(root,type,"text");
	              var parts = defs.map((d) => {
	                // console.log("parse text ",d)
	                var desc = extractDefs(d);
	                return new Part(md5(toImpressionDesc(type, desc)), type, desc, extractAttachments(d));
	              })
	              all = all.concat(parts)
	          });
	          // console.log("parse done!")
	          resolve(all)
			  info("<<<< crawl word done ")
	          return all
	        }else{
	          resolve([])
	          return all
	        }
	      },
	      (e) => {
	        err('word ' + word + " fail to parse the data",e);
	        resolve([])
	        return []
	      });
	})
}

function definitions(root, type, format){
  var typeElements = $("#" + type,root);
  var arr = [];
  var defs = typeElements.parent().nextAll("ol").first().children("li");
  defs.map(function(i,e){
    if(format === "html") {
        arr.push($(e).html());
    } else {
      arr.push($(e).text());
    }
  });
  return arr
}
function extractDefs(txt) {
  var idx = txt.indexOf("\n\n")
  if(idx >= 0) {
    return txt.substring(0,idx)
  }else{
    return txt
  }
}
function extractAttachments(txt) {
  var idx = txt.indexOf("\n\n")
  if(idx >= 0) {
    return txt.substring(idx).trim().split("\n\n\n") 
  }else{
    return []
  }
}

module.exports = crawl;