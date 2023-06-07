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

const UserSwipe = model("UserSwipe", userSwipeSchema);

module.exports = UserSwipe;
