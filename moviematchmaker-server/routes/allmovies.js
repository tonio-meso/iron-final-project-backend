const router = require("express").Router();
const mongoose = require("mongoose");
const Movie = require("./../models/MovieModel");
const PrefMovieCollection = require("./../models/PrefMovieCollection");
const UserSwipe = require("./../models/SwipeModel");

// get the list of 10 first movies from the db
router.get("/", async (req, res, next) => {
  try {
    const allmovies = await Movie.find().limit(10);
    res.json(allmovies);
  } catch (error) {
    next(error);
  }
});

// get all the movies not used by the client
router.get("/movie-picture", async (req, res, next) => {
  try {
    const movies = await Movie.find();
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

// get the filtered movie used by the client just after he fill the form to get random movies
router.get("/filtered-movies", async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log("Incoming userId:", userId);

    // Cast userId to an ObjectId
    const userIdAsObjectId = new mongoose.Types.ObjectId(userId);
    console.log("userId as ObjectId:", userIdAsObjectId);
    console.log("Type of userIdAsObjectId:", typeof userIdAsObjectId);

    // Query with the userId as ObjectId
    const userPref = await PrefMovieCollection.findOne({
      user: userId,
    });

    // If userPref is null, it means that no document was found with the provided userId
    if (!userPref) {
      console.log(`No PrefMovieCollection document found for userId ${userId}`);
      res.status(404).json({ message: "User preferences not found" });
      return;
    }

    console.log("Found user preferences:", userPref);
    const preferredGenres = userPref.preferred_genres;
    console.log("Preferred genres:", preferredGenres);

    // Fetch the user's swiped movies
    // const swipedMovieIds = await UserSwipe.getSwipedMovies(userId);
    const swipedMovieIds = await UserSwipe.getSwipedMovies(userIdAsObjectId);

    // $nin operator to exclude movies that have IDs present in the swipedMovieIds array from mongo
    const movies = await Movie.find({
      genre_ids: { $in: preferredGenres },
      _id: { $nin: swipedMovieIds },
    }).limit(20);
    console.log("Found movies:", movies);

    const formattedMovies = movies.map((movie) => ({
      _id: movie._id,
      title: movie.title,
      poster_path: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
    }));

    console.log("Formatted movies:", formattedMovies);

    res.json(formattedMovies);
  } catch (error) {
    console.error("Error occurred:", error);
    next(error);
  }
});

module.exports = router;
