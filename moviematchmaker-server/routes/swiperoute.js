const router = require("express").Router();
// const mongoose = require("mongoose");
// const Movie = require("./../models/MovieModel");
const UserSwipe = require("./../models/SwipeModel");

router.post("/swipe", async (req, res, next) => {
  try {
    const { userId, movieId, swipe } = req.body;
    const userSwipe =
      (await UserSwipe.findOne({ userId })) || new UserSwipe({ userId });

    userSwipe[swipe].push(movieId);

    await userSwipe.save();
    res.status(201).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
