var mongoose = require('mongoose');

var customerSchema = new mongoose.Schema({
    customId: Number,
    validity_date: String,
    active: Boolean,
    salutation: String,
    name: String,
    surname: String,
    street: String,
    street_number: Number,
    place: String,
    plz: String,
    email: String, 
    tel_number: String,
    comment: String,
    company_suffix: String
})

module.exports = new mongoose.model('customer', customerSchema);