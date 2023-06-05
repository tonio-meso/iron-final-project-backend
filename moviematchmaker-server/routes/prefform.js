const router = require("express").Router();
const PrefMovieCollection = require("./../models/PrefMovieCollection");

router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.user);
    // Create a new PrefMovieCollection document with the data from the request body
    const newPrefMovieCollection = new PrefMovieCollection({
      user: req.body.userId,
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
