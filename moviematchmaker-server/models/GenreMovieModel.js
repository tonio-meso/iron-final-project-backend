const { model, Schema } = require("mongoose");

const GenreMovieSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
});

const GenreMovie = model("GenreMovie", GenreMovieSchema);

module.exports = GenreMovie;
