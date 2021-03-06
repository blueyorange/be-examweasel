const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  number: Number,
  date: Date,
  topic: String,
  subject: String,
  award: String,
  exam_board: String,
  tags: [{ type: String, index: true }],
  question_images: [{ type: String }],
  mark_scheme_images: [{ type: String }],
  added_by: String,
  question_text: String,
  answer_text: String,
  description: String,
});

module.exports = mongoose.model("Question", QuestionSchema);
