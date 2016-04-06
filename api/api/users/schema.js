var mongoose = require('../../store/mongo')

var userSchema = mongoose.Schema({
    uid: String,
    name: String,
    pwd: String
});
var User = mongoose.model('User', userSchema);

module.exports = User