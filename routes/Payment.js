const express = require("express");
const router = express.Router();
const {payment } = require("../controllers/Payment");

router.route("/payment").post(payment);

module.exports = router;