// require express
var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
//mongoose 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');
// create the express app
var app = express();
var bodyParser = require('body-parser');
// use it!
app.use(bodyParser.urlencoded({ extended: true }));
// MiddleWare: Session and Flash 
var session = require('express-session');
app.use(session({
	secret: 'cam_god',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
const flash = require('express-flash');
app.use(flash());
// static content
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// // Get sockets
// const server = app.listen(8000);
// const io = require('socket.io')(server);
// var counter = 0;

// io.on('connection', function (socket) { //2
// 	  //Insert SOCKETS 
// });


var QuoteSchema = new mongoose.Schema({
	name: {type: String, required: true},
	quote: {type: String, required: true}
}, {timestamps: true})
mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote')

// // ...delete all records of the User Model
// User.deleteMany({}, function(err){
// 	// This code will run when the DB has attempted to remove all matching records to {}
//    })

// root route to render the index.ejs view
app.get('/', function(req, res) {
	res.render("index")
})
// post route for adding a user
app.post('/quote-post', function(req, res) {
	console.log("POST DATA", req.body);
	var quote = new Quote({name: req.body.name, quote: req.body.quote});
	quote.save(function(err){
		if (err) {
			console.log("Error creating")
			for (var key in err.errors) {
				req.flash('reg', err.errors[key].message);
			}
			res.redirect('/')
		}else {
			console.log("Successfuly added quote")
			res.redirect('/quotes')
		}
	})
})
app.get('/quotes', function(req, res) {
	Quote.find({}, null, {sort: '-_id'}, function(err, quotes_array) {
		if (err) {
			console.log("Error finding all quotes")
			res.render("quotes", {err: err})
		} else {
			console.log(quotes_array)
			res.render("quotes", {quotes: quotes_array} )
		}
	})
})

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(request, response){
	response.send("404")
});

// tell the express app to listen on port 8000
app.listen(8000, function() {
 console.log("listening on port 8000");
});