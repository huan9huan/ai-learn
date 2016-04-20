var mongoose = require('../../store/mongo')
var timestamps = require('mongoose-timestamp')

var starSchema = mongoose.Schema({
    uid: String,
    iid: String
});
starSchema.plugin(timestamps);
var Star = mongoose.model('Star', starSchema);

module.exports = Star