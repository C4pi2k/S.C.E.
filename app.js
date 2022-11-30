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
// var testModel = require('./model/test');
var employeeSchema = require('./model/employee');
var customerSchema = require('./model/customer');
var productSchema = require('./model/product');
const { PRIORITY_ABOVE_NORMAL } = require('constants');
const { json } = require('body-parser');

//GET Methods
app.get('/', (req, res) => {
	res.render('welcome');
});

// GET EMPLOYEE START
app.get('/employee', (req, res) => {
	res.render('employee/employee');
});

app.get('/enterNewEmployee', (req, res) => {
	res.render('employee/enterNewEmployee');
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

app.get('/enterNewcustomer', (req, res) => {
	res.render('customer/enterNewcustomer');
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

app.get('/enterNewproduct', (req, res) => {
	res.render('product/enterNewproduct');
});

app.get('/listproduct', (req, res) => {
	let product = {};
	product = null;
	res.render('product/listproduct', {custproductomer});
});

app.get('/listAllproduct', async (req, res) => {
	let filter = {};
	let allProduct = await productSchema.find(filter);
	res.render('product/listAllproduct', {allProduct});
});

app.get('/editproduct', (req, res) => {
	let product = {};
	product = null;
	res.render('product/editproduct', {product});
});

app.get('/deleteproduct', (req, res) => {
	res.render('product/deleteproduct');
});
// GET PRODUCT END

// 8 - POST Methods
// POST EMPLOYEE START
app.post('/uploadNewEmployee', upload.single('employee'), (req, res) => {
	
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

	// console.log(id);

	let employee = await employeeSchema.findOne({customId: id});

	console.log(employee);

	res.render('employee/listEmployee', {employee});
});

app.post('/showEditableEmployee', async (req, res) => {
	let id = req.body.employeeId;

	// console.log(id);

	let employee = await employeeSchema.findOne({customId: id});

	console.log(employee);

	res.render('employee/editEmployee', {employee});
});

app.post('/showSingleEmployeeToEdit', async (req, res) => {
	let id = req.body.employeeId;

	console.log(id);

	let employee = await employeeSchema.findOne({customId: id});

	// console.log(employee);

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

	console.log(id);
	console.log(name);

	let updateEmployee = await employeeSchema.findOneAndUpdate(filter, update, {
		new: false
	});

	// console.log(id);

	// let employee = await employeeSchema.deleteOne({customId: id});

	// console.log(employee);

	res.redirect('/employee');
});

app.post('/deleteEmployee', async (req, res) => {
	let id = req.body.employeeId;

	// console.log(id);

	let employee = await employeeSchema.deleteOne({customId: id});

	console.log(employee);

	res.redirect('/employee');
});

// POST EMPLOYEE END
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
// POST CUSTOMER START

app.post('/uploadNewCustomer', upload.single('customer'), (req, res) => {
	
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

	// console.log(id);

	let customer = await customerSchema.findOne({customId: id});

	// console.log(customer);

	res.render('customer/listCustomer', {customer});
});

app.post('/showEditableCustomer', async (req, res) => {
	let id = req.body.customerId;

	// console.log(id);

	let customer = await customerSchema.findOne({customId: id});

	// console.log(customer);

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

	console.log(id);
	console.log(name);

	let updateCustomer = await customerSchema.findOneAndUpdate(filter, update, {
		new: false
	});

	// console.log(id);

	// let employee = await employeeSchema.deleteOne({customId: id});

	// console.log(employee);

	res.redirect('/customer');
});

app.post('/deleteCustomer', async (req, res) => {
	let id = req.body.customerId;

	// console.log(id);

	let customer = await customerSchema.deleteOne({customId: id});

	console.log(customer);

	res.redirect('/customer');
});

// POST CUSTOMER END
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
// POST PRODUCT START

app.post('/uploadNewProduct', upload.single('product'), (req, res) => {
	
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

// POST PRODUCT END

//Beispiel Auflistung einzeln / alle
// app.post('/back', async (req, res) => {
	// 	let user = await userModel.findById(req.session.userid).exec();
	
	// 	let images = await imageModel.find({userID: req.session.userid}).exec();
	
	// 	let texts = await textModel.find({userID: req.session.userid}).exec();
	
	// 	res.render('profile', {user: user, images: images, texts: texts});
	// })

// Beispiel für Create
// app.post('/register', upload.single('user'), (req, res) => {

	//     var today = new Date();
	
	//     var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	
	// 	var userObj = {
		//         email: req.body.email,
// 		username: req.body.username,
// 		password: req.body.password,
//         joindate: date,
// 		totpDone: false,
// 		secret: '',
//         profileImg:
//         {
	//             data: null,
	//             contentType: date
	//         }
	// 	}
	// 	userModel.create(userObj, (err) => {
		// 		if (err) {
			// 			console.log(err);
			// 		}
			// 		else {
// 			res.redirect('/');
// 		}
// 	});
// });

	
	
	//Beispiel Änderung von Daten
	// app.post('/changeProfilePicture', upload.single('image'), async (req, res) => {
		
		// 	let userId = req.session.userid;
		
		// 	console.log(req.file);

		// 	let data = fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename));
		
		// 	let update = {profileImg:{
			// 		data: data,
			// 		contentType: req.file.mimetype
			// 	}}
			
			// 	let user = await userModel.findOneAndUpdate(userId, update, {
				// 		new: true
				// 	});
				
				// 	//let user = await userModel.findOne({ username: req.session.username, password: req.session.password});
				// 	let images = await imageModel.find({userID: req.session.userid}).exec();
				// 	let texts = await textModel.find({userID: req.session.userid}).exec();
				
				// 	res.render('profile', {user: user, images: images, texts: texts});
				// })
				
				// app.post('/test', upload.single('test'), (req, res) => {
				
				// 	// let localTestString = req.body.randomString;
				
				// 	testObj = {
				// 		testString: req.body.randomString
				// 	}
				
				// 	testModel.create(testObj, (err) => {
				// 		if(err) {
				// 			// console.log('help');
				// 			console.log(err);
				// 		} else {
				// 			console.log(testObj.testString);
				// 			res.redirect('/');
				// 		}
				// 	});
				// });
				
				
				// Schritt 9 - Den Server port setzen
				var port = process.env.PORT || '3000'
app.listen(port, err => {
	if (err)
		throw err
	console.log('Server listening on port', port)
})

// reduce

