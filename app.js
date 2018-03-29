const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();

//Middlewares
// Register `hbs.engine` with the Express app.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Body-Parser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Middlewares End


//Routes
app.get('/', (req, res) => {
   Movie.find({})
    .sort({date:'desc'})
    .then(movie =>{
        res.render('index', 
    {
        movie: movie
    })
    })

});



//Getting Model
const movies = require('./models/Movie');
const Movie = mongoose.model('movies');

//Connecting Server
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:12345@ds151951.mlab.com:51951/movie-dev')
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));



//Getting Form Body
app.post('/', (req, res, body) => {
    
    const newMovie = {
        movieName     : req.body.movieName,
        movieDetails  : req.body.movieDetails,
        movieIMG      : req.body.movieIMG
    }

    new Movie(newMovie)
        .save()
        .then(movies => {
            res.redirect('/');
        })



});

app.get('/:id', (req, res) => {


    Movie.findOne({ _id: req.params.id }, function (err, Movie) {
        if (err) {
            console.log("errr", err);
        } else {
        
        }

    }).then(Movie => {
        res.render('index', Movie);
    })



});





// Initilazing Server
const port = 3000;
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});

