const Order = require("../model/Order");
const Item = require("../model/Item");
const User = require("../model/User");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.emailUser,
    pass: process.env.emailPass,
  },
});

const getOrders = async (req, res) => {
  const orders = await Order.find().lean().exec();
  if (!orders.length)
    return res.status(400).json({ message: "no orders data found " });

  const ordersWithDetails = await Promise.all(
    orders.map(async (order) => {
      // const item = await Item.findById(order.itemObjId).exec();
      const user = await User.findById(order.userObjId).exec();
      return {
        ...order,
        // itemName: item?.itemItemName,
        // price: item?.price,
        // amount: order?.quantity * order?.price,
        // username: user.username,
      };
    })
  );

  res.json(ordersWithDetails);
};

const addOrder = async (req, res) => {
  const {
    userObjId,
    username,
    items: [{ itemObjId, itemName, price, quantity, amount }],
  } = req.body;

  if (
    !userObjId ||
    !username ||
    !itemObjId ||
    !itemName ||
    !price ||
    !quantity ||
    !amount
  )
    return res.status(400).json({ message: "all info required" });

  const newOrderObj = {
    userObjId,
    username,
    items: req?.body?.items?.map((item) => {
      return {
        itemObjId: item?.itemObjId,
        itemName: item?.itemName,
        price: item?.price,
        quantity: item?.quantity,
        amount: item?.amount,
      };
    }),
  };

  await Order.create(newOrderObj);
  res.json({ message: "a item added to order " });
};

const editOrder = async (req, res) => {
  const { id, itemObjId, quantity } = req.body;
  if (!id) return res.status(400).json({ message: "id require to edit order" });
};

const patchOrder = async (req, res) => {
  const { id, _id, quantity, isReviewed } = req.body;
  if (!id) return res.status(400).json({ message: "id require to edit order" });

  const findOrderToEdit = await Order.findById(id).exec();
  if (!findOrderToEdit)
    return res.status(400).json({ message: "no such order found to edit" });

  const findItemFromOrder = findOrderToEdit.items?.find(
    (item) => item?.id === _id
  );

  if (!findItemFromOrder)
    return res.status(400).json({ message: "no such item fom order found" });

  if (quantity) {
    findItemFromOrder.quantity = quantity;
  }

  if (isReviewed) {
    findItemFromOrder.isReviewed = isReviewed;
  }

  await findOrderToEdit.save();

  res.json({ message: `review for item id ${_id} posted` });
};

const deleteOrder = async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res.status(400).json({ message: "id require to delete a order" });

  const findOrderToDelete = await Order.findById(id).exec();
  if (!findOrderToDelete)
    return res.status(400).json({ message: "no such order found to delete" });

  await findOrderToDelete.deleteOne();
  res.json({ message: `a order with id ${id} has deleted` });
};

module.exports = { getOrders, addOrder, editOrder, deleteOrder, patchOrder };
