const users = require("../models/User");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.chat = async (req, res, next) => {
  const chatdata = req.body;
  try {
    const existingUser = await users.findOne({
      email: chatdata.userData.email,
    });

    if (!existingUser) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Before pushing chat data:", existingUser.chats);
    existingUser.chats.push(chatdata.userchat);
    existingUser.chats.push(chatdata.assistantchat);

    await existingUser.save();
    console.log("User saved with updated chat data:", existingUser);

    res.status(200).json({ message: "Chat data saved successfully" });
  } catch (error) {
    console.error("Error saving chat data:", error.message);
    res
      .status(500)
      .json({ message: "Failed to save chat data", error: error.message });
  }
};
exports.chathistory = async (req, res, next) => {
    const userdata = req.body;
    console.log("userData:", userdata);
    console.log("userData:", userdata.user.email);

    try {
      const existingUser = await users.findOne({
        email: userdata.user.email,
      });
  
      if (!existingUser) {
        console.log("User not found");
        return res.status(404).json({ message: "User not found" });
      }

      console.log("chat data:", existingUser.chats);
    
      res.status(200).json({ chats: existingUser.chats });
    } catch (error) {
      console.error("Error reading chat data:", error.message);
      res
        .status(500)
        .json({ message: "Failed to read chat data", error: error.message });
    }
  };