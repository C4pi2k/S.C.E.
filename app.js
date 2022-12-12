// 1 - set up express & mongoose
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo');
var mongoose = require('mongoose');
var cookie = express();
var app = express();

var fs = require('fs');
var path = require('path');
require('dotenv/config');

//totp stuff
var secret = "";

app.use(express.static(__dirname));

// 1.5 - Creating Session Stuff
app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
	secret: bcrypt.genSaltSync(10),
	resave: false,
	saveUninitialized: true,
	cookie: { MaxAge: oneDay },
	store: MongoStore.create({mongoUrl: 'mongodb+srv://dbUser:mongodbUser@cluster0.ph492ws.mongodb.net/test'})
}));

// 2 - Verbindung zur Datenbank
mongoose.connect(process.env.MONGO_URL,
	{ useNewUrlParser: true, useUnifiedTopology: true }, err => {
		console.log('connected to ' + process.env.MONGO_URL)
	});

// 3 - Code in ./models.js

// 4 - Set up EJS
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// EJS als templating engine setzen
app.set("view engine", "ejs");

// 5 - Set up multer um upload files zu speichern
var multer = require('multer');


var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});

var upload = multer({ storage: storage });

// 6 - Mongoose Models
var employeeSchema = require('./model/employee');
var customerSchema = require('./model/customer');
var productSchema = require('./model/product');
var orderHeaderSchema = require('./model/orderHeader');
var orderItemSchema = require('./model/orderItem');
const { PRIORITY_ABOVE_NORMAL } = require('constants');
const { json } = require('body-parser');

//GET Methods
app.get('/', (req, res) => {
	res.render('overview');
});

// GET EMPLOYEE START
app.get('/employee', (req, res) => {
	res.render('employee/employee');
});

app.get('/createNewEmployee', (req, res) => {
	res.render('employee/createNewEmployee');
});

app.get('/listEmployee', (req, res) => {
	let employee = {};
	employee = null;
	res.render('employee/listEmployee', {employee});
});

app.get('/listAllEmployees', async (req, res) => {
	let filter = {};
	let allUsers = await employeeSchema.find(filter);
	res.render('employee/listAllEmployees', {allUsers});
});

app.get('/editEmployee', (req, res) => {
	let employee = {};
	employee = null;
	res.render('employee/editEmployee', {employee});
});

app.get('/deleteEmployee', (req, res) => {
	res.render('employee/deleteEmployee');
});
// GET EMPLOYEE END
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
// GET CUSTOMER START
app.get('/customer', (req, res) => {
	res.render('customer/customer');
});

app.get('/createNewcustomer', (req, res) => {
	res.render('customer/createNewcustomer');
});

app.get('/listcustomer', (req, res) => {
	let customer = {};
	customer = null;
	res.render('customer/listcustomer', {customer});
});

app.get('/listAllcustomers', async (req, res) => {
	let filter = {};
	let allCustomers = await customerSchema.find(filter);
	res.render('customer/listAllcustomers', {allCustomers});
});

app.get('/editcustomer', (req, res) => {
	let customer = {};
	customer = null;
	res.render('customer/editcustomer', {customer});
});

app.get('/deletecustomer', (req, res) => {
	res.render('customer/deletecustomer');
});
// GET CUSTOMER END
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
// GET PRODUCT START
app.get('/product', (req, res) => {
	res.render('product/product');
});

app.get('/createNewProduct', (req, res) => {
	res.render('product/createNewProduct');
});

app.get('/listproduct', (req, res) => {
	let product = {};
	product = null;
	res.render('product/listproduct', {product});
});

app.get('/listAllproducts', async (req, res) => {
	let filter = {};
	let allProducts = await productSchema.find(filter);
	res.render('product/listAllproducts', {allProducts});
});

app.get('/listAllproductsLowStock', async (req, res) => {
	let filter = {};
	let allProducts = await productSchema.find(filter);
	res.render('product/listAllproductsLowStock', {allProducts});
});

