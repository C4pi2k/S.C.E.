var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
      username: String,
      password: String
})

module.exports = new mongoose.model('user', userSchema);