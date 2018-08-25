const passport = require('passport')
const LocalStrategy = require('./localStrategy')
const GoogleStrategy = require('./googleStrategy')
const TwitterStrategy = require('./twitterStrategy')
const FacebookStrategy = require('./facebookStrategy')
const User = require('../database/models/user')


// called on login, saves the id to session req.session.passport.user = {id:'..'}
passport.serializeUser((user, done) => {
	done(null, { _id: user._id})
})

// user object attaches to the request as req.user
passport.deserializeUser((id, done) => {
	User.findOne(
		{ _id: id },
		(err, user) => {
			done(null, user)
		}
	)
})

//  Use Strategies 
passport.use(LocalStrategy)
passport.use(GoogleStrategy)
passport.use(TwitterStrategy)
passport.use(FacebookStrategy)

module.exports = passport
