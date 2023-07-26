const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    userObjId: {
      type: mongoose.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    rateCount: {
      type: Number,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
