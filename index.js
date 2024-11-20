const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Movie = require('./models/movie');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/movieSite', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


mongoose.connect('mongodb://localhost/movieSite', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Routes

// Home route to view all movies
app.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.render('index', { movies });
  } catch (err) {
    console.log(err);
    res.send('Error fetching movies');
  }
});

// Add movie form
app.get('/add', (req, res) => {
  res.render('add_movie');
});

// Add new movie
app.post('/add', async (req, res) => {
  const { name, description, price, image } = req.body;
  
  try {
    const newMovie = new Movie({ name, description, price, image });
    await newMovie.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.send('Error adding movie');
  }
});

// Edit movie form
app.get('/edit/id', async (req, res) => {
  const movie = await Movie.findById(req.id);
  res.render('edit_movie', { movie });
});

// Update movie details
app.post('/edit/id', async (req, res) => {
  const { name, description, price, image } = req.body;
  
  try {
    await Movie.findByIdAndUpdate(req.id, 
      { name, description, price, image }
      );
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.send('Error updating movie');
  }
});

// Delete movie
app.get('/delete/id', async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.id);
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.send('Error deleting movie');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on${PORT}`);
});
