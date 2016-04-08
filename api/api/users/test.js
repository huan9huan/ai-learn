
var request = require('supertest');
var api = require('../..');

describe('GET /api/user/*', function(){
    var app = api();
    var name = 'tester-' + Math.random()
    var pwd = 'tester'
    var uid = ""
   var listen = app.listen()

  it('should create new user', function(done){
    request(listen)
    .post('/api/user/register')
    .send({name: name, pwd: pwd})
    .end(function(err, res){
      if (err) return done(err);
      Object.keys(res.body).should.eql(['code', 'user']);
      uid = res.body.user.uid
      done();
    });
  })

  it("should get user info", function(done){
    request(listen)
    .get('/api/user/info')
    .query({uid: uid})
    .end(function(err, res){
      if (err) return done(err);
      Object.keys(res.body).should.eql(['code', 'user']);
      done();
    });
  })

  it("should login",function (done) {
    request(listen)
    .post('/api/user/login')
    .send({name: name, pwd: pwd})
    .end(function(err, res){
      if (err) return done(err);
      Object.keys(res.body).should.eql(['code', 'user']);
      done();
    })
  })
})
