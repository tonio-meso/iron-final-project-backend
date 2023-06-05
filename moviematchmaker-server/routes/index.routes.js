const express = require("express");
const router = express.Router();
const isAuthenticated = require("./../middleware/isAuthenticated");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// here is the schema for all the road i'm gonna use

// router.use("/user", require("./../routes/user.route"));
router.use(
  "/preference_collection",
  require("./../routes/preference_collection")
);

router.use("/allgenres", require("./../routes/genremovies"));
router.use("/allmovies", require("./../routes/allmovies"));
router.use("/form", require("./../routes/prefform"));

router.use("/auth", require("./auth.routes.js"));

// router.use(isAuthenticated);
//need to be log here for this part

module.exports = router;
