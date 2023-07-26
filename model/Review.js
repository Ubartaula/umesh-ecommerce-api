const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    itemObjId: {
      type: mongoose.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    orderObjId: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userObjId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rateNumber: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
