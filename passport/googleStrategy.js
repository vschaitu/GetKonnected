const User = require('../database/models/user')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const configAuth = require('./auth');

const strategy = new GoogleStrategy(
    {
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback: true
    },
    function (req, token, refreshToken, profile, done) {

        User.findOne({ 'google.id': profile.id }, function (err, user) {
            if (err)
                return done(err);

            if (user) {

                // if there is a user id already but no token (user was linked at one point and then removed)
                if (!user.google.token) {
                    user.google.token = token;
                    user.google.name = profile.displayName;
                    user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                    user.save(function (err) {
                        if (err)
                            return done(err);

                        // return done(null, user);
                    });
                }

                return done(null, user);
                
            } else {
                var newUser = new User();

                newUser.google.id = profile.id;
                newUser.google.token = token;
                newUser.google.name = profile.displayName;
                newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                newUser.save(function (err) {
                    if (err)
                        return done(err);

                    return done(null, newUser);
                });
            }
        });
    }
)

module.exports = strategy