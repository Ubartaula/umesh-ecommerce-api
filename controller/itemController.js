const Item = require("../model/Item");
const cloudinary = require("../config/cloudinary");

const getItems = async (req, res) => {
  const items = await Item.find().lean().exec();
  if (!items.length)
    return res.status(400).json({ message: "no items data found " });

  const itemsWithAmount = await Promise.all(
    items.map(async (item) => {
      return {
        ...item,
        amount: item.price * item.quantity,
      };
    })
  );

  res.json(itemsWithAmount);
};

const addItem = async (req, res) => {
  const {
    itemCode,
    itemName,
    sku,
    quantity,
    price,
    category,
    itemDescription,
  } = req.body;
  if (!itemCode || !itemName || !sku || !category)
    return res.status(400).json({ message: " need all information" });

  const checkDuplicateItemCode = await Item.findOne({ itemCode })
    .collation({ locale: "en", strength: 2 })
    .exec();
  if (checkDuplicateItemCode)
    return res.status(409).json({ message: "item code already exist" });
  const checkDuplicateItemName = await Item.findOne({ itemName })
    .collation({ locale: "en", strength: 2 })
    .exec();
  if (checkDuplicateItemName)
    return res.status(409).json({ message: "item Name already exist" });

  const images = req.files;
  let imagesUrl = [];

  try {
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i].path);
      imagesUrl.push(result.secure_url);
    }
    const newObj = {
      itemCode,
      itemName,
      sku,
      category,
      quantity,
      price,
      images: imagesUrl,
      itemDescription,
    };

    await Item.create(newObj);
    res.json({ message: "a new item created" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error at creating new item obj" });
  }
};

const editItem = async (req, res) => {
  const {
    id,
    itemCode,
    itemName,
    sku,
    quantity,
    price,
    image,
    category,
    itemDescription,
  } = req.body;
  if (!id) return res.status(400).json({ message: "id require to edit item" });

  const findItemToEdit = await Item.findById(id).exec();
  if (!findItemToEdit)
    return res.status(400).json({ message: "no such item found to edit" });

  const checkDuplicateItemCode = await Item.findOne({ itemCode })
    .collation({ locale: "en", strength: 2 })
    .exec();
  if (checkDuplicateItemCode && checkDuplicateItemCode._id.toString() !== id)
    return res.status(409).json({ message: "item code already exist" });
  const checkDuplicateItemName = await Item.findOne({ itemName })
    .collation({ locale: "en", strength: 2 })
    .exec();
  if (checkDuplicateItemName && checkDuplicateItemName._id.toString() !== id)
    return res.status(409).json({ message: "item Name already exist" });

  if (itemCode) {
    findItemToEdit.itemCode = itemCode;
  }
  if (itemName) {
    findItemToEdit.itemName = itemName;
  }
  if (sku) {
    findItemToEdit.sku = sku;
  }
  if (category) {
    findItemToEdit.category = category;
  }
  if (quantity) {
    findItemToEdit.quantity = quantity;
  }
  if (price) {
    findItemToEdit.price = price;
  }
  if (image) {
    findItemToEdit.images = image;
  }
  if (itemDescription) {
    findItemToEdit.itemDescription = itemDescription;
  }
  await findItemToEdit.save();
  res.json({ message: `a item with id ${id} has edited` });
};

const patchItemReview = async (req, res) => {
  const { id, userObjId, text, score } = req.body;
  if (!id || !userObjId || !text || !score)
    return res
      .status(400)
      .json({ message: "item id & review property require to post review" });

  const findItemToPatchReview = await Item.findById(id).exec();
  if (!findItemToPatchReview)
    return res
      .status(400)
      .json({ message: "no such item found to patch review" });

  const newReviewObj = {
    userObjId,
    text,
    score,
    date: new Date(),
    dateNow: Date.now(),
  };

  findItemToPatchReview.review.push(newReviewObj);

  await findItemToPatchReview.save();
  res.json({ message: `a item review with id ${id} is patched` });

  //end of line
};

const deleteItem = async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res.status(400).json({ message: "id require to delete a item" });

  const findItemToDelete = await Item.findById(id).exec();
  if (!findItemToDelete)
    return res.status(400).json({ message: "no such item found to delete" });

  await findItemToDelete.deleteOne();
  res.json({ message: `a item with id ${id} has deleted` });
};

module.exports = { getItems, addItem, editItem, deleteItem, patchItemReview };
