var mongoose = require('../../store/mongo')
var timestamps = require('mongoose-timestamp')

var channelSchema = mongoose.Schema({
    cid: String,
    uid: String,
    name: String
});
channelSchema.plugin(timestamps);
var Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel