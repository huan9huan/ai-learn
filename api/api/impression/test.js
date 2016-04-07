var request = require('supertest');
var api = require('../..')

describe('GET /api/impression/*', function(){
   var app = api();
   var name = 'tester-' + Math.random()
   var uid = "tester"  + Math.random()
   var cid = "tester" + Math.random()
   var iid = ""
   var listen = app.listen()

  it('should create new impression', function(done){
    request(listen)
    .post('/api/impression/create')
    .send({content: "bingo", uid: uid, cid: cid})
    .end(function(err, res){
      if (err) return done(err);
      Object.keys(res.body).should.eql(['code', 'impression']);
      iid = res.body.impression.id
      done();
    });
  })

  it('should list all my impressions', function(done){
    request(listen)
    .get('/api/impression/list')
    .query({cid: cid})
    .end(function(err, res){
      if (err) return done(err);
      Object.keys(res.body).should.eql(['code', 'impressions']);
      res.body.impressions.length.should.eql(1)
      done();
    });
  })
})