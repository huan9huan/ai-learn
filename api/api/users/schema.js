var mongoose = require('../../store/mongo')
var timestamps = require('mongoose-timestamp');

var userSchema = mongoose.Schema({
    uid: String,
    name: String,
    pwd: String
});
userSchema.plugin(timestamps);
var User = mongoose.model('User', userSchema);

module.exports = User