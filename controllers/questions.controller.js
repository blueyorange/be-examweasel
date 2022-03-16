const Question = require("../models/questions.model");

module.exports.getQuestions = (req, res, next) => {
  let { limit, tags, from, to } = req.query;
  console.log(tags);
  if (!limit || limit < 0 || !Number.isInteger(limit)) limit = 100;
  const query = {};
  if (from) query.date.$gte = from;
  if (to) query.date.$lte = to;
  if (!Array.isArray(tags)) {
    // turn single value into array
    tags = [tags];
  }
  if (tags[0]) query.tags = { $all: tags };
  console.log(query);
  return Question.find(query)
    .limit(limit)
    .then((questions) => res.status(200).send({ questions }))
    .catch((err) => next(err));
};
