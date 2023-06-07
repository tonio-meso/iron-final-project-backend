const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const PrefMovieCollection = require("../models/PrefMovieCollection");
const UserSwipe = require("../models/UserSwipe");
const Movie = require("../models/Movie");

router.get("/:userId", async (req, res, next) => {
  const userId = mongoose.Types.ObjectId(req.params.userId);

  try {
    // Fetch user preferences
    const userPref = await PrefMovieCollection.findOne({ user: userId });

    if (!userPref) {
      return res.status(404).json({ message: "User preferences not found" });
    }

    // Fetch movies based on preferred genres
    const genreMovies = await Movie.find({
      genre_ids: { $in: userPref.preferred_genres },
    });

    // Fetch user swipes
    const userSwipes = await UserSwipe.findOne({ userId });

    // If userSwipes is null, initialize it as an empty object
    userSwipes = userSwipes || {
      likes: [],
      dislikes: [],
      superlikes: [],
      unwatched: [],
    };

    // Combine all movie IDs from user swipes
    const userSwipedMovieIds = [
      ...userSwipes.likes,
      ...userSwipes.dislikes,
      ...userSwipes.superlikes,
      ...userSwipes.unwatched,
    ];

    // Filter out the movies from genreMovies that user has already rated
    genreMovies = genreMovies.filter(
      (movie) => !userSwipedMovieIds.includes(movie._id)
    );

    // Fetch super liked movies ids by other users
    const superLikedMoviesIds = await UserSwipe.find({
      userId: { $ne: userId },
    }).distinct("superlikes");

    // Filter out the movies from genreMovies that are in superLikedMovies
    let superLikedMovies = genreMovies.filter((movie) =>
      superLikedMoviesIds.includes(movie._id)
    );

    let recommendedMovies;
    if (superLikedMovies.length >= 10) {
      // Choose 10 random movies from superLikedMovies
      recommendedMovies = chooseRandom(superLikedMovies, 10);
    } else {
      // Choose 10 random movies from genreMovies
      recommendedMovies = chooseRandom(genreMovies, 10);
    }

    res.json(recommendedMovies);
  } catch (error) {
    console.error("Error occurred:", error);
    next(error);
  }
});

// function to choose n random items from an array
function chooseRandom(arr, n) {
  const result = [];
  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    result.push(arr[randomIndex]);
    arr.splice(randomIndex, 1); // remove the item from the array
  }
  return result;
}

module.exports = router;
