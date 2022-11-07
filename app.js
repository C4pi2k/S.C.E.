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
var testModel = require('./model/test');
const { PRIORITY_ABOVE_NORMAL } = require('constants');
const { json } = require('body-parser');

// 7 - GET Methods
app.get('/', (req, res) => {
	req.
	res.render('welcome');
});

app.post('/test', upload.single('test'), (req, res) => {

	// let localTestString = req.body.randomString;

	testObj = {
		testString: req.body.randomString
	}

	testModel.create(testObj, (err) => {
		if(err) {
			// console.log('help');
			console.log(err);
		} else {
			console.log(testObj.testString);
			res.redirect('/');
		}
	});
});


// 8 - POST Methods

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

//Beispiel Auflistung einzeln / alle
// app.post('/back', async (req, res) => {
// 	let user = await userModel.findById(req.session.userid).exec();

// 	let images = await imageModel.find({userID: req.session.userid}).exec();

// 	let texts = await textModel.find({userID: req.session.userid}).exec();

// 	res.render('profile', {user: user, images: images, texts: texts});
// })


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



// Schritt 9 - Den Server port setzen
var port = process.env.PORT || '3000'
app.listen(port, err => {
	if (err)
		throw err
	console.log('Server listening on port', port)
})

// reduce

