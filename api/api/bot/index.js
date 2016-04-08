var Bot = require('./schema')
var parse = require('co-body');
var debug = require('debug')("api:bot")
var shortid = require('shortid')

exports.create = function *(){
  var body = yield parse(this);
  var name = body.name
  var type = body.type
  var founds = yield new Promise((resolve, reject) => {
    Bot.find({name: body.name},(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })
  if(founds.length > 0) {
    this.body = {code:1, msg: "already existed"}
  }else{
    var bot = new Bot({bid: "B" + shortid.generate(), name: name, type: type})
    bot = yield new Promise((resolve, reject) => {
      bot.save(bot,(err,saved) => {
        if(err)
          reject(err)
        else
          resolve(saved)
      });
    })
    debug(bot)
    this.body = {code:0, bot: {bid: bot.bid, name: bot.name}};
  }
}

exports.list = function *(next){
  var type = typeof this.params.type === "Number" ? this.params.type : undefined
  debug("type:", type)
  var founds = yield new Promise((resolve, reject) => {
    var query = type ? {type: type} : {}
    Bot.find(query,(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })
  this.body = {code:0, bots: founds}
}

exports.drop = function *(next){
  var body = yield parse(this)
  var type = body.type
  var founds = yield new Promise((resolve, reject) => {
    Bot.remove({type: type},(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })
  this.body = {code:0, bots: founds}
}