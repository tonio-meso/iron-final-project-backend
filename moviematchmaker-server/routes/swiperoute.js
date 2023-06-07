const router = require("express").Router();
// const mongoose = require("mongoose");
// const Movie = require("./../models/MovieModel");
const UserSwipe = require("./../models/SwipeModel");

router.post("/", async (req, res, next) => {
  try {
    const { movieId, swipe } = req.body;
    const { _id: userId } = req.user; // Extract the user's ID from req.user

    console.log(
      `Processing ${swipe} action for user: ${userId} on movie: ${movieId}`
    );

    let userSwipe = await UserSwipe.findOne({ userId });
    console.log("UserSwipe found:", userSwipe);

    if (!userSwipe) {
      console.log("No UserSwipe found, creating a new one...");
      userSwipe = new UserSwipe({ userId });
    }

    userSwipe[swipe].push(movieId);
    console.log(`Added movieId to ${swipe}: `, userSwipe[swipe]);

    await userSwipe.save();
    console.log("UserSwipe saved successfully");

    res.status(201).send();
  } catch (error) {
    console.error(
      `Error processing ${swipe} action for user: ${userId} on movie: ${movieId}`
    );
    next(error);
  }
});

module.exports = router;
