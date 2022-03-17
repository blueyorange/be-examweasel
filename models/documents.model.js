const { Schema, model } = require("mongoose");

const DocumentSchema = new Schema(
  {
    question_ids: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    author: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = model("Document", DocumentSchema);
