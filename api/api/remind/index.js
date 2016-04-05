var debug = require('debug')("api:remind")
var Remind = require('../../dsl/star')
var redis = require('redis')

const db = redis.createClient()
var reminder = null

db.on('ready',() => {
  debug("redis ready!")
  reminder = new Remind(db)
})

exports.remind = function *() {
	var iid = this.params.id
	var once = yield reminder.remind(iid)
    this.body = JSON.stringify(once);
    this.type = "application/json"
    this.status = 200;
}
// exports.start = function *() {
// 	reminder.start()
//     this.body = JSON.stringify({code:'ok'});
//     this.type = "application/json"
//     this.status = 200;  	
// }
// exports.stop = function *() {
// 	reminder.stop()
//     this.body = JSON.stringify({code:'ok'});
//     this.type = "application/json"
//     this.status = 200;  	
// }
