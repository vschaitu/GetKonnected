const User = require('../database/models/user')
const FacebookStrategy  = require('passport-facebook').Strategy;

const configAuth = require('./auth');

const strategy = new FacebookStrategy({

    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    // profileURL: configAuth.facebookAuth.profileURL,
    profileFields: configAuth.facebookAuth.profileFields

},
function(req, token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

        console.log("Facebook auth entry point!",profile)
        console.log("Facebook auth entry point2!",req.user)

        // check if the user is already logged in
        if (!req.user) {

            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if there is a user id already but no token (user was linked at one point and then removed)
                    if (!user.facebook.token) {
                        user.facebook.token = token;
                        user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                        user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                        user.save(function(err) {
                            if (err)
                                return done(err);
                                
                            return done(null, user);
                        });
                    }

                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create them
                    var newUser            = new User();

                    newUser.facebook.id    = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

                    newUser.save(function(err) {
                        if (err)
                            return done(err);
                            
                        return done(null, newUser);
                    });
                }
            });

        } else {
            // user already exists and is logged in, we have to link accounts
            var user            = req.user; // pull the user out of the session

            user.facebook.id    = profile.id;
            user.facebook.token = token;
            user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
            user.facebook.email = (profile.emails[0].value || '').toLowerCase();

            user.save(function(err) {
                if (err)
                    return done(err);
                    
                return done(null, user);
            });

        }
    });
})

module.exports = strategy