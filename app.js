const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const app = express();


    // Register `hbs.engine` with the Express app.
    app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');

    // Body-Parser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

// ### Middlewares End ###

// Getting Models
const movies = require('./models/Movie');
const Movie = mongoose.model('movies');

// Connecting Server
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:12345@ds151951.mlab.com:51951/movie-dev')
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
   Movie.find({})
    .sort({date:'desc'})
    .then(movie => {
        res.render('index', { movie: movie })
    })
});

// New Movie To DB
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

// Editting Form
app.post('/:id', (req, res) => {
    Movie.findOne({ _id: req.params.id })
        .then(Movie => {
            res.render('edit', { Movie: Movie })
        })
});

// Edit Saving Changes
app.post('/edit/:id', (req, res, body) => {
    Movie.findOne({ _id: req.params.id })
        .then(Movie => {
            // new values
            Movie.movieName = req.body.movieName;
            Movie.movieDetails = req.body.movieDetails;
            Movie.movieIMG = req.body.movieIMG;
  
            Movie.save()
            res.redirect('/')
        });
});

// Delete Movie
app.post('/delete/:id', (req, res) => {
    Movie.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/');
        });
});

app.get('/movies/:movie', (req, res) => {
    
    let url = "http://www.omdbapi.com/?t="+req.params.movie+"&apikey=883b584c";

    rp(url).then((url) => {

    let value = JSON.parse(url)
    console.log(value);
    let data = {
     Title      : value.Title,
     Year       : value.Year,
     Released   : value.Released,   
     Genre      : value.Genre,
     Director   : value.Director,
     Plot       : value.Plot,
     imdbRating : value.imdbRating,
     Poster     : value.Poster,
     imdbID     : value.imdbID
        }

        res.render('movies', data);


    })
    .catch(function (err) {
        console.log('Houston we got a problem');
        res.redirect('/');
    });


   
});




// Initilazing Server
const port = 80;

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});