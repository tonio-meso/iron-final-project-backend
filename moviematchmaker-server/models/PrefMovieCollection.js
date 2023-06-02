const { model, Schema } = require("mongoose");

const PrefMovieCollectionSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
});

const PrefMovieCollection = model(
  "PrefMovieCollection",
  PrefMovieCollectionSchema
);

module.exports = Movie;
