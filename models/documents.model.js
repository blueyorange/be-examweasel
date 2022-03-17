const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  questions: [{ type: Schema.Types.objectId, ref: "Question" }],
  author: [{ type: Schema.Types.objectId, ref: "User" }],
  created: Date,
  share: Boolean,
});

module.exports = mongoose.model("Document", DocumentSchema);
