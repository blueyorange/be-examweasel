const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send({ msg: "Please pass both username and password" });
  }
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
  });
  newUser
    .save()
    .then(() => {
      res.status(201).send({ msg: "new user created" });
    })
    .catch((err) => {
      if (err.errors.password) {
        return res.status(403).send({ msg: "password invalid" });
      } else if (err.errors.username) {
        return res.status(403).send({ msg: "username invalid" });
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ msg: "Bad request: username or password not supplied" });
  }
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.status(401).send({ msg: "User not found." });
      } else {
        user.comparePassword(password, (err, isMatch) => {
          if (isMatch && !err) {
            var token = jwt.sign(user.toObject(), process.env.JWT_SECRET_KEY);
            res.status(200).send({ token: `JWT ${token}` });
          } else {
            res.status(401).send({
              success: false,
              msg: "Authentication failed: incorrect password",
            });
          }
        });
      }
    })
    .catch((err) => next(err));
};

module.exports = { register, login };
