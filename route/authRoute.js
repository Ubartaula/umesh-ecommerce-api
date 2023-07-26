const express = require("express");
const router = express();
const authController = require("../controller/authController");

router.route("/").post(authController.login);

router.route("/refresh").get(authController.refresh);

router.route("/logout").post(authController.logout);

module.exports = router;
