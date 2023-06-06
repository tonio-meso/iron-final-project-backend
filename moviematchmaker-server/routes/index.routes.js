const express = require("express");
const router = express.Router();
const isAuthenticated = require("./../middleware/isAuthenticated");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// here is the schema for all the road i'm gonna use

router.use(isAuthenticated);
router.use("/allgenres", require("./../routes/genremovies"));
router.use("/allmovies", require("./../routes/allmovies"));
router.use("/auth", require("./auth.routes.js"));
router.use("/form", require("./../routes/prefform"));

//need to be log here for this part

module.exports = router;