app.get('/editProduct', (req, res) => {
	let product = {};
	product = null;
	res.render('product/editProduct', {product});
});

app.get('/deleteProduct', (req, res) => {
	res.render('product/deleteproduct');
});

app.get('/storageStatistics', (req, res) => {
	let storage = {};
	storage = null;
	res.render('product/storageStatistics', {storage});
});
// GET PRODUCT END
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
// GET ORDER START
app.get('/order', (req, res) => {
	res.render('order/order')
});

app.get('/createNewOrder', (req, res) => {
	let itemAmount = 1
	res.render('order/createNewOrder', {itemAmount});
});

app.get('/editOrder', (req, res) => {
	let order = {};
	order = null;
	res.render('order/editOrder', {order});
});
// GET ORDER END
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
// 8 - POST Methods
// POST EMPLOYEE START
app.post('/createNewEmployee', upload.single('employee'), (req, res) => {
	
	var date = new Date();
	var current_validity_date = new Date(date.setMonth(date.getMonth()+4));

	let employeeObj = {
		customId: req.body.customId,
		validity_date: current_validity_date,
		active: true,
		salutation: req.body.salutation,
		name: req.body.name,
		surname: req.body.surname,
		street: req.body.street,
		street_number: req.body.street_number,
		place: req.body.place,
		plz: req.body.plz,
		email: req.body.email,
		tel_number: req.body.tel_number,
		departement: req.body.departement,
		short_name: req.body.short_name
	}

	employeeSchema.create(employeeObj, (err) => {
		if(err) {
			console.log(err);
		} else {
			// alert("Employee successfully added!");
			res.redirect('/employee');
		}
	})
});

app.post('/showSingleEmployee', async (req, res) => {
	let id = req.body.employeeId;

	let employee = await employeeSchema.findOne({customId: id});

	res.render('employee/listEmployee', {employee});
});

app.post('/showEditableEmployee', async (req, res) => {
	let id = req.body.employeeId;

	let employee = await employeeSchema.findOne({customId: id});

	res.render('employee/editEmployee', {employee});
});

app.post('/showSingleEmployeeToEdit', async (req, res) => {
	let id = req.body.employeeId;

	let employee = await employeeSchema.findOne({customId: id});

	res.render('editEmployee', {employee});
});

app.post('/editEmployee', async (req, res) => {

	let id = req.body.employeeId;
	let salutation = req.body.salutation;
	let name = req.body.name;
	let surname = req.body.surname;
	let street = req.body.street;
	let street_number = req.body.street_number;
	let place = req.body.place;
	let plz = req.body.plz;
	let email = req.body.email;
	let tel_number = req.body.tel_number;
	let departement = req.body.departement;
	let short_name = req.body.short_name;

	let filter = { customId: id };

	let update = { 
		salutation: salutation,
		name: name,
		surname: surname,
		street: street,
		street_number: street_number,
		place: place,
		plz: plz,
		email: email,
		tel_number: tel_number,
		departement: departement,
		short_name: short_name
	};

	await employeeSchema.findOneAndUpdate(filter, update, {
		new: false
	});

	res.redirect('/employee');
});

app.post('/deleteEmployee', async (req, res) => {
	let id = req.body.employeeId;

	let employee = await employeeSchema.deleteOne({customId: id});

	res.redirect('/employee');
});

// POST EMPLOYEE END
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
// POST CUSTOMER START

app.post('/createNewCustomer', upload.single('customer'), (req, res) => {
	
	var date = new Date();
	var current_validity_date = new Date(date.setMonth(date.getMonth()+4));

	let customerObj = {
		customId: req.body.customId,
		validity_date: current_validity_date,
		active: true,
		salutation: req.body.salutation,
		name: req.body.name,
		surname: req.body.surname,
		street: req.body.street,
		street_number: req.body.street_number,
		place: req.body.place,
		plz: req.body.plz,
		email: req.body.email,
		tel_number: req.body.tel_number,
		comment: req.body.comment,
		company_suffix: req.body.company_suffix
	}

	customerSchema.create(customerObj, (err) => {
		if(err) {
			console.log(err);
		} else {
			// alert("Employee successfully added!");
			res.redirect('/customer');
		}
	})
});

