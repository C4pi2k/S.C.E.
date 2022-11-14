var mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
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
    departement: String,
    short_name: String
})

module.exports = new mongoose.model('employee', employeeSchema);