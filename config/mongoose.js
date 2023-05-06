const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/codial_development').then(() => {
    console.log('db connected');
}).catch(e => {
    console.log(e, 'db not conneted');
});

// const db = mongoose.connection;

// db.on('error', console.error.bind(console, "Error in connection to mongoDB"));

// db.once('open', function(){
//     console.log('connected to Database: mongoDb');
// });

// module.exports = db;