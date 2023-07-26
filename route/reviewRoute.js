const express = require("express");
const router = express.Router();
const reviewController = require("../controller/reviewController");

router
  .route("/")
  .get(reviewController.getReviews)
  .post(reviewController.addReview);

module.exports = router;
