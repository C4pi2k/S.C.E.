var mongoose = require('mongoose');

var orderHeaderSchema = new mongoose.Schema({
      customId: Number,
      customerId: Number,
      order_date: String,
      orderItemId: [Number],
      state: String
})

module.exports = new mongoose.model('orderHeader', orderHeaderSchema);