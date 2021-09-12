const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    author: String,
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    reviewText: String,
    createOn: {
        type: Date,
        'default': Date.now
    }
});

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating:{
        type: Number,
        'default': 0,
        min: 1,
        max: 5
    },
    reviews:[reviewSchema]
});

mongoose.model('Book', bookSchema);