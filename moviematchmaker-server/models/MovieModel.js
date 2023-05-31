const { model, Schema } = require("mongoose");

const MovieSchema = new Schema({
  _id: {
    type: Number,
    required: true,
  },
  adult: Boolean,
  backdrop_path: String,
  genre_ids: [Number],
  original_language: String,
  original_title: String,
  overview: String,
  popularity: Number,
  poster_path: String,
  release_date: Date,
  title: String,
  video: Boolean,
  vote_average: Number,
  vote_count: Number,
});

const Movie = model("Movie", MovieSchema);

module.exports = Movie;
