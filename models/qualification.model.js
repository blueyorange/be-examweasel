const mongoose = require("mongoose");

const QualificationSchema = new mongoose.Schema({
  title: String,
  code: Number,
  exam_board: String,
});

module.exports = mongoose.model("Qualification", QualificationSchema);
