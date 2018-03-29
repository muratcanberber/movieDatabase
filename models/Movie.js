const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Movie = new Schema({
    movieName: {
        type: String,
        required: true
    },
    movieDetails: {
        type: String,
        required: true
    },   
    movieIMG: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('movies', Movie);
module.exports = Movie;

