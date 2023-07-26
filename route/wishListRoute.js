const express = require("express");
const router = express();
const wishListController = require("../controller/wishListController");
const upload = require("../middleware/multer");

// const verifyJWT = require("../middleware/verifyJWT");
// router.use(verifyJWT);

router
  .route("/")
  .get(wishListController.getWishLists)
  .post(wishListController.addWishList)
  .delete(wishListController.deleteWishList);

module.exports = router;
