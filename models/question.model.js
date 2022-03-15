const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  date: Date,
  subject: String,
  award: String,
  tags: [{ type: String, index: true }],
  question_images: [Buffer],
  mark_scheme_images: [Buffer],
  added_by: { type: Schema.Types.ObjectId, ref: "User" },
  question_text: String,
  answer_text: String,
  description: String,
  topic: String,
  types: [
    {
      type: String,
      enum: ["Multi-choice", "Short-answer", "Extended-answer", "Practical"],
    },
  ],
});

module.exports = mongoose.model("Question", QuestionSchema);
