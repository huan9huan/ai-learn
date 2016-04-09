var Channel = require('./schema')
var parse = require('co-body');
var debug = require('debug')("api:channel")
var shortid = require('shortid')
var logger = require('../../logger')

exports.create = function *(){
  var body = yield parse(this);
  logger.debug('create channel', body)
  var _ = body._
  var founds = yield new Promise((resolve, reject) => {
    Channel.find({uid: body.uid, name: body.name},(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })
  if(founds.length > 0) {
    var msg = "already existed"
    logger.warn('create channel fail', body, msg, _)
    this.body = {code:1, msg: msg}
  }else{
    var channel = new Channel({cid: "C" + shortid.generate(), uid: body.uid, name: body.name})
    channel = yield new Promise((resolve, reject) => {
      channel.save(channel,(err,saved) => {
        if(err)
          reject(err)
        else
          resolve(saved)
      });
    })
    channel = {uid: channel.uid, cid: channel.cid, name: channel.name}
    logger.info('create channel', channel, _)
    this.body = {code:0, channel: channel};
  }
}

exports.list = function *(){
  var uid = this.request.query['uid']
  var _ = this.request.query['_']
  
  var founds = yield new Promise((resolve, reject) => {
    Channel.find({uid: uid},(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })
  logger.info('list channel done', 'count' + founds.length, _)
  this.body = {code:0, channels: founds}
}