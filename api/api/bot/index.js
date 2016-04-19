var Bot = require('./schema')
var parse = require('co-body');
var debug = require('debug')("api:bot")
var shortid = require('shortid')
var logger = require('../../logger')

exports.create = function *(){
  var body = yield parse(this);
  var name = body.name
  var type = body.type
  var _ = body._
  logger.debug("create bot",body)
  var founds = yield new Promise((resolve, reject) => {
    Bot.find({name: body.name},(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })
  if(founds.length > 0) {
    logger.warn("bot already created",body, _)
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
    bot = {bid: bot.bid, name: bot.name}
    logger.info("bot created done",bot, _)
    this.body = {code:0, bot: bot};
  }
}

exports.list = function *(next){
  var type = this.request.query['type']
  var _ = this.request.query['_']
  type = type ? parseInt(type) : undefined
  logger.debug("listing bot",this.request.query)
  var founds = yield new Promise((resolve, reject) => {
    var query = type ? {type: type} : {}
    Bot.find(query,(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })
  logger.debug("list bot count", founds.length, _)
  this.body = {code:0, bots: founds}
}

exports.drop = function *(next){
  var body = yield parse(this)
  var type = body.type
  var _ = body._
  logger.debug("dropping bot",type)
  var founds = yield new Promise((resolve, reject) => {
    Bot.remove({type: type},(err,founds) => {
      if(err)
        founds = []
      resolve(founds)
    })
  })
  logger.debug("drop bot count", type, _)
  this.body = {code:0}
}
