const router = require("express").Router();
const UserSwipe = require("./../models/SwipeModel");
const Movie = require("../models/MovieModel");

// here all thre route to allow user from the client to get the all movies collection and then update pref and delete movies

// display the collection of the user in the collection page
router.get("/", async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 movies per page if not provided

    const userSwipe = await UserSwipe.findOne({ userId });
    if (!userSwipe) {
      return res.status(404).json({ message: "User swipe not found" });
    }

    // Get the movie IDs based on the pagination parameters
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const movieIds = userSwipe.likes
      .concat(userSwipe.dislikes, userSwipe.superlikes, userSwipe.unwatched)
      .slice(startIndex, endIndex);

    // Fetch the movies using the movie IDs
    const movies = await Movie.find({ _id: { $in: movieIds } });

    // Create an object to store the swipe status for each movie
    const swipeStatusMap = {
      likes: userSwipe.likes.reduce((map, id) => {
        map[id] = true;
        return map;
      }, {}),
      dislikes: userSwipe.dislikes.reduce((map, id) => {
        map[id] = true;
        return map;
      }, {}),
      superlikes: userSwipe.superlikes.reduce((map, id) => {
        map[id] = true;
        return map;
      }, {}),
      unwatched: userSwipe.unwatched.reduce((map, id) => {
        map[id] = true;
        return map;
      }, {}),
    };

    // Map the movies and add the swipe status
    const moviesWithSwipeStatus = movies.map((movie) => {
      const swipeStatus = {
        likes: swipeStatusMap.likes[movie._id] || false,
        dislikes: swipeStatusMap.dislikes[movie._id] || false,
        superlikes: swipeStatusMap.superlikes[movie._id] || false,
        unwatched: swipeStatusMap.unwatched[movie._id] || false,
      };

      return { ...movie.toObject(), swipeStatus };
    });

    res.status(200).json(moviesWithSwipeStatus);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// update the preference for a movie
router.patch("/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const { swipeType } = req.body;
    const userId = req.user._id;
    console.log("Request Headers:", req.headers);

    console.log("Movie ID:", movieId);
    console.log("Swipe Type:", swipeType);
    console.log("User ID:", userId);

    const userSwipe = await UserSwipe.findOne({ userId });
    console.log("User Swipe:", userSwipe);

    if (!userSwipe) {
      console.log("User swipe not found");
      return res.status(404).json({ message: "User swipe not found" });
    }

    // Remove the movie from all swipe fields
    userSwipe.likes.pull(movieId);
    userSwipe.dislikes.pull(movieId);
    userSwipe.superlikes.pull(movieId);
    userSwipe.unwatched.pull(movieId);

    // Update the respective swipe field based on the swipe type
    switch (swipeType) {
      case "likes":
        console.log("Updating likes:", movieId);
        userSwipe.likes.push(movieId);
        break;
      case "dislikes":
        console.log("Updating dislikes:", movieId);
        userSwipe.dislikes.push(movieId);
        break;
      case "superlikes":
        console.log("Updating superlikes:", movieId);
        userSwipe.superlikes.push(movieId);
        break;
      case "unwatched":
        console.log("Updating unwatched:", movieId);
        userSwipe.unwatched.push(movieId);
        break;
      default:
        console.log("Invalid swipe type:", swipeType);
        return res.status(400).json({ message: "Invalid swipe type" });
    }

    await userSwipe.save();

    console.log("User swipe updated successfully");
    res.status(200).json({ message: "User swipe updated successfully" });
  } catch (error) {
    console.error("Error updating user swipe:", error);
    res.status(500).json({ error: "Failed to update user swipe" });
  }
});

// delete a movie from the collection
router.delete("/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    const userSwipe = await UserSwipe.findOne({ userId });
    if (!userSwipe) {
      return res.status(404).json({ message: "User swipe not found" });
    }

    // Remove the movie ID from the respective swipe fields
    userSwipe.likes = userSwipe.likes.filter((id) => id.toString() !== movieId);
    userSwipe.dislikes = userSwipe.dislikes.filter(
      (id) => id.toString() !== movieId
    );
    userSwipe.superlikes = userSwipe.superlikes.filter(
      (id) => id.toString() !== movieId
    );
    userSwipe.unwatched = userSwipe.unwatched.filter(
      (id) => id.toString() !== movieId
    );

    await userSwipe.save();

    res
      .status(200)
      .json({ message: "Movie deleted from user swipe collection" });
  } catch (error) {
    console.error("Error deleting movie from user swipe collection:", error);
    res
      .status(500)
      .json({ error: "Failed to delete movie from user swipe collection" });
  }
});

module.exports = router;
