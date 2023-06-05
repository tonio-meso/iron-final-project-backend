const router = require("express").Router();
const PrefMovieCollection = require("./../models/PrefMovieCollection");

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
    });

    // Save the new document to the database
    const savedPrefMovieCollection = await newPrefMovieCollection.save();

    // Send the newly created document back in the response
    res.json(savedPrefMovieCollection);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
