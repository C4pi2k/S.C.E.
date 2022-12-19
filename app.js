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
var userSchema = require('./model/user');
var employeeSchema = require('./model/employee');
var customerSchema = require('./model/customer');
var productSchema = require('./model/product');
var orderHeaderSchema = require('./model/orderHeader');
var orderItemSchema = require('./model/orderItem');
const { PRIORITY_ABOVE_NORMAL } = require('constants');
const { json } = require('body-parser');
const { connect } = require('http2');

//GET Methods
app.get('/', (req, res) => {
	res.render('welcome');
});

app.get('/unallowed', (req, res) => {
	res.render('unallowed');
})

app.post('/emptyCookie', (req, res) => {
	req.session.userId = null;
	req.session.username = null;
	req.session.password = null;
	console.log(req.session.userId);
	console.log(req.session.username);
	console.log(req.session.password);
	res.render('welcome');
})

app.get('/login', (req, res) => {
	res.render('login/login');
});

app.get('/register', (req, res) => {
	res.render('register/register');
});

app.get('/overview', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		res.render('overview');
	}
});

// GET EMPLOYEE START
app.get('/employee', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		res.render('employee/employee');
	}
});

app.get('/createNewEmployee', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		res.render('employee/createNewEmployee');
	}
});

app.get('/listEmployee', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let employee = {};
		employee = null;
		res.render('employee/listEmployee', {employee});
	}
});

app.get('/listAllEmployees', async (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let filter = {};
		let allUsers = await employeeSchema.find(filter);
		res.render('employee/listAllEmployees', {allUsers});
	}
});

app.get('/editEmployee', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let employee = {};
		employee = null;
		res.render('employee/editEmployee', {employee});
	}
});

app.get('/deleteEmployee', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		res.render('employee/deleteEmployee');
	}
});
// GET EMPLOYEE END
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
// GET CUSTOMER START
app.get('/customer', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		res.render('customer/customer');
	}
});

app.get('/createNewcustomer', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {	
		res.render('customer/createNewcustomer');
	}
});

app.get('/listcustomer', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let customer = {};
		customer = null;
		res.render('customer/listcustomer', {customer});
	}
});

app.get('/listAllcustomers', async (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let filter = {};
		let allCustomers = await customerSchema.find(filter);
		res.render('customer/listAllcustomers', {allCustomers});
	}
});

app.get('/editcustomer', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let customer = {};
		customer = null;
		res.render('customer/editcustomer', {customer});
	}
});

app.get('/deletecustomer', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		res.render('customer/deletecustomer');
	}
});
// GET CUSTOMER END
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
// GET PRODUCT START
app.get('/product', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		res.render('product/product');
	}
});

app.get('/createNewProduct', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		res.render('product/createNewProduct');
	}
});

app.get('/listproduct', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let product = {};
		product = null;
		res.render('product/listproduct', {product});
	}
});

app.get('/listAllproducts', async (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let filter = {};
		let allProducts = await productSchema.find(filter);
		res.render('product/listAllproducts', {allProducts});
	}
});

app.get('/listAllproductsLowStock', async (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let filter = {};
		let allProducts = await productSchema.find(filter);
		res.render('product/listAllproductsLowStock', {allProducts});
	}
});

app.get('/editProduct', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let product = {};
		product = null;
		res.render('product/editProduct', {product});
	}
});

app.get('/deleteProduct', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		res.render('product/deleteproduct');
	}
});

app.get('/storageStatistics', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let storage = {};
		storage = null;
		res.render('product/storageStatistics', {storage});
	}
});
// GET PRODUCT END
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
// GET ORDER START
app.get('/order', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		res.render('order/order');
	}
});

app.get('/createNewOrder', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let itemAmount = 1
		res.render('order/createNewOrder', {itemAmount});
	}
});

app.get('/editOrder', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let order = {};
		order = null;
		res.render('order/editOrder', {order});
	}
});

app.get('/listOrder', (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let order = {};
		order = null;
		res.render('order/listOrder', {order});
	}
});

app.get('/listAllOrders', async (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let filter = {};
		let allOrderHeader = await orderHeaderSchema.find(filter);
		let allOrderItem = await orderItemSchema.find(filter);
		res.render('order/listAllOrders', {allOrderHeader, allOrderItem});
	}
});

app.get('/deleteOrderItem', async (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let order = {};
		order = null;
		res.render('order/deleteOrderItem', {order});
	}
});

app.get('/confirmOrder', async (req, res) => {
	if(req.session.userId == null) {
		res.redirect('unallowed');
	} else {
		let filter = {};
		let allOrderHeader = await orderHeaderSchema.find(filter);
		let allOrderItem = await orderItemSchema.find(filter);
		res.render('order/confirmOrder', {allOrderHeader, allOrderItem});
	}
});
// GET ORDER END
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
// 8 - POST Methods

app.post('/register', upload.single('user'), (req, res) => {
	let userObj = {
		username: req.body.username,
		password: req.body.password
	}

	userSchema.create(userObj, (err) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	})
});

app.post('/login', async (req, res) => {
	let filter = {
		username: req.body.username,
		password: req.body.password
	}

	let foundUser = await userSchema.find(filter);

	let foundUserCount = Number(foundUser.length);

	if(foundUserCount == 1) {
		req.session.userId = foundUser[0].id;
		req.session.username = foundUser[0].username;
		req.session.password = foundUser[0].password;
		req.session.save(function (err) {
			if(err) {
				console.log(err);
			} else {
				res.redirect('/overview');
			}
		})

	} else {

	}

});

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

