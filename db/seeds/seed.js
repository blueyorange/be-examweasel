const User = require("../../models/users.model.js");

const seed = async ({ users }) => {
  for (const user of users) {
    const newUser = new User(user);
    await newUser.save();
  }
};

module.exports = seed;
