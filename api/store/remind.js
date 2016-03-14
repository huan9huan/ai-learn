'use strict';
var CronJob = require('cron').CronJob;
var debug = require('debug')('store')

class RemindStore {

	constructor(redis, remindCallback) {
		this.redis = redis
		this.remindCallback = remindCallback
		this.remindCronJob = new CronJob('*/10 * * * * *', function() {
		  // 查找需要被remind的impression
		  var now = new Date().getTime()
		  debug("remind cronjob running... now ",now)
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
			           this.remindCallback(item)

			           //更新状态
			           item.ttl = item.ttl - 1
			           item.hit = item.hit + 1
					   item.timeout = item.timeout * 2
					   item.lastRemindAt = now
					   //save back
					   this.refresh(item)
		           }
		        }
		  	}
		  }.bind(this))
	    }.bind(this), null, true, 'Asia/Shanghai');
	}

	remember(impression,channel) {
		impression.channel = channel
        impression.createdAt = new Date().getTime()
        impression.lastRemindAt = impression.createdAt
        impression.hit = 0
        impression.ttl = 3	// ttl = 0 则不再发送remind
        impression.timeout = 1000 * 60 // timeout + updated_at > now, 则需要发出remind
	    this.redis.hset('rem',impression.id,JSON.stringify(impression))
	    return impression
	}

	refresh(impression) {
		this.redis.hset('rem',impression.id,JSON.stringify(impression))
	}
}

module.exports = RemindStore;