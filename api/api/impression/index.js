var Impression = require('./schema')
var parse = require('co-body');
var debug = require('debug')("api:impression")

exports.create = function *(){
  var body = yield parse(this);
  var i = new Impression({uid: body.uid, cid: body.cid, content: body.content})
  i = yield new Promise((resolve, reject) => {
    i.save(i,(err,saved) => {
      if(err)
        reject(err)
      else
        resolve(saved)
    });
  })
  this.body = {code:0, impression: i};
}

exports.list = function *(){
  var cid = this.request.query['cid']
  var founds = yield new Promise((resolve, reject) => {
    Impression.find({cid: cid},(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })
  this.body = {code:0, impressions: founds}
}