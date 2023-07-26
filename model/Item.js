const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    itemCode: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },

    sku: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
    },
    price: {
      type: Number,
    },
    amount: {
      type: Number,
    },

    images: {
      type: [String],
    },
    itemDescription: {
      type: String,
    },
    review: [
      {
        userObjId: { type: mongoose.Types.ObjectId, ref: "User" },
        orderObjId: { type: mongoose.Types.ObjectId, ref: "Order" },
        text: { type: String },
        score: { type: Number },
        date: {
          type: Date,
        },
        dateNow: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);
