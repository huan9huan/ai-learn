
/**
 * Module dependencies.
 */

var parse = require('co-body');
var debug = require('debug')("api:users")
var User = require('./schema')
var shortid = require('shortid')
var logger = require('../../logger')

exports.login = function *(){
  var body = yield parse(this);
  try{
    logger.debug("user login", body)
    var founds = yield new Promise((resolve, reject) => {
      User.find({name: body.name},(err,founds) => {
        if(err)
          founds = []
        resolve(founds)
      })
    })
    if(founds.length == 1 && founds[0].pwd === body.pwd) {
      this.body = {code:0, user: {uid: founds[0].uid, name: founds[0].name}};
      logger.info("user login ok!", body.name, body._)
    }else{
      var msg = "name or pwd wrong"
      this.body = {code:1, msg: msg}
      logger.error("login fail!", body.name, body.pwd, msg, body._)
    }
  }
  catch(err) {
    logger.error("login fail for internal error", err, body._)
  }
}

/**
 * POST a new user.
 */
exports.register = function *(){
  var body = yield parse(this)
  logger.debug("user register", body)
  if (!body.name) this.throw(400, '.name required');
  if (!body.pwd) this.throw(400, '.pwd required');
  var founds = yield new Promise((resolve, reject) => {
    User.find({name: body.name},(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })
  if(founds.length > 0) {
    this.body = {code:1, msg: 'duplicate name'}
    logger.warn("user register fail for duplidate", body)
    return
  }
  var user = new User({uid: "U" + shortid.generate(), name: body.name, pwd: body.pwd})
  user = yield new Promise((resolve, reject) => {
    user.save(user,(err,saved) => {
      if(err)
        reject(err)
      else
        resolve(saved)
    });
  })
  this.status = 201;
  user = {uid: user.uid, name: body.name}
  logger.warn("user register ok", user, body._)
  this.body = {code:0, user: user};
}

exports.userInfo = function *(){
  var uid = this.request.query['uid']
  var _ = this.request.query['_']
  logger.debug("user query info", uid)
  if (!uid) this.throw(400, '.uid required');
  var founds = yield new Promise((resolve, reject) => {
    User.find({uid : uid}, (err,founds) => {
      if(err)
        resolve([])
      else
        resolve(founds)
    })
  })
  if(founds.length == 1) {
    var user = {uid: founds[0].uid, name: founds[0].name}
    this.body = {code:0, user: user};
    logger.info("user info ok!", user, _)
  }else{
    var msg = "not existed"
    this.body = {code:1, msg: msg}
    logger.warn("user info fail", msg, _)
  }  
}
