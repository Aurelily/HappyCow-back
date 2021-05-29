const express = require("express");
const router = express.Router();

//Packages for encrypting password (uid2 and crypto-js must be install)
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

//import models
const User = require("../models/User");

//Route POST : /user/signup : New user signup in database
router.post("/user/signup", async (req, res) => {
  try {
    // Search Database : email already exist ?
    const user = await User.findOne({ email: req.fields.email });

    // If email already exist
    if (user) {
      res.status(409).json({ message: "This email already has an account" });

      // If email not exist in database
    } else {
      // Inputs verifications
      if (req.fields.email && req.fields.password && req.fields.username) {
        // If all input ok, create new User

        // Part1 : encrypting password and create token
        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);

        // Part2 : Create new User
        const newUser = new User({
          email: req.fields.email,
          token: token,
          hash: hash,
          salt: salt,
          account: {
            username: req.fields.username,
          },
        });

        // Part3 : save new user in database
        await newUser.save();
        res.status(200).json({
          _id: newUser._id,
          email: newUser.email,
          token: newUser.token,
          account: newUser.account,
        });
      } else {
        // If missing inputs parameters
        res.status(400).json({ message: "Missing parameters" });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

//Route POST : /user/signin : user login with email + password
router.post("/user/signin", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });

    if (user) {
      //if user put the good password
      if (
        SHA256(req.fields.password + user.salt).toString(encBase64) ===
        user.hash
      ) {
        res.status(200).json({
          _id: user._id,
          token: user.token,
          account: user.account,
        });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message });
  }
});

//export router
module.exports = router;
