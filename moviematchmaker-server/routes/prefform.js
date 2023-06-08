const router = require("express").Router();
const PrefMovieCollection = require("./../models/PrefMovieCollection");

// post request used by a user when is submit a form
router.post("/", async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    console.log("req.body.user", req.body.user);
    console.log(typeof req.body.user);
    console.log(req.body.preferred_genres.map((genre) => typeof genre));

    // Check if a document with the same user value already exists
    const existingPrefMovieCollection = await PrefMovieCollection.findOne({
      user: req.body.user,
    });

    if (existingPrefMovieCollection) {
      throw new Error("User has already submitted the form");
    }

    // check if userId is provided in the request
    if (!req.body.user) {
      throw new Error("User Id is required");
    }

    // check if preferred_genres is provided in the request and it's an array
    if (
      !req.body.preferred_genres ||
      !Array.isArray(req.body.preferred_genres)
    ) {
      throw new Error("Preferred genres should be an array");
    }

    // // Transform the array of string ids into an array of ObjectIds
    // const preferred_genres = req.body.preferred_genres.map((genre) =>
    //   mongoose.Types.ObjectId(genre)
    // );

    // Create a new PrefMovieCollection document with the data from the request body
    const newPrefMovieCollection = new PrefMovieCollection({
      user: req.body.user,
      preferred_genres: req.body.preferred_genres,
      year_preferences: req.body.year_preferences,
      isFormSubmitted: true, // Set isFormSubmitted to true for the new document
    });

    // Save the new document to the database
    const savedPrefMovieCollection = await newPrefMovieCollection.save();

    // Send the newly created document back in the response
    res.json(savedPrefMovieCollection);
  } catch (error) {
    next(error);
  }
});

// GET request to know the state of isFormSubmitted for a user
router.get("/", async (req, res) => {
  try {
    const form = await PrefMovieCollection.findOne({ user: req.user._id }); // Assuming you have implemented user authentication and have access to req.user._id
    if (form) {
      res.status(200).json({ isFormSubmitted: form.isFormSubmitted });
    } else {
      res.status(404).json({ message: "Form data not found" });
    }
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//  !!!!! GET am i still using this route?
router.get("/filtered-movies/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log("Incoming userId:", userId);

    // Cast userId to an ObjectId
    const userIdAsObjectId = new mongoose.Types.ObjectId(userId);

    // Check if the ObjectId is valid
    const isValid = mongoose.Types.ObjectId.isValid(userIdAsObjectId);
    console.log("Is ObjectId valid:", isValid);

    if (!isValid) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    console.log("userId as ObjectId:", userIdAsObjectId);

    const userPref = await PrefMovieCollection.findOne({
      user: userIdAsObjectId,
    });

    if (!userPref) {
      console.log(`No PrefMovieCollection document found for userId ${userId}`);
      res.status(404).json({ message: "User preferences not found" });
      return;
    }

    console.log("Found user preferences:", userPref);

    const preferredGenres = userPref.preferred_genres;
    console.log("Preferred genres:", preferredGenres);

    const movies = await Movie.find({
      genre_ids: { $in: preferredGenres },
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
