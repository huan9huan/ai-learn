'use strict';

var debug = require('debug')('store')

class RemindStore {

	constructor(redis) {
		this.redis = redis
	}

	remember(impression,channel) {
		impression.channel = channel || ""
        impression.createdAt = new Date().getTime()
        impression.lastRemindAt = impression.createdAt
        impression.hit = 0
        impression.ttl = 3	// ttl = 0 则不再发送remind
        impression.timeout = 1000 * 60 // timeout + updated_at > now, 则需要发出remind
	    this.redis.hset('rem',impression.id,JSON.stringify(impression))
	    return impression
	}


}

module.exports = RemindStore;