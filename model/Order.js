const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userObjId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
    },
    items: [
      {
        itemObjId: { type: mongoose.Types.ObjectId, ref: "Item" },
        itemName: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        amount: { type: Number },
        isReviewed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
