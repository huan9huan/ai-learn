var fetch = require('isomorphic-fetch');
var $ = require('cheerio');

function Part(type, def, attachments) {
  this.type = type;
  this.def = def;
  this.attachments = attachments || [];
}

function definitions(root, type, format){
  var typeElements = $("#" + type,root);
  var arr = [];
  var defs = typeElements.parent().nextAll("ol").first().children("li");
  // console.log("defs size",defs.length);
  defs.map(function(i,e){
    // arr.push($(e).html());
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


function crawlWord(word,resolve,format) {
  var baseURL = 'http://en.wiktionary.org';
  var url = baseURL + '/w/api.php?action=parse&format=json&prop=text|revid|displaytitle&page=' + word;  
  console.log("debugging: try to visit url %s with format %s",url,format)
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
              var defs = definitions(root,type,"text");
              var parts = defs.map((d) => {
                // console.log("parse text ",d)
                return new Part(type, extractDefs(d),extractAttachments(d));
              })
              all = all.concat(parts)
          });
          // console.log("parse done!")
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
module.exports = crawlWord