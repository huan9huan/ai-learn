var Impression = require('./schema')
var parse = require('co-body');
var debug = require('debug')("api:impression")
var logger = require('../../logger')

exports.create = function *(){
  var body = yield parse(this);
  var _ = body._
  logger.debug('impression create', body)
  var i = new Impression({uid: body.uid, cid: body.cid, content: body.content})
  i = yield new Promise((resolve, reject) => {
    i.save(i,(err,saved) => {
      if(err)
        reject(err)
      else
        resolve(saved)
    });
  })
  i = {id: i.id, uid: i.uid, cid: i.cid, content: i.content, createdAt: i.createdAt}
  logger.info('impression create', i, _)
  this.body = {code:0, impression: i};
}

exports.list = function *(){
  var cid = this.request.query['cid']
  var _ = this.request.query['_']
  
  var founds = yield new Promise((resolve, reject) => {
    Impression.find({cid: cid},(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })
  logger.info('list impression', cid, founds.length, _)
  this.body = {code:0, impressions: founds}
}