app.post('/showSingleOrder', async (req, res) => {
	let id = req.body.orderId;

	let order = await orderHeaderSchema.findOne({customId: id});

	let orderItemsId = order.orderItemId;

	let orderItems = [];

	for(let i = 0; i < orderItemsId.length; i++) {
		let orderItem = await orderItemSchema.findOne({customId: orderItemsId[i]});
		orderItems.push(orderItem);
	}

	res.render('order/listOrder', {order, orderItems});
});

app.post('/showSingleOrderToDelete', async (req, res) => {
	let id = req.body.orderId;

	let order = await orderHeaderSchema.findOne({customId: id});

	let orderItemsId = order.orderItemId;

	let orderItems = [];

	for(let i = 0; i < orderItemsId.length; i++) {
		// console.log("loop 1 " + i);
		let orderItem = await orderItemSchema.findOne({customId: orderItemsId[i]});
		// console.log("loop 2 " + i);
		// console.log(orderItem);
		orderItems.push(orderItem);
	}
	// console.log(orderItemsId);
	// console.log(orderItemsId.length);
	// console.log(orderItems);

	res.render('order/deleteOrderItem', {order, orderItems});
});

app.post('/deleteOrderItem', async (req, res) => {
	let itemFilter = {
		customId: Number(req.body.orderItemId)
	}

	await orderItemSchema.deleteOne(itemFilter);
	
	let headerFilter = {
		customId: Number(req.body.orderId)
	}

	let changingHeader = await orderHeaderSchema.findOne(headerFilter);

	let deletedItemId = req.body.orderItemId;

	if(changingHeader.orderItemId.includes(deletedItemId)){
		for(var i = 0; i < changingHeader.orderItemId.length; i++) {
			if(changingHeader.orderItemId[i] == deletedItemId){
				changingHeader.orderItemId.splice(i, 1);
			}
		}
	}

	let update = {
		orderItemId: changingHeader.orderItemId
	};

	await orderHeaderSchema.findOneAndUpdate(headerFilter, update, {
		new: false
	});

	let id = req.body.orderId;

	let order = await orderHeaderSchema.findOne({customId: id});

	let orderItemsId = order.orderItemId;

	let orderItems = [];

	for(let i = 0; i < orderItemsId.length; i++) {
		let orderItem = await orderItemSchema.findOne({customId: orderItemsId[i]});
		orderItems.push(orderItem);
	}

	res.render('order/deleteOrderItem', {order, orderItems});
});

app.post('/confirmOrder', async (req, res) => {
	// TODO: Get all order items. 
	// TODO: For every oder item get its product number and the amount. 
	let itemCustomId = req.body.itemCustomId;
	let itemProductId = req.body.itemProductId;
	let itemProduct_amount = req.body.itemProduct_amount;
	let orderId = req.body.orderId;
	console.log("orderId");
	console.log(orderId);

	// TODO: Find the product with the product number, subtract the amount from 
	// the item stock and update the product.
	if(Array.isArray(itemProductId) == false) {
		let productFilter = {
			customId: itemProductId
		}
		
		// let updatedProduct = await productSchema.find(productFilter);
		// console.log(updatedProduct);
		
		let currentProductAmount = 0;
		let amountToSubtract = Number(itemProduct_amount);
		let updatedProductAmount = 0;
		let productUpdate = {
			stock_amount: 0
		};
		
		for(let i = 0; i < updatedProduct.length; i++) {
			currentProductAmount = updatedProduct[i].stock_amount;
			updatedProductAmount = currentProductAmount - amountToSubtract;
			productUpdate.stock_amount = updatedProductAmount;
			// await productSchema.findOneAndUpdate(productFilter, productUpdate, {
			// 		new: false
			// });
		}
			
		let orderHeaderFilter = {
			customId: orderId
		}
		let orderHeaderUpdate = {
			state: "Confirmed"
		}
		// await orderHeaderSchema.findOneAndUpdate(orderHeaderFilter, orderHeaderUpdate, {
		// 	new: false
		// });

	} else {
		let orderItemAmount = itemProductId.length;
		console.log("OrderItemAmount " + orderItemAmount);
		for(let i = 0; i < orderItemAmount; i++) {
			let productFilter = {
				customId: itemProductId[i]
			}

			let productToUpdate = await productSchema.find(productFilter);
			console.log("Updated Product");
			console.log(productToUpdate);

			let currentProductAmount = 0;
			let amountToSubtract = Number(itemProduct_amount[i]);
			let updatedProductAmount = 0;
			let productUpdate = {
				stock_amount: 0
			};

			for(let j = 0; j < productToUpdate.length; j++) {
				currentProductAmount = productToUpdate[j].stock_amount;
				console.log("currenProductAmount " + currentProductAmount);
				updatedProductAmount = currentProductAmount - amountToSubtract;
				productUpdate.stock_amount = updatedProductAmount;
				await productSchema.findOneAndUpdate(productFilter, productUpdate, {
						new: false
				});
			}

			let orderHeaderFilter = {
				customId: orderId[i]
			}
			let orderHeaderUpdate = {
				state: "Confirmed"
			}
			await orderHeaderSchema.findOneAndUpdate(orderHeaderFilter, orderHeaderUpdate, {
				new: false
			});
		}
	}
	res.render('order/order');
});
	
// Schritt 9 - Den Server port setzen
				var port = process.env.PORT || '3000'
app.listen(port, err => {
	if (err)
		throw err
	console.log('Server listening on port', port)
})

// reduce

