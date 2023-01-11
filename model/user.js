var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
      username: String,
      password: String,
      salt: String,
      createdAt: Date,
      tfaKey: String,
      // roles 'standard' and 'special'. changed on database.
      role: String
})

module.exports = new mongoose.model('user', userSchema);