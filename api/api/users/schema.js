var mongoose = require('mongoose');
var debug = require('debug')('user')

mongoose.connect('mongodb://localhost/wordconsole');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    debug('mongodb connected')
});

var userSchema = mongoose.Schema({
    uid: String,
    name: String,
    pwd: String
});
var User = mongoose.model('User', userSchema);

module.exports = User