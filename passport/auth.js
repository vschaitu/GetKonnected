// expose our config directly to our application using module.exports
module.exports = {

    'googleAuth' : {
        'clientID'         : '1072302891379-mg40i4sjd61bqscnbtan01u601c9cjaa.apps.googleusercontent.com',
        'clientSecret'     : 'zIj9MKyYD7tw_MmpOdqawvex',
        'callbackURL'      : 'http://localhost:8080/user/auth/google/callback'
    },

    'twitterAuth' : {
        'consumerKey'        : 'cMBZ8PZvzQOC74n9KIIEyd0SC',
        'consumerSecret'     : 'STxJrvovkUbMNg4PaSWGq7yFJGU100b6UifUsLAeLLdbf5eqpn',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    }

};