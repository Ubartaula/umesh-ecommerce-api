const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishListSchema = new Schema({
  itemObjId: {
    type: mongoose.Types.ObjectId,
    ref: "Items",
  },
  userObjId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  itemName: {
    type: String,
  },

  image: {
    type: String,
  },
});

module.exports = mongoose.model("WishList", wishListSchema);
