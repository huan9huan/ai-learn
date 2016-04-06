var mongoose = require('../../store/mongo')

var channelSchema = mongoose.Schema({
    cid: String,
    uid: String,
    name: String
});
var Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel