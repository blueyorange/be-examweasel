const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question_images: [Buffer],
  mark_scheme_images: [Buffer],
  added_by: { type: Schema.Types.ObjectId, ref: "User" },
  origin_paper: { type: Schema.Types.ObjectId, ref: "ExamPaper" },
  text_content: String,
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
