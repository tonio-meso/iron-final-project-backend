const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

async function isAuthenticated(req, res, next) {
  try {
    console.log(req.header);
    let token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({ message: "no token found" });
    }
    token = token.replace("Bearer ", "");
    console.log(token);
    const payload = jwt.verify(token, process.env.TOKEN_SECRET, {
      algorithms: "HS256",
    });
    const user = await User.findById(payload._id);
    req.user = user;
    // the chek is ok go to the newt part
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = isAuthenticated;
