const { Schema, model } = require("mongoose");

const userSwipeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
      unique: true,
    },
    likes: [{ type: Number, ref: "Movie" }],
    dislikes: [{ type: Number, ref: "Movie" }],
    superlikes: [{ type: Number, ref: "Movie" }],
    unwatched: [{ type: Number, ref: "Movie" }],
  },
  {
    timestamps: true,
  }
);
// this Static methods is functions directly available on the model itself rather than on in instance
userSwipeSchema.statics.getSwipedMovies = async function (userId) {
  //  find a document in the UserSwipe collection that matches the given userId
  const swipe = await this.findOne({ userId });

  if (!swipe) {
    // If there are no records for the user yet, return an empty array
    return [];
  }

  // Collect all movie ids from the likes, dislikes, superlikes, unwatched fields
  const swipedMovieIds = [
    ...swipe.likes,
    ...swipe.dislikes,
    ...swipe.superlikes,
    ...swipe.unwatched,
  ];

  return swipedMovieIds;
};

const UserSwipe = model("UserSwipe", userSwipeSchema);

module.exports = UserSwipe;
