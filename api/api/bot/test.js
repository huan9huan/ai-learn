var request = require('supertest');
var api = require('../..')
var debug = require('debug')('bot:test')

describe('GET /api/bot/*', function(){
   var app = api();
   var name = 'tester-' + Math.random()
   var bid = ""
   var listen = app.listen()
   var type = -1

  it('should create new bot', function(done){
    request(listen)
    .post('/api/bot/create')
    .send({name: name, type: type})
    .end(function(err, res){
      if (err) return done(err);
      Object.keys(res.body).should.eql(['code', 'bot']);
      debug(res.body)
      bid = res.body.bot.bid
      done();
    });
  })

  it('should list all bots', function(done){
    request(listen)
    .get('/api/bot/list')
    .query({type: type})
    .end(function(err, res){
      if (err) return done(err);
      Object.keys(res.body).should.eql(['code', 'bots']);
      res.body.bots.length.should.eql(1)
      res.body.bots[0].bid.should.eql(bid)
      done();
    });
  })

  it('should drop all test bots', function(done){
    request(listen)
    .post('/api/bot/drop')
    .send({type: type})
    .end(function(err, res){
      if (err) return done(err);
      done();
    });
  })

  it('should list all bots', function(done){
    request(listen)
    .get('/api/bot/list')
    .query({type: type})
    .end(function(err, res){
      if (err) return done(err);
      Object.keys(res.body).should.eql(['code', 'bots']);
      res.body.bots.length.should.eql(0)
      done();
    });
  })
})