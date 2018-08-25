// expose our config directly to our application using module.exports
module.exports = {

    'googleAuth' : {
        'clientID'         : '1072302891379-mg40i4sjd61bqscnbtan01u601c9cjaa.apps.googleusercontent.com',
        'clientSecret'     : 'zIj9MKyYD7tw_MmpOdqawvex',
        'callbackURL'      : 'https://obscure-basin-14975.herokuapp.com/api/user/auth/google/callback'
    },

    'twitterAuth' : {
        'consumerKey'        : 'EmkP37hUDfu40NqAxNMjr06aK',
        'consumerSecret'     : 'bksKIUjDdBMeApWKzyAKppiFKwnfRDdSjX9BM6YwgbNmxuLRkh',
        'callbackURL'        : 'https://obscure-basin-14975.herokuapp.com/api/user/auth/twitter/callback'
    },

    'facebookAuth' : {
        'clientID'        : '228922504405036', // your App ID
        'clientSecret'    : 'b6c983332bfbbf6f54773ae264a58e4e', // your App Secret
        'callbackURL'     : 'https://obscure-basin-14975.herokuapp.com/api/user/auth/facebook/callback',
        'profileURL'      : 'https://www.facebook.com/chaitanya.vanapalli.9',
        'profileFields'   : ['id', 'email', 'name'] // For requesting permissions from Facebook API

    }

};