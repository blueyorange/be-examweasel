const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  date: Date,
  tags: [{ type: String, index: true }],
  question_images: [Buffer],
  mark_scheme_images: [Buffer],
  added_by: { type: Schema.Types.ObjectId, ref: "User" },
  origin_paper: { type: Schema.Types.ObjectId, ref: "ExamPaper" },
  question_text: String,
  answer_text: String,
  description: String,
  qualification: { type: Schema.Types.ObjectId, ref: "Qualification" },
  types: [
    {
      type: String,
      enum: ["Multi-choice", "Short-answer", "Extended-answer", "Practical"],
    },
  ],
});

module.exports = mongoose.model("Question", QuestionSchema);
