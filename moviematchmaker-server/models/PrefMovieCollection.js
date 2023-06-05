const { model, Schema } = require("mongoose");

const PrefMovieCollectionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // prevent a same user to post several time
  },
  preferred_genres: [{ type: Number }],
  year_preferences: String,
});

const PrefMovieCollection = model(
  "PrefMovieCollection",
  PrefMovieCollectionSchema
);

module.exports = PrefMovieCollection;