app.post('/showSingleCustomer', async (req, res) => {
	let id = req.body.customerId;

	let customer = await customerSchema.findOne({customId: id});

	res.render('customer/listCustomer', {customer});
});

app.post('/showEditableCustomer', async (req, res) => {
	let id = req.body.customerId;

	let customer = await customerSchema.findOne({customId: id});

	res.render('customer/editCustomer', {customer});
});

app.post('/editCustomer', async (req, res) => {

	let id = req.body.customerId;
	let salutation = req.body.salutation;
	let name = req.body.name;
	let surname = req.body.surname;
	let street = req.body.street;
	let street_number = req.body.street_number;
	let place = req.body.place;
	let plz = req.body.plz;
	let email = req.body.email;
	let tel_number = req.body.tel_number;
	let comment = req.body.comment;
	let company_suffix = req.body.company_suffix;

	let filter = { customId: id };

	let update = { 
		salutation: salutation,
		name: name,
		surname: surname,
		street: street,
		street_number: street_number,
		place: place,
		plz: plz,
		email: email,
		tel_number: tel_number,
		comment: comment,
		company_suffix: company_suffix
	};

	await customerSchema.findOneAndUpdate(filter, update, {
		new: false
	});

	res.redirect('/customer');
});

app.post('/deleteCustomer', async (req, res) => {
	let id = req.body.customerId;

	let customer = await customerSchema.deleteOne({customId: id});

	res.redirect('/customer');
});

// POST CUSTOMER END
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
// POST PRODUCT START

app.post('/createNewProduct', upload.single('product'), (req, res) => {
	
	let productObj = {
		customId: req.body.customId,
		storage_location: req.body.storage_location,
		name: req.body.name,
		producer: req.body.producer,
		article_description: req.body.article_description,
		stock_amount: req.body.stock_amount,
		price: req.body.price,
		minimum_stock: req.body.minimum_stock
	}

	productSchema.create(productObj, (err) => {
		if(err) {
			console.log(err);
		} else {
			// alert("Employee successfully added!");
			res.redirect('/product');
		}
	})
});

app.post('/showSingleProduct', async (req, res) => {
	let id = req.body.productId;

	let product = await productSchema.findOne({customId: id});

	res.render('product/listProduct', {product});
});

app.post('/showEditableProduct', async (req, res) => {
	let id = req.body.productId;

	let product = await productSchema.findOne({customId: id});

	res.render('product/editProduct', {product});
});

app.post('/editProduct', async (req, res) => {

	let id = req.body.productId;
	let storage_location = req.body.storage_location;
	let name = req.body.name;
	let producer = req.body.producer;
	let article_description = req.body.article_description;
	let street_number = req.body.street_number;
	let stock_amount = req.body.stock_amount;
	let price = req.body.price;
	let minimum_stock = req.body.minimum_stock;

	let filter = { customId: id };

	let update = { 
		storage_location: storage_location,
		name: name,
		producer: producer,
		article_description: article_description,
		street_number: street_number,
		stock_amount: stock_amount,
		price: price,
		minimum_stock: minimum_stock
	};

	await productSchema.findOneAndUpdate(filter, update, {
		new: false
	});

	res.redirect('/product');
});

app.post('/deleteProduct', async (req, res) => {
	let id = req.body.productId;

	let product = await productSchema.deleteOne({customId: id});

	res.redirect('/product');
});

app.post('/showStorageStatistics', async (req, res) => {
	let location = req.body.storageLocation;

	let storage = await productSchema.find({storage_location: location});

	let storageLength = storage.length;
	let storageValue = 0;

	for(let i = 0; i < storageLength; i++) {
		productValue = storage[i].stock_amount * storage[i].price;
		storageValue += productValue;
	}

	res.render('product/storageStatistics', {storage: storage, storageValue: storageValue});
});

// POST PRODUCT END
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
// POST ORDER START

