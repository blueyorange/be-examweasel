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
    .then((question) => res.status(201).send({ question }))
    .catch((err) => next(err));
};

module.exports.patchQuestion = (req, res, next) => {
  const { _id } = req.params;
  const update = req.body;
  Question.findByIdAndUpdate(_id, update, { new: true })
    .exec()
    .then((question) => {
      console.log(question);
      if (!question) res.status(404).send({ msg: "Question not found." });
      return res.status(204).send();
    })
    .catch((err) => {
      err.status = 400;
      next(err);
    });
};

module.exports.deleteQuestion = (req, res, next) => {
  const { _id } = req.params;
  return Question.deleteOne({ _id })
    .then(({ deletedCount }) => {
      if (deletedCount === 0) return res.status(404).send();
      res.status(200).send();
    })
    .catch((err) => {
      err.status = 400;
      next(err);
    });
};
