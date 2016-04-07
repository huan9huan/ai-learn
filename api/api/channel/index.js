var Channel = require('./schema')
var parse = require('co-body');
var debug = require('debug')("api:channel")
var shortid = require('shortid')

exports.create = function *(){
  var body = yield parse(this);
  var founds = yield new Promise((resolve, reject) => {
    Channel.find({uid: body.uid, name: body.name},(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })
  if(founds.length > 0) {
    this.body = {code:1, msg: "already existed"}
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
    this.body = {code:0, channel: {uid: channel.uid, cid: channel.cid, name: channel.name}};
  }
}

exports.list = function *(){
  var uid = this.request.query['uid']
  var founds = yield new Promise((resolve, reject) => {
    Channel.find({uid: uid},(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })
  this.body = {code:0, channels: founds}
}