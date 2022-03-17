const Document = require("../models/documents.model");

module.exports.postDocument = (req, res, next) => {
  const doc = req.body;
  Document.create(doc)
    .then((document) => {
      res.status(201).send({ document });
    })
    .catch((err) => next(err));
};

module.exports.putDocument = (req, res, next) => {
  const { _id } = req.params;
  const { question_ids } = req.body;
  return Document.findByIdAndUpdate(_id, { question_ids }, { new: true })
    .then((document) => {
      if (!document) {
        return res.status(404).send({ msg: "Document not found." });
      } else {
        return res.status(204).send();
      }
    })
    .catch((err) => {
      err.status = 400;
      next(err);
    });
};
