var request = require('supertest');
var api = require('../..')

describe('GET /api/channel/*', function(){
   var app = api();
   var name = 'tester-' + Math.random()
   var uid = "tester"  + Math.random()
   var cid = ""
   var listen = app.listen()

  it('should create new channel', function(done){
    request(listen)
    .post('/api/channel/create')
    .send({name: name, uid: uid})
    .end(function(err, res){
      if (err) return done(err);
      Object.keys(res.body).should.eql(['code', 'channel']);
      cid = res.body.channel.cid
      done();
    });
  })

  it('should list all my channels', function(done){
    request(listen)
    .get('/api/channel/list')
    .query({uid: uid})
    .end(function(err, res){
      if (err) return done(err);
      Object.keys(res.body).should.eql(['code', 'channels']);
      res.body.channels.length.should.eql(1)
      done();
    });
  })
})