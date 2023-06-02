const { model, Schema } = require("mongoose");

const PrefMovieCollectionSchema = new Schema({});

const PrefMovieCollection = model(
  "PrefMovieCollection",
  PrefMovieCollectionSchema
);

module.exports = Movie;
