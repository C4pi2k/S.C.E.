var mongoose = require('mongoose');

var orderHeaderSchema = new mongoose.Schema({
      customId: Number,
      customerId: Number,
      order_date: String,
      orderItemId: [Number],
      // The state is to determine in what state the order is (Active, Confirmed, Cancelled)
      state: String
})

module.exports = new mongoose.model('orderHeader', orderHeaderSchema);