// 3 - Das mongoose Modul laden
var mongoose = require('mongoose');

var testSchema = new mongoose.Schema({
    test_string: String
});

// Image ist das model mit dem schema imageSchema
module.exports = new mongoose.model('test', testSchema);
