//Connect to Mongo database
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

//your local database url
//27017 is the default mongoDB port
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/getconnected";

mongoose.connect(MONGODB_URI).then(
    () => { 
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ 
        console.log('Connected to Mongo');
    },
    err => {
         /** handle initial connection error */ 
         console.log('error connecting to Mongo: ')
         console.log(err);
        }
  );

module.exports = mongoose.connection