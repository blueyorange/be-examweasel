const endpoints = require("../endpoints.json");

const info = async (req, res, next) => {
  try {
    res.status(200).send({ endpoints });
  } catch (error) {
    next(error);
  }
};
module.exports = info;
