const express = require("express");
const router = express.Router();
const {register}=require("../controllers/User")
const {login}=require("../controllers/User")
const {test}=require("../controllers/User")
const {gauth} =require("../controllers/User")

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/gauth").post(gauth);
router.route("/test").get(test);

module.exports = router;
