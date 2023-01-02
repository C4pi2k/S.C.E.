var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
      username: String,
      password: String,
      salt: String,
      createdAt: Date,
      tfaKey: String,
})

module.exports = new mongoose.model('user', userSchema);