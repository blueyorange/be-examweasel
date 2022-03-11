const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;
// usernames must be 5 chars or more and may contain only letters, numbers, period, underscore
const usernameRegEx = /^([A-Za-z]+)([A-Za-z0-9_.]){4,}$/;
// password must contain at least 8 characters, one capital, one lowercase, one number, one special
const passwordRegEx =
  /^(?=.*[A-Z])(?=.*[!@£$%^&*()_+{}:"|<>?~`,./;'])(?=.*[0-9])(?=.*[a-z]).{8,}$/;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: usernameRegEx,
  },
  password: { type: String, required: true, match: passwordRegEx },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();
  // generate a salt
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  const hash = await bcrypt.hash(user.password, salt);
  // hash the password using our new salt
  user.password = hash;
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
