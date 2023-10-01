const users = require("../models/User");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.json());

exports.register = async (req, res, next) => {
  const userdata = req.body;
  console.log(userdata);
  try {
    if (userdata.password) {
      if (!validator.isEmail(userdata.email)) {
        return res.status(400).send("Enter a valid email");
      }
      if (!validator.isStrongPassword(userdata.password)) {
        return res.status(400).send("Enter a strong password");
      }
    }

    const existingUser = await users.findOne({ email: userdata.email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(userdata.password, salt);
    const user = new users({
      email: userdata.email,
      password: hash,
      type: "EmailPassword",
    });
    const newuser = await user.save();
    const jwttoken = jwt.sign({ userId: newuser._id }, "your-secret-key");

    res
      .status(200)
      .json({ email: newuser.email, jwttoken, type: newuser.type });
  } catch (error) {
    res.status(500).json("Failed to save user");
  }
};

exports.login = async (req, res, next) => {
  const userdata = req.body;
  console.log(userdata);

  try {
    if (!validator.isEmail(userdata.email)) {
      return res.status(400).send("Enter a valid email");
    }
    const existingUser = await users.findOne({ email: userdata.email });
    if (!existingUser) {
      return res.status(400).send("Wrong email");
    }
    const match = await bcrypt.compare(
      userdata.password,
      existingUser.password
    );
    if (!match) {
      return res.status(400).send("Wrong password");
    }
    const token = jwt.sign({ userId: existingUser._id }, "your-secret-key");
    res
      .status(200)
      .json({ email: existingUser.email, token, type: existingUser.type });
  } catch (error) {
    res.status(500).json("Failed to get user");
  }
};
exports.gauth = async (req, res, next) => {
  const userdata = req.body;
  console.log(userdata);

  try {
    const existingUser = await users.findOne({ email: userdata.email });
    if (!existingUser) {
      const user = new users({
        email: userdata.email,
        token: userdata.token.credential,
        type: "Google",
      });
      const newuser = await user.save();
      res.status(200).json({
        email: newuser.email,
        token: userdata.token.credential,
        type: newuser.type,
      });
    } else {
      res.status(200).json({
        email: existingUser.email,
        token: userdata.token.credential,
        type: existingUser.type,
      });
    }
  } catch (error) {
    res.status(500).json("Failed to get user");
  }
};
exports.test = async (req, res, next) => {
  res.status(200).send("Superb you did it");
};
