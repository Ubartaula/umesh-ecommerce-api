const express = require("express");
const router = express.Router();
const resetController = require("../controller/resetPasswordController");

router.route("/").post(resetController.verifyOtp);

module.exports = router;
