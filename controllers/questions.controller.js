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
  if (tags[0]) query.tags = { $all: tags };
  return Question.find(query)
    .limit(limit)
    .then((questions) => res.status(200).send({ questions }))
    .catch((err) => {
      err.status = 400;
      next(err);
    });
};

module.exports.postQuestion = (req, res, next) => {
  const newQuestion = req.body;
  return Question.create(newQuestion)
    .then((question) => res.status(200).send({ question }))
    .catch((err) => next(err));
};

module.exports.putQuestion = (req, res, next) => {
  const { _id } = req.params;
  const update = req.body;
  return Question.findByIdAndUpdate(_id, update, { new: true })
    .then((question) => {
      if (!question) res.status(404).send({ msg: "Question not found." });
      res.status(204).send({ question });
    })
    .catch((err) => {
      err.status = 400;
      next(err);
    });
};
