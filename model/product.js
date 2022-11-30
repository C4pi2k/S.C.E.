var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    storage_location: String,
    name: String,
    producer: String,
    article_description: String,
    stock_amount: Number,
    price: Number,
    minimum_stock: Number
})

module.exports = new mongoose.model('product', productSchema);