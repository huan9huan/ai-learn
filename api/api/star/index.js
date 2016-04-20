var Star = require('./schema')
var parse = require('co-body');
var debug = require('debug')("api:channel")
var shortid = require('shortid')
var logger = require('../../logger')

exports.list = function *() {
  var uid = this.request.query['uid']
  var _ = this.request.query['_']
  
  var founds = yield new Promise((resolve, reject) => {
    Star.find({uid: uid},(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })
  logger.info('list star done', 'count' + founds.length, _)
  this.body = {code:0, iids: founds.map(f => {return f.iid})}
}

exports.add = function *() {
  var body = yield parse(this);
  var uid = body.uid
  var _ = body._
  var iid = body.iid
  
  var founds = yield new Promise((resolve, reject) => {
    Star.find({uid: uid, iid: iid},(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })
  debug("founds",founds)
  if(founds.length == 0) {
    var star = new Star({uid: uid, iid: iid})
    star = yield new Promise((resolve, reject) => {
      star.save(star,(err,saved) => {
        if(err)
          reject(err)
        else
          resolve(saved)
      });
    })
    logger.info('add star done', _)
  }else{
    logger.warn('star already added, so ignored', _)
  }
  this.body = {code:0}
}

exports.remove = function *() {
  var body = yield parse(this);
  var uid = body.uid
  var _ = body._
  var iid = body.iid
  
  var founds = yield new Promise((resolve, reject) => {
    Star.find({uid: uid, iid: iid},(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })

  if(founds.length == 0) {
    logger.warn('not exist star, so ignored', iid, _)
  }else{
    var star = founds[0]
    yield new Promise((resolve, reject) => {
        star.remove((err,removed) => {
            logger.info('remove star done', _)
            resolve(iid)
        })  
    })
  }
  this.body = {code:0}
}