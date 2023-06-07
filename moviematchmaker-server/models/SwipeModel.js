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

UserSwipeSchema.statics.getSwipedMovies = async function (userId) {
  const swipes = await this.find({ userId }).select("movieId");
  return swipes.map((swipe) => swipe.movieId);
};

const UserSwipe = model("UserSwipe", userSwipeSchema);

module.exports = UserSwipe;
