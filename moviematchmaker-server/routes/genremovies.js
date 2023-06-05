const router = require("express").Router();
const GenreMovie = require("./../models/GenreMovieModel");

router.get("/", async (req, res, next) => {
  try {
    const allgenres = await GenreMovie.find();
    res.json(allgenres);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
