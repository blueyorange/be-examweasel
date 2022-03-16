const Question = require("../models/questions.model");

module.exports.getQuestions = (req, res, next) => {
  let { limit, tags, from, to, topic, term } = req.query;
  if (!limit || limit < 0 || !Number.isInteger(limit)) limit = 100;
  const query = {};
  if (from || to) query.date = {};
  if (from) query.date.$gte = new Date(from);
  if (to) query.date.$lte = new Date(to);
  if (!Array.isArray(tags)) {
    // turn single value into array
    tags = [tags];
  }
  if (topic) query.topic = topic;
  if (term) query.question_text = { $regex: new RegExp(term, "i") };
  console.log(query);
  if (tags[0]) query.tags = { $all: tags };
  return Question.find(query)
    .limit(limit)
    .then((questions) => res.status(200).send({ questions }))
    .catch((err) => {
      err.status = 400;
      next(err);
    });
};
