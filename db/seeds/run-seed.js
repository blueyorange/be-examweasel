const seed = require("./seed.js");
const connectDB = require("../connect.js");
const devData = require("../data/dev-data");
const mongoose = require("mongoose");

const runSeed = async (data) => {
  await connectDB();
  await seed(data);
  await mongoose.connection.close();
};

runSeed(devData);
