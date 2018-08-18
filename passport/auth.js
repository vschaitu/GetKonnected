// expose our config directly to our application using module.exports
module.exports = {

    'googleAuth' : {
        'clientID'         : '1072302891379-mg40i4sjd61bqscnbtan01u601c9cjaa.apps.googleusercontent.com',
        'clientSecret'     : 'zIj9MKyYD7tw_MmpOdqawvex',
        'callbackURL'      : 'http://localhost:8080/api/user/auth/google/callback'
    },

    'twitterAuth' : {
        'consumerKey'        : 'EmkP37hUDfu40NqAxNMjr06aK',
        'consumerSecret'     : 'bksKIUjDdBMeApWKzyAKppiFKwnfRDdSjX9BM6YwgbNmxuLRkh',
        'callbackURL'        : 'https://obscure-basin-14975.herokuapp.com/api/user/auth/twitter/callback'
    }

};