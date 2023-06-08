const router = require("express").Router();
const PrefMovieCollection = require("../models/PrefMovieCollection");
const UserSwipe = require("../models/SwipeModel");
const Movie = require("../models/MovieModel");

// route here to get random movies based on pref from the user
router.get("/", async (req, res, next) => {
  console.log("req.user:", req.user);
  const userId = req.user._id;
  try {
    // Fetch user preferences
    const userPref = await PrefMovieCollection.findOne({ user: userId });

    if (!userPref) {
      return res.status(404).json({ message: "User preferences not found" });
    }

    // Fetch movies based on preferred genres
    let genreMovies = await Movie.find({
      genre_ids: { $in: userPref.preferred_genres },
    });

    // Fetch user swipes
    let userSwipes = await UserSwipe.findOne({ userId });

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
    // condition into mongoooo to find documents where the userId field is not equal to the given userId
    let superLikedMoviesIds = await UserSwipe.find({
      userId: { $ne: userId },
    }).distinct("superlikes");

    // Filter out the movies from genreMovies that are in superLikedMovies
    let superLikedMovies = genreMovies.filter((movie) =>
      superLikedMoviesIds.includes(movie._id)
    );

    let recommendedMovies;
    let message;
    if (superLikedMovies.length >= 10) {
      // Choose 10 random movies from superLikedMovies
      recommendedMovies = chooseRandom(superLikedMovies, 10);
      message = "Here are 10 movies based on user preference";
    } else {
      // Choose 10 random movies from genreMovies
      recommendedMovies = chooseRandom(genreMovies, 10);
      message = "Here are 10 random movies";
    }

    res.json({ message, recommendedMovies });
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
