var mongoose = require('mongoose');
var debug = require('debug')('user')

mongoose.connect('mongodb://localhost/wordconsole');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    debug('mongodb connected')
});

module.exports = mongoose