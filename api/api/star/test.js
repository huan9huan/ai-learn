var request = require('supertest');
var api = require('../..')

describe('GET /api/star/*', function(){
   var app = api();
   var iid = 'tester-iid-' + Math.random()
   var uid = "tester"  + Math.random()
   var listen = app.listen()

  it('should create new star', function(done){
    request(listen)
    .post('/api/star/add')
    .send({iid: iid, uid: uid})
    .end(function(err, res){
      if (err) return done(err);
      Object.keys(res.body).should.eql(['code']);
      done();
    });
  })

  it('should list all my stars', function(done){
    request(listen)
    .get('/api/star/list')
    .query({uid: uid})
    .end(function(err, res){
      if (err) return done(err);
      Object.keys(res.body).should.eql(['code','iids']);
      res.body.iids.length.should.eql(1)
      done();
    });
  })

  it('should remove new star', function(done){
    request(listen)
    .post('/api/star/remove')
    .send({iid: iid, uid: uid})
    .end(function(err, res){
      if (err) return done(err);
      Object.keys(res.body).should.eql(['code']);
      done();
    });
  })

  it('should support safely remove star again', function(done){
    request(listen)
    .post('/api/star/remove')
    .send({iid: iid, uid: uid})
    .end(function(err, res){
      if (err) return done(err);
      Object.keys(res.body).should.eql(['code']);
      done();
    });
  })

  it('should list all my stars', function(done){
    request(listen)
    .get('/api/star/list')
    .query({uid: uid})
    .end(function(err, res){
      if (err) return done(err);
      Object.keys(res.body).should.eql(['code','iids']);
      res.body.iids.length.should.eql(0)
      done();
    });
  })
})