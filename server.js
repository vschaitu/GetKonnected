const express = require("express")
const bodyParser = require("body-parser")
const morgan = require('morgan')
const session = require('express-session')
const dbConnection = require('./database')
const MongoStore = require('connect-mongo')(session)
const passport = require('./passport')
const routes = require("./routes");
const app = express()
const PORT = process.env.PORT || 8080


// Define middleware here
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sessions
app.use(
	session({
		secret: 'mountain-lion', //pick a random string to make the hash that is generated secure
		store: new MongoStore({ mongooseConnection: dbConnection }),
		resave: false, //required
		saveUninitialized: false //required
	})
)

// var cors = require('cors');
// app.use(cors())

// Passport
app.use(passport.initialize())

// calls the deserializeUser
app.use(passport.session())

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
}

//routes
app.use(routes)

const server = require('http').Server(app)
const io = module.exports.io = require('socket.io')(server)
const SocketManager = require('./SocketManager')
io.on('connection', SocketManager)

// Start the API server
server.listen(PORT, function () {
	console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
