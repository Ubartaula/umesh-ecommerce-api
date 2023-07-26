const express = require("express");
const router = express();
const orderController = require("../controller/orderController");

router
  .route("/")
  .get(orderController.getOrders)
  .post(orderController.addOrder)
  .put(orderController.editOrder)
  .patch(orderController.patchOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
