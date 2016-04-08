var mongoose = require('../../store/mongo')
var timestamps = require('mongoose-timestamp')

var botSchema = mongoose.Schema({
    bid: String,
    name: String,
    type: Number // -1 means not used
});
botSchema.plugin(timestamps);
var Bot = mongoose.model('Bot', botSchema);

module.exports = Bot