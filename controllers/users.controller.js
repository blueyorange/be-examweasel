const User = require("../models/users.model.js");

exports.getUsers = (req, res, next) => {
  return User.find()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  return User.findOne({ username }).then((user) => {
    if (user) {
      res.status(200).send({ user });
    } else {
      res.status(404).send({ msg: "user not found" });
    }
  });
};
