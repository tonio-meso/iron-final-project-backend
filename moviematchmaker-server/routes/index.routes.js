const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;

// here is the schema for all the road i'm gonna use

router.use("/allmovies", require("./../routes/allmovies"));
