const express = require("express");
const router = express();
const itemController = require("../controller/itemController");
const upload = require("../middleware/multer");

router
  .route("/")
  .get(itemController.getItems)
  .post(upload.array("images", 6), itemController.addItem) // this image name should match front end input name
  .put(itemController.editItem)
  .patch(itemController.patchItemReview)
  .delete(itemController.deleteItem);

module.exports = router;
