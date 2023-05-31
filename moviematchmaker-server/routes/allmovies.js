const router = require("express").Router();
const Movie = require("./../models/MovieModel");

router.get("/", async (req, res, next) => {
  try {
    const allmovies = await Movie.find();
    res.json(allmovies);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
