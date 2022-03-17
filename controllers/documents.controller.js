const Document = require("../models/documents.model");

module.exports.postDocument = (req, res, next) => {
  const { doc } = req.body;
  Document.create(doc)
    .then(({ document }) => {
      res.status(201).send(document);
    })
    .catch((err) => next(err));
};
