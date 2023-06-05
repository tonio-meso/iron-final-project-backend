const router = require("express").Router();
const Movie = require("./../models/MovieModel");

// get the list of 10 first movies from the db
router.get("/", async (req, res, next) => {
  try {
    const allmovies = await Movie.find().limit(10);
    res.json(allmovies);
  } catch (error) {
    next(error);
  }
});

router.get("/movie-picture", async (req, res, next) => {
  try {
    const movies = await Movie.find().limit(10);
    const formattedMovies = movies.map((movie) => ({
      _id: movie._id,
      title: movie.title,
      poster_path: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
    }));
    res.json(formattedMovies);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
