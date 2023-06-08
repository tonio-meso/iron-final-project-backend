const router = require("express").Router();
const GenreMovie = require("./../models/GenreMovieModel");

// here a simple get to display the movies genres for the form to fill
router.get("/", async (req, res, next) => {
  try {
    const allgenres = await GenreMovie.find();
    res.json(allgenres);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
