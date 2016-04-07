var mongoose = require('../../store/mongo')
var timestamps = require('mongoose-timestamp');

var impressionSchema = mongoose.Schema({
    cid: String,
    uid: String,
    content: String
});
impressionSchema.plugin(timestamps);
var Impression = mongoose.model('Impression', impressionSchema);

module.exports = Impression