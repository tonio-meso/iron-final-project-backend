const { model, Schema } = require("mongoose");

const PrefMovieCollectionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  preferred_genres: [
    {
      type: Schema.Types.ObjectId,
      ref: "GenreMovie",
    },
  ],
  year_preferences: String,
});

const PrefMovieCollection = model(
  "PrefMovieCollection",
  PrefMovieCollectionSchema
);

module.exports = PrefMovieCollection;
