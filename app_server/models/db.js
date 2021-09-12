const mongoose = require('mongoose');
const dbURL = 'mongodb://localhost/BOOKSTORE';
mongoose.connect(dbURL, {useNewUrlParser: true});
mongoose.connection.on('connected',() => {
    console.log(`Mongoose connected to ${dbURL}`);
});
mongoose.connection.on('error', err => {
    console.log('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () =>{
    console.log('Mongoose disconnected');
});

require('./books');