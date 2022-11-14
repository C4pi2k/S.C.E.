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
const { PRIORITY_ABOVE_NORMAL } = require('constants');
const { json } = require('body-parser');

// 7 - GET Methods
app.get('/', (req, res) => {
	res.render('welcome');
});

app.get('/employee', (req, res) => {
	res.render('employee');
});

app.get('/enterNewEmployee', (req, res) => {
	res.render('enterNewEmployee');
});

app.get('/listEmployee', (req, res) => {
	let employee = {};
	employee = null;
	res.render('listEmployee', {employee});
});

app.get('/listAllEmployees', (req, res) => {
	res.render('listAllEmployees');
});

app.get('/editEmployee', (req, res) => {
	res.render('editEmployee');
});

app.get('/deleteEmployee', (req, res) => {
	res.render('deleteEmployee');
});


// 8 - POST Methods
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
			res.render('/employee');
		}
	})
});

app.post('/showSingleEmployee', async (req, res) => {

	let id = req.body.employeeId;

	let employee = await employeeSchema.find({customId: id}).exec();

	res.render('listEmployee', {employee});
});


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

