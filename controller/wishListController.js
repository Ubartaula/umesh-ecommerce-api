const WishList = require("../model/WishList");

const getWishLists = async (req, res) => {
  const wishLists = await WishList.find().lean().exec();
  if (!wishLists.length)
    return res.status(400).json({ message: "no wishLists data found " });

  res.json(wishLists);
};

const addWishList = async (req, res) => {
  const { itemObjId, userObjId, itemName, image } = req.body;
  if (!itemObjId || !userObjId)
    return res.status(400).json({ message: " need itemObjId and userObj id" });

  const newObj = {
    itemObjId,
    userObjId,
    itemName,
    image,
  };

  await WishList.create(newObj);
  res.json({ message: "a new wishList created" });

  // try {
  //   await WishList.create(newObj);
  //   res.json({ message: "a new wishList created" });
  // } catch (error) {
  //   console.log(error);
  //   res.status(400).json({ message: "error at creating new wishList obj" });
  // }
};

const deleteWishList = async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res.status(400).json({ message: "id require to delete a wishList" });

  const findWishListToDelete = await WishList.findById(id).exec();
  if (!findWishListToDelete)
    return res
      .status(400)
      .json({ message: "no such wishList found to delete" });

  await findWishListToDelete.deleteOne();
  res.json({ message: `a wishList with id ${id} has deleted` });
};

module.exports = {
  getWishLists,
  addWishList,
  deleteWishList,
};
