var mongoose = require('mongoose');

var orderItemSchema = new mongoose.Schema({
      customId: Number,
      productId: Number,
      product_amount: Number
})

module.exports = new mongoose.model('orderItem', orderItemSchema);