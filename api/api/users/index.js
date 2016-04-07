
/**
 * Module dependencies.
 */

var parse = require('co-body');
var debug = require('debug')("api:users")
var User = require('./schema')
var shortid = require('shortid')

exports.login = function *(){
  var body = yield parse(this);
  var founds = yield new Promise((resolve, reject) => {
    User.find({name: body.name},(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })
  if(founds.length == 1 && founds[0].pwd === body.pwd) {
    this.body = {code:0, user: {uid: founds[0].uid, name: founds[0].name}};
    debug("login ok!")
  }else{
    this.body = {code:1, msg: "name or pwd wrong"}
    debug("login fail!")
  }
}

/**
 * POST a new user.
 */
exports.register = function *(){
  var body = yield parse(this);
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
    this.body = {code:1, msg: 'duplicate name'}; 
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
  this.body = {code:0, user: {uid: user.uid, name: body.name}};
}

exports.userInfo = function *(){
  var uid = this.request.query['uid']
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
    this.body = {code:0, user: {uid: founds[0].uid, name: founds[0].name}};
    debug("user info ok!")
  }else{
    this.body = {code:1, msg: "not existed"}
    debug("user info fail!")
  }  
}
