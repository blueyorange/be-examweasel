const mongoose = require("mongoose");
require("dotenv").config();
console.log(process.cwd());

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI not set");
}

const connect = async () => {
  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connect;
