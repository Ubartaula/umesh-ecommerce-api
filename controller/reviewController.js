const Review = require("../model/Review");

const getReviews = async (req, res) => {
  const reviews = await Review.find().lean().exec();
  if (!reviews.length)
    return res.status(400).json({ message: "No reviews data available " });

  res.json(reviews);
};

const addReview = async (req, res) => {
  const { itemObjId, orderObjId, userObjId, rateNumber, text } = req.body;
  if (!itemObjId || !orderObjId || !userObjId)
    return res.status(400).json({ message: "all information required" });

  const findDuplicateOrder = await Review.findOne({ orderObjId }).exec();
  if (findDuplicateOrder)
    return res.status(409).json({ message: "review has already submitted" });

  const newReviewObj = {
    itemObjId,
    orderObjId,
    userObjId,
    rateNumber,
    text,
  };

  if (newReviewObj) {
    await Review.create(newReviewObj);
    res.json({ message: "a new review submitted" });
  } else {
    res.json({ message: "could not create new review obj" });
  }
};

module.exports = { getReviews, addReview };
