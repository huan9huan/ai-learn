var lookup = require('../dsl/lookup')
var dict = require('../store/dictionary')
var debug = require('debug')('test')

dict.fetch('test').then(debug)
lookup("bingo")