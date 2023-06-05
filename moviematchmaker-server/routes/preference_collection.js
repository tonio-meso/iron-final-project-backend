const router = require("express").Router();
const PrefMovieCollection = require("./../models/PrefMovieCollection");

// // post preference collection
// router.post("/", async (req, res, next) => {
//   try {
//     const { user, genre_ids, languages_pref, year_preferences } = req.body;
//     // here i'm gonna map the genre_ids to an array of ObjectId
//     const preferred_genres = genre_ids.map((id) => mongoose.Types.ObjectId(id));
//     const prefMovieCollection = new PrefMovieCollection({
//       user,
//       preferred_genres,
//       languages_pref,
//       year_preferences,
//     });

//     const newPrefMovieCollection = await prefMovieCollection.save();
//     res.status(201).json(newPrefMovieCollection);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to create PrefMovieCollection" });
//   }
// });

// module.exports = router;
