'use strict';

var CronJob = require('cron').CronJob;
var debug = require('debug')('dsl')
var RemindStore = require('../store/remind')
var ImpressionStore = require('../store/impression')

class Remind {

	constructor(redis) {
		this.redis = redis
		this.remindCronJob = new CronJob('*/10 * * * * *', function() {
		  // 查找需要被remind的impression
		  var now = new Date().getTime()
		  debug("remind cronjob running ",now)
		  this.redis.hgetall('rem',function(err, results){
		  	// console.log("rem get all done, result count " , results.length)
		  	if(err) {
		  		debug(err)
		  	}else{
		  		for (var i in results) {
		           var item = JSON.parse(results[i]);
		           if(item.lastRemindAt && item.timeout && item.ttl
		           	&& item.ttl > 0 && item.lastRemindAt + item.timeout < now) {
			           //it's time send remind
			           this.remindCallback && this.remindCallback(item)

			           //更新状态
			           item.ttl = item.ttl - 1
			           item.hit = item.hit + 1
					   item.timeout = item.timeout * 2
					   item.lastRemindAt = now
					   //save back
					   this._refresh(item)
		           }
		        }
		  	}
		  }.bind(this))
	    }.bind(this), null, true, 'Asia/Shanghai');
	}

	start(remindCallback){
		this.remindCallback = remindCallback
	}

	stop(){
	   this.remindCronJob && this.remindCronJob.stop()	
	   this.remindCallback = this.remindCronJob = null;
	}

	remind(impressionId) {
		return new Promise((resolve,reject) => {
			new ImpressionStore(this.redis).get(impressionId,(i) => {
				if(i){
					resolve(new RemindStore(this.redis).remember(i))
				}
				else
					reject("not found")
			})
		}) 

	}

	_refresh(impression) {
		this.redis.hset('rem',impression.id,JSON.stringify(impression))
	}
}

module.exports = Remind;