const mongoose = require("mongoose");

const ExamPaperSchema = new mongoose.Schema({
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  qualification: { type: Schema.Types.ObjectId, ref: "Qualification" },
  date: Date,
});

module.exports = mongoose.model("ExamPaper", ExamPaperSchema);
