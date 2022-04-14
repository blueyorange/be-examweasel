const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
if (!jwtSecretKey) {
  console.log("ERROR! SECRET KEY NOT SET");
  throw new Error("Secret key not set");
}

module.exports = async (req, res, next) => {
  let _id;
  try {
    const token = req.get(tokenHeaderKey).split(" ")[1];
    _id = jwt.verify(token, jwtSecretKey)._id;
  } catch (err) {
    return res.status(401).send({ msg: `Unauthorised : Invalid token` });
  }
  if (_id) {
    const { username } = await User.findOne({ _id });
    req.user = { username };
    next();
  } else {
    return res.status(401).send({ msg: "Unauthorised : Invalid token" });
  }
};