app.post('/createNewOrder', upload.single('orderHeader'), upload.single('orderItem'), (req, res) => {

	let orderItem = {
		customId: req.body.itemCustomId,
		productId: req.body.productId,
		product_amount: req.body.product_amount 
	}

	let orderItemAmount = Number(req.body.itemAmount);

	let transferOrderItem = {
		customId: 0,
		productId: 0,
		product_amount: 0
	};

	if(orderItemAmount == 1) {
	
		transferOrderItem.customId = orderItem.customId;
		transferOrderItem.productId = orderItem.productId;
		transferOrderItem.product_amount = orderItem.product_amount;
	
		orderItemSchema.create(transferOrderItem, (err) => {
			if(err) {
				console.log(err);
			} 
		})

	} else {
		for(let i = 0; i < orderItemAmount; i++) {
	
			transferOrderItem.customId = orderItem.customId[i];
			transferOrderItem.productId = orderItem.productId[i];
			transferOrderItem.product_amount = orderItem.product_amount[i];
	
			orderItemSchema.create(transferOrderItem, (err) => {
				if(err) {
					console.log(err);
				} 
			})
		}
	}

	let orderHeader = {
		customId: req.body.headerCustomId,
		customerId: req.body.customerId,
		order_date: req.body.order_date,
		orderItemId: orderItem.customId,
		state: "Active"
	}

	orderHeaderSchema.create(orderHeader, (err) => {
		if(err){
			console.log(err);
		} else {
			res.render('order/order');
		}
	})
});

app.post('/addItem', (req, res) => {
	let itemAmount = 1;
	
	// use the '+' sign, to convert from text to number in JS
	let viewItemAmount = +req.body.itemAmount;

	itemAmount += viewItemAmount;

	console.log(itemAmount);

	res.render('order/createNewOrder', {itemAmount})
});

app.post('/showEditableOrder', async (req, res) => {
	let id = req.body.orderId;

	let order = await orderHeaderSchema.findOne({customId: id});

	let orderItemsId = order.orderItemId;

	let orderItems = [];

	for(let i = 0; i < orderItemsId.length; i++) {
		let orderItem = await orderItemSchema.findOne({customId: orderItemsId[i]});
		orderItems.push(orderItem);
	}

	res.render('order/editOrder', {order, orderItems});
});

app.post('/editOrder', async (req, res) => {

	let headerId = req.body.orderHeaderId;
	let customerId = req.body.customerId;
	let order_date = req.body.order_date;

	let headerFilter = { customId: headerId };

	let headerUpdate = { 
		customerId: customerId,
		order_date: order_date
	};

	await orderHeaderSchema.findOneAndUpdate(headerFilter, headerUpdate, {
		new: false
	});

	let orderItemAmount = req.body.productId.length;
	let itemId = 0;
	let productId = 0;
	let product_amount = 0;
	let itemFilter = {};
	let itemUpdate = {};

	if(Array.isArray(req.body.productId) == false) {
		itemId = req.body.orderItemId;
		productId = req.body.productId;
		product_amount = req.body.product_amount;

		itemFilter = {customId: itemId};

		itemUpdate = {
			productId: productId,
			product_amount: product_amount
		};

		await orderItemSchema.findOneAndUpdate(itemFilter, itemUpdate, {
			new: false
		});
	} else {
		for(let i = 0; i < orderItemAmount; i++) {
			itemId = req.body.orderItemId[i];
			productId = req.body.productId[i];
			product_amount = req.body.product_amount[i];
	
			itemFilter = {customId: itemId};
	
			itemUpdate = {
				productId: productId,
				product_amount: product_amount
			};
	
			await orderItemSchema.findOneAndUpdate(itemFilter, itemUpdate, {
				new: false
			});
		}
	}

	res.redirect('/order');
});
	
// Schritt 9 - Den Server port setzen
				var port = process.env.PORT || '3000'
app.listen(port, err => {
	if (err)
		throw err
	console.log('Server listening on port', port)
})

// reduce

