const express = require("express");
const router = express.Router();
const { chat , chathistory} = require("../controllers/Chat");

router.route("/chat").post(chat);
router.route("/chathistory").post(chathistory);

module.exports = router;